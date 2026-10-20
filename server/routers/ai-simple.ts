import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { generateText } from '../_core/gemini';
import { generateImage } from '../_core/imageGeneration';
import { checkRateLimit, getClientKey, trackAiUsage } from '../ai-usage';
import { TRPCError } from '@trpc/server';

const CHATBOT_SYSTEM_INSTRUCTION = `You are a helpful assistant for Reese Astor's author website. You help readers learn about her Manhattan Money Kings romance series.

**About the Series:**
The Manhattan Money Kings is a steamy billionaire romance series set in Manhattan featuring powerful billionaires:

1. **The Billionaire's Executive Assistant** (Book 1)
   - Hero: Michael Hastings (billionaire, Chen Technologies executive)
   - Heroine: Sarah Shah (executive assistant)
   - Plot: Sarah needs the job to pay her mother's medical bills. When she uncovers financial sabotage on Michael's Redwood project, they're forced into a dangerous alliance amid corporate espionage.
   - Trope: Boss/employee, forbidden romance, corporate intrigue
   - Price: $3.99 (Kindle), $19.99 (Print)
   - Amazon: https://www.amazon.com/dp/B0F2W8QL7S

2. **The Billionaire's Fake Wife** (Book 2)
   - Hero: David Kim (billionaire, Harvard MBA, Fortune 500 CEO)
   - Heroine: Elena Volkov (gymnast turned thief)
   - Plot: Elena's father forces her to steal corporate secrets from David. When David catches her breaking into his penthouse, he offers a deal: help him expose her father's criminal empire.
   - Trope: Enemies to lovers, redemption, corporate espionage
   - Price: $3.99 (Kindle), $19.99 (Print)
   - Amazon: https://www.amazon.com/dp/B0FCCBNF8X

3. **The Billionaire's Baby Secret** (Book 3)
   - Hero: Dominic Kane (billionaire, Kane Industries CEO)
   - Heroine: Sophia Reed (CMO at Kane Industries, youngest in company history)
   - Daughter: Bella (24 months old)
   - Plot: Three years ago, Sophia walked away from Dominic. Now he's back and discovers the daughter she kept hidden. Set in Hudson Yards, Manhattan.
   - Trope: Second chance romance, secret baby, workplace romance
   - Price: $3.99 (Kindle), $19.99 (Print)
   - Amazon: https://www.amazon.com/dp/B0DRZG5KKD

4. **The Billionaire's Forbidden Nanny: Forbidden and Forever** (Book 4 - FINAL BOOK)
   - Hero: Ethan Calloway (billionaire widower)
   - Heroine: Camille Torres (nanny from the Bronx)
   - Child: Lily (5-year-old, selectively mute since mother's death)
   - Antagonist: Gloria Calloway (Ethan's mother, wants custody)
   - Plot: Camille takes a nanny job caring for Ethan's silent daughter Lily. As Lily begins to heal, Camille and Ethan fall for each other. Gloria threatens custody to tear them apart.
   - Trope: Nanny romance, single dad, forbidden love, found family
   - Price: $3.99 (Kindle), $19.99 (Print)
   - Amazon: https://swiy.co/4rd

**FREE Prequel:** The Billionaire's One Night Stand
- Hero: James Chen (billionaire tech mogul)
- Heroine: Victoria (corporate lawyer)
- Plot: One night stand between a lawyer passed over for partnership and a powerful tech billionaire
- Available free at: https://swiy.co/05
- Also on Amazon: https://www.amazon.com/dp/B0DSG7NKGP

**Important:** The heroes are NOT brothers - they are separate Manhattan billionaires.

**About Reese Astor:**
Reese writes steamy contemporary romance and also offers writing coaching for aspiring romance authors.

Keep responses friendly, enthusiastic about romance, and always include relevant book links when discussing the series.`;

export const aiRouter = router({
  /**
   * Chat with AI about books and series
   */
  chat: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { message } = input;
      const clientKey = getClientKey(ctx.req);

      if (!checkRateLimit(clientKey, "chat")) {
        trackAiUsage({
          feature: "chat",
          model: "gemini-1.5-flash",
          inputChars: message.length,
          outputChars: 0,
          status: "rate-limited",
          key: clientKey,
        });
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You're sending messages too quickly. Please wait a moment and try again.",
        });
      }

      try {
        const response = await generateText(message, CHATBOT_SYSTEM_INSTRUCTION);
        trackAiUsage({
          feature: "chat",
          model: "gemini-1.5-flash",
          inputChars: message.length + CHATBOT_SYSTEM_INSTRUCTION.length,
          outputChars: response.length,
          key: clientKey,
        });
        return { response };
      } catch (error) {
        console.error('[AI Chat] Error:', error);
        trackAiUsage({
          feature: "chat",
          model: "gemini-1.5-flash",
          inputChars: message.length,
          outputChars: 0,
          status: "error",
          key: clientKey,
        });
        throw new Error('Failed to generate response. Please try again.');
      }
    }),

  /**
   * Character Match Quiz - Submit answers and get AI-generated result
   */
  submitQuiz: publicProcedure
    .input(
      z.object({
        answers: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { answers } = input;

      const quizPrompt = `Based on these quiz answers about romance preferences and personality traits, determine which Manhattan Money King the person would match with best and provide a detailed personality analysis.

Quiz Answers: ${JSON.stringify(answers)}

The three characters are:
1. Michael Hastings (Book 1) - Demanding, brilliant CEO of Chen Technologies, workaholic who values excellence and competence, protective once he commits
2. David Kim (Book 2) - Sharp, strategic Fortune 500 CEO, careful and calculating, sees through deception but believes in redemption
3. Dominic Kane (Book 3) - Intense, powerful Kane Industries CEO, never gives up on what's his, second-chance romantic who fights for family

Respond in JSON format:
{
  "character": "Michael Hastings" | "David Kim" | "Dominic Kane",
  "matchPercentage": 85,
  "personality": "A detailed 2-3 sentence personality analysis explaining why they match",
  "bookRecommendation": "The Billionaire's Executive Assistant" | "The Billionaire's Fake Wife" | "The Billionaire's Baby Secret",
  "bookLink": "https://www.amazon.com/dp/B0F2W8QL7S" | "https://www.amazon.com/dp/B0FCCBNF8X" | "https://www.amazon.com/dp/B0DRZG5KKD",
  "reason": "Why this book is perfect for them"
}`;

      try {
        const result = await generateText(quizPrompt);
        const parsedResult = JSON.parse(result);
        return parsedResult;
      } catch (error) {
        console.error('[Quiz] Error:', error);
        throw new Error('Failed to generate quiz result. Please try again.');
      }
    }),

  /**
   * Generate blog post with AI assistance
   */
  generateBlogPost: publicProcedure
    .input(
      z.object({
        topic: z.string().min(5).max(200),
        tone: z.enum(['professional', 'casual', 'inspirational']),
        length: z.enum(['short', 'medium', 'long']),
      })
    )
    .mutation(async ({ input }) => {
      const { topic, tone, length } = input;

      const lengthGuide = {
        short: '300-500 words',
        medium: '700-1000 words',
        long: '1500-2000 words',
      };

      const prompt = `Write a ${tone} blog post about "${topic}" for a romance author's website. The post should be ${lengthGuide[length]} and include:
- An engaging title
- A compelling introduction
- 3-4 main points with examples
- A conclusion with a call-to-action
- SEO-friendly formatting with headers

Target audience: Aspiring romance writers and romance readers.

Format the response as markdown.`;

      try {
        const blogContent = await generateText(prompt);
        return { content: blogContent };
      } catch (error) {
        console.error('[Blog Generator] Error:', error);
        throw new Error('Failed to generate blog post. Please try again.');
      }
    }),

  /**
   * Generate story ideas for coaching clients
   */
  generateStoryIdea: publicProcedure
    .input(
      z.object({
        genre: z.string(),
        tropes: z.array(z.string()),
        setting: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { genre, tropes, setting } = input;

      const prompt = `Generate a unique and compelling story idea for a ${genre} romance novel with these tropes: ${tropes.join(', ')}${setting ? ` set in ${setting}` : ''}.

Provide:
1. A catchy title
2. A 2-3 sentence logline/hook
3. Main character descriptions (hero and heroine)
4. Central conflict
5. Unique twist that makes it stand out
6. Suggested heat level (sweet, steamy, or scorching)

Format as JSON with these exact keys: title, logline, hero, heroine, conflict, twist, heatLevel`;

      try {
        const storyIdea = await generateText(prompt);
        const parsedIdea = JSON.parse(storyIdea);
        return parsedIdea;
      } catch (error) {
        console.error('[Story Generator] Error:', error);
        throw new Error('Failed to generate story idea. Please try again.');
      }
    }),

  /**
   * Generate book cover with AI
   */
  generateBookCover: publicProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        style: z.enum(['romantic', 'dark', 'luxurious', 'playful']),
      })
    )
    .mutation(async ({ input }) => {
      const { title, subtitle, style } = input;

      const stylePrompts = {
        romantic: 'soft pink and gold tones, elegant script font, romantic couple silhouette, dreamy atmosphere',
        dark: 'dark moody colors, dramatic lighting, mysterious atmosphere, intense romance',
        luxurious: 'gold and black, luxury aesthetic, Manhattan skyline, expensive feel, high-end design',
        playful: 'bright colors, fun typography, lighthearted romantic vibe, cheerful',
      };

      const prompt = `Professional romance book cover design for "${title}"${subtitle ? ` - ${subtitle}` : ''}. Style: ${stylePrompts[style]}. High quality, bestseller aesthetic, clean typography, romance genre indicators, professional book cover design.`;

      try {
        const { url } = await generateImage({ prompt });
        return { imageUrl: url };
      } catch (error) {
        console.error('[Book Cover Generator] Error:', error);
        throw new Error('Failed to generate book cover. Please try again.');
      }
    }),

  /**
   * Generate character portrait
   */
  generateCharacterPortrait: publicProcedure
    .input(
      z.object({
        description: z.string().min(20).max(500),
      })
    )
    .mutation(async ({ input }) => {
      const { description } = input;

      const prompt = `Professional character portrait for a romance novel: ${description}. Photorealistic style, attractive, romance book cover quality, professional lighting, detailed facial features, high quality portrait.`;

      try {
        const { url } = await generateImage({ prompt });
        return { imageUrl: url };
      } catch (error) {
        console.error('[Character Portrait] Error:', error);
        throw new Error('Failed to generate character portrait. Please try again.');
      }
    }),

  /**
   * Generate social media graphic
   */
  generateSocialGraphic: publicProcedure
    .input(
      z.object({
        text: z.string(),
        platform: z.enum(['instagram', 'facebook', 'pinterest']),
        theme: z.enum(['book_promo', 'quote', 'announcement']),
      })
    )
    .mutation(async ({ input }) => {
      const { text, platform, theme } = input;

      const dimensions = {
        instagram: '1080x1080 square format',
        facebook: '1200x628 landscape format',
        pinterest: '1000x1500 vertical pin format',
      };

      const prompt = `${dimensions[platform]} social media graphic for ${theme}. Text overlay: "${text}". Luxury romance author branding, gold and black color scheme, professional typography, eye-catching design optimized for ${platform}, high quality social media post.`;

      try {
        const { url } = await generateImage({ prompt });
        return { imageUrl: url };
      } catch (error) {
        console.error('[Social Graphic] Error:', error);
        throw new Error('Failed to generate social graphic. Please try again.');
      }
    }),
});
