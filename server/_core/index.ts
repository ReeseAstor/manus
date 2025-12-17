import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { stripe, STRIPE_WEBHOOK_SECRET } from "./stripe";
import { getDb } from "../db";
import { orders, userPurchases, products } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Stripe webhook handler (must be before json body parser for raw body)
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"] as string;

      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          STRIPE_WEBHOOK_SECRET
        );

        // Handle checkout.session.completed
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as any;
          const db = await getDb();
          
          if (db) {
            // Update order status
            await db
              .update(orders)
              .set({
                status: "completed",
                stripePaymentIntentId: session.payment_intent,
                customerEmail: session.customer_email,
              })
              .where(eq(orders.stripeSessionId, session.id));

            // Get the order to find product and user
            const [order] = await db
              .select()
              .from(orders)
              .where(eq(orders.stripeSessionId, session.id));

            if (order && order.userId) {
              // Get product to find associated book IDs
              const [product] = await db
                .select()
                .from(products)
                .where(eq(products.id, order.productId));

              if (product) {
                // Parse features to get book IDs (stored as JSON array)
                let bookIds: number[] = [];
                try {
                  const features = product.features ? JSON.parse(product.features) : [];
                  // Look for bookIds in features or use product metadata
                  if (Array.isArray(features)) {
                    bookIds = features
                      .filter((f: any) => typeof f === "number")
                      .map((f: any) => f);
                  }
                  // If no book IDs in features, try to extract from product name
                  if (bookIds.length === 0) {
                    // For bundles, we'll need to add all books
                    // For now, we'll create a purchase for the product itself
                    // In production, you'd have a product_books junction table
                  }
                } catch (e) {
                  console.error("Failed to parse product features:", e);
                }

                // Create user purchase record(s)
                // For now, create a single purchase linking to the order
                // In production, you'd iterate over bookIds
                if (bookIds.length > 0) {
                  for (const bookId of bookIds) {
                    await db.insert(userPurchases).values({
                      userId: order.userId,
                      bookId: bookId,
                      orderId: order.id,
                      purchaseType: bookIds.length > 1 ? "bundle" : "single",
                      purchasePrice: Math.floor(order.amount / bookIds.length),
                    });
                  }
                }
              }
            }

            console.log(`[Stripe] Checkout completed for session ${session.id}`);
          }
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error(`[Stripe] Webhook error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
