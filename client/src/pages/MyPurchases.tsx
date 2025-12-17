import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  Download, 
  BookOpen, 
  ShoppingBag, 
  Clock, 
  FileText, 
  Tablet, 
  Smartphone,
  CheckCircle,
  Gift,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Purchase {
  id: number;
  bookId: number;
  bookTitle: string;
  bookCover: string;
  bookSlug: string;
  purchaseType: "single" | "bundle";
  purchasePrice: number;
  bonusContentUnlocked: boolean | null;
  downloadCount: number | null;
  lastDownloadAt: Date | null;
  purchasedAt: Date;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  
  const { data: downloads, isLoading: loadingDownloads } = trpc.purchases.getDownloads.useQuery(
    { bookId: purchase.bookId },
    { enabled: true }
  );

  const handleDownload = async (format: "epub" | "mobi" | "pdf") => {
    setDownloading(format);
    try {
      // In a real implementation, this would fetch a signed URL and trigger download
      // For now, we'll show a toast with the format
      toast.success(`Downloading ${purchase.bookTitle} in ${format.toUpperCase()} format`);
      
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would do:
      // const result = await trpc.purchases.getDownloadUrl.query({ bookId: purchase.bookId, format });
      // window.open(result.url, '_blank');
    } catch (error) {
      toast.error("Failed to start download. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="bg-[#0f1420]/80 border-[#d4af37]/20 overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Book Cover */}
        <div className="md:w-48 flex-shrink-0">
          <Link href={`/books/${purchase.bookSlug}`}>
            <img
              src={purchase.bookCover}
              alt={purchase.bookTitle}
              className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link href={`/books/${purchase.bookSlug}`}>
                <h3 className="text-xl font-serif text-white hover:text-[#d4af37] transition-colors">
                  {purchase.bookTitle}
                </h3>
              </Link>
              <p className="text-gray-400 text-sm mt-1">
                Purchased {formatDate(purchase.purchasedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {purchase.purchaseType === "bundle" && (
                <Badge variant="outline" className="border-[#d4af37]/50 text-[#d4af37]">
                  <Gift className="w-3 h-3 mr-1" />
                  Bundle
                </Badge>
              )}
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Owned
              </Badge>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Paid: {formatPrice(purchase.purchasePrice)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>Downloads: {purchase.downloadCount || 0}</span>
            </div>
            {purchase.lastDownloadAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Last: {formatDate(purchase.lastDownloadAt)}</span>
              </div>
            )}
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300 font-medium">Download Your Book:</p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10"
                onClick={() => handleDownload("epub")}
                disabled={downloading === "epub"}
              >
                <Tablet className="w-4 h-4 mr-2" />
                {downloading === "epub" ? "Downloading..." : "ePub"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10"
                onClick={() => handleDownload("mobi")}
                disabled={downloading === "mobi"}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {downloading === "mobi" ? "Downloading..." : "Kindle (Mobi)"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10"
                onClick={() => handleDownload("pdf")}
                disabled={downloading === "pdf"}
              >
                <FileText className="w-4 h-4 mr-2" />
                {downloading === "pdf" ? "Downloading..." : "PDF"}
              </Button>
            </div>
          </div>

          {/* Bonus Content */}
          {purchase.bonusContentUnlocked && (
            <div className="mt-4 pt-4 border-t border-[#d4af37]/10">
              <Link href="/reader-club">
                <Button variant="ghost" size="sm" className="text-[#d4af37] hover:text-[#d4af37]/80 p-0">
                  <Gift className="w-4 h-4 mr-2" />
                  Access Bonus Content
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function PurchaseSkeleton() {
  return (
    <Card className="bg-[#0f1420]/80 border-[#d4af37]/20 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="w-full md:w-48 h-64 bg-[#1a1f2e]" />
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-6 w-2/3 bg-[#1a1f2e]" />
          <Skeleton className="h-4 w-1/3 bg-[#1a1f2e]" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 bg-[#1a1f2e]" />
            <Skeleton className="h-4 w-24 bg-[#1a1f2e]" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-20 bg-[#1a1f2e]" />
            <Skeleton className="h-9 w-28 bg-[#1a1f2e]" />
            <Skeleton className="h-9 w-20 bg-[#1a1f2e]" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function MyPurchases() {
  const { user, loading: authLoading } = useAuth();
  const { data: purchases, isLoading: purchasesLoading } = trpc.purchases.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Not logged in state
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="bg-[#0f1420]/80 border-[#d4af37]/20 text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
              <h1 className="text-3xl font-serif text-white mb-4">Sign In to View Your Library</h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Access your purchased ebooks and download them in multiple formats. 
                Sign in to view your complete library.
              </p>
              <Button
                asChild
                className="bg-[#d4af37] hover:bg-[#b8972f] text-[#0a0e1a] font-semibold"
              >
                <a href={getLoginUrl()}>Sign In to Continue</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm font-medium">My Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Your <span className="text-[#d4af37]">Purchased</span> Books
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Download your ebooks in any format. All purchases include ePub, Mobi (Kindle), and PDF formats.
          </p>
        </div>

        {/* Loading State */}
        {(authLoading || purchasesLoading) && (
          <div className="space-y-6">
            <PurchaseSkeleton />
            <PurchaseSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!purchasesLoading && purchases?.length === 0 && (
          <Card className="bg-[#0f1420]/80 border-[#d4af37]/20 text-center py-16">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-serif text-white mb-4">No Purchases Yet</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You haven't purchased any books yet. Browse our collection and start building your library!
              </p>
              <Button
                asChild
                className="bg-[#d4af37] hover:bg-[#b8972f] text-[#0a0e1a] font-semibold"
              >
                <Link href="/shop">Browse Books</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Purchases List */}
        {purchases && purchases.length > 0 && (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase as Purchase} />
            ))}
          </div>
        )}

        {/* Help Section */}
        {purchases && purchases.length > 0 && (
          <Card className="bg-[#0f1420]/50 border-[#d4af37]/10 mt-12">
            <CardHeader>
              <CardTitle className="text-white text-lg">Need Help?</CardTitle>
              <CardDescription className="text-gray-400">
                Having trouble downloading or reading your books?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-400 space-y-2">
              <p>
                <strong className="text-white">ePub:</strong> Works with Apple Books, Google Play Books, Kobo, and most e-readers.
              </p>
              <p>
                <strong className="text-white">Mobi:</strong> Best for Kindle devices. Send to your Kindle via email or USB.
              </p>
              <p>
                <strong className="text-white">PDF:</strong> Universal format for reading on any device or printing.
              </p>
              <p className="pt-2">
                Questions? <Link href="/contact" className="text-[#d4af37] hover:underline">Contact me</Link> and I'll help you get reading!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
