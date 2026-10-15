import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// First, get the admin user (owner)
const users = await db.select().from(schema.users).where(schema.users.role.eq('admin')).limit(1);

if (users.length === 0) {
  console.error('No admin user found. Please log in first to create an admin user.');
  process.exit(1);
}

const adminUser = users[0];

const samplePosts = [
  {
    title: "5 Essential Tips for Writing Steamy Romance Scenes",
    slug: "writing-steamy-romance-scenes",
    excerpt: "Learn how to write compelling, authentic intimate scenes that enhance your story and connect with readers on an emotional level.",
    content: `Writing steamy romance scenes is both an art and a skill that can elevate your romance novel from good to unforgettable. Whether you're writing your first intimate scene or your hundredth, these five essential tips will help you craft moments that resonate with readers and enhance your story.

## 1. Build Emotional Tension First

The best intimate scenes aren't just about physical attraction—they're the culmination of emotional connection. Before your characters come together physically, ensure you've built a foundation of emotional tension. Show us why these characters are drawn to each other beyond surface-level attraction.

Consider their shared vulnerabilities, the obstacles they've overcome together, and the emotional walls they've broken down. When readers are emotionally invested in your characters' relationship, the intimate scenes become powerful expressions of that connection rather than isolated moments.

## 2. Use All Five Senses

Don't limit yourself to describing what your characters see. Engage all five senses to create an immersive, visceral experience. What do they hear—their partner's breathing, whispered words, the rustle of sheets? What scents surround them—cologne, perfume, or natural body chemistry?

Texture matters too. Describe the softness of skin, the roughness of stubble, the smoothness of silk sheets. Even taste can play a role. These sensory details ground readers in the moment and make scenes feel authentic and immediate.

## 3. Show Character Through Action

Intimate scenes are perfect opportunities for character development. How your characters behave in vulnerable moments reveals who they truly are. Is your billionaire hero surprisingly gentle? Does your strong heroine let down her guard?

Use these scenes to deepen characterization. Show how past experiences influence present behavior, how trust is built or tested, and how characters grow through intimacy. Every touch, every word, every reaction should feel true to who your characters are.

## 4. Vary Your Pacing and Intensity

Not every intimate scene needs to be a fireworks display. Vary the pacing and intensity throughout your book. Some scenes might be slow and tender, others passionate and urgent. This variation keeps readers engaged and prevents scenes from feeling formulaic.

Consider the emotional context of each scene. A reunion after separation might be desperate and intense, while a morning-after scene could be playful and sweet. Let the emotional stakes and story context guide the tone and pacing of each intimate moment.

## 5. Edit with Confidence

Many writers feel uncertain when editing intimate scenes. Remember that romance readers choose the genre because they enjoy these moments. Don't shy away from sensuality, but do ensure every scene serves the story and character development.

During editing, check that your word choices feel natural rather than clinical or overly flowery. Read scenes aloud to catch awkward phrasing. Most importantly, trust your voice and your readers' intelligence. You don't need to explain everything—leave room for readers' imagination.

## Final Thoughts

Writing compelling intimate scenes takes practice, but these fundamentals will serve you well. Focus on emotional connection, engage the senses, reveal character, vary your approach, and edit with confidence. Your readers will appreciate the authenticity and depth you bring to these crucial moments in your romance novels.`,
    category: "Writing Tips",
    readTime: "8 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-11-15'),
  },
  {
    title: "From Zero to Published: My Self-Publishing Journey",
    slug: "self-publishing-journey",
    excerpt: "How I went from corporate VP to full-time romance author, and the lessons I learned along the way about KDP publishing.",
    content: `Five years ago, I was a Vice President at a Fortune 500 company, working 60-hour weeks and dreaming of a different life. Today, I'm a romance author with multiple series and a thriving author business. This is the story of how I made that transformation—and what I learned along the way.

## The Beginning: Writing in Secret

I started writing romance novels in secret during my lunch breaks and on weekends. For two years, I didn't tell anyone except my closest friends. I was terrified of judgment, of failure, of being seen as unprofessional. But the stories kept coming, and eventually, I had three completed manuscripts sitting on my hard drive.

The turning point came when I realized I was more afraid of never trying than of failing. I decided to publish my first book on Amazon KDP, using a pen name to protect my corporate identity. I gave myself one year to see what would happen.

## The Learning Curve: Mistakes and Breakthroughs

My first book sold 12 copies in its first month—mostly to friends and family. I was devastated. But instead of giving up, I dove into learning everything I could about self-publishing, marketing, and the romance genre.

I made every mistake in the book: terrible covers, weak blurbs, no email list, inconsistent publishing schedule. But each mistake taught me something valuable. I invested in professional covers, hired an editor, studied successful authors' strategies, and most importantly, I kept writing.

The breakthrough came with my third book. I'd learned enough about Amazon's algorithms, reader expectations, and marketing to position it correctly. It hit the top 100 in its category within the first week. Suddenly, all three of my books started selling. I'd found my audience.

## The Transition: Leaving Corporate America

By the end of my first year, I was making enough from my books to cover my mortgage. By year two, I was earning half my corporate salary from writing. The decision to leave my VP position wasn't easy—I was walking away from security, prestige, and a clear career path.

But I was also walking toward creative freedom, flexible hours, and the ability to build something entirely my own. I gave my notice, and for the first time in my adult life, I felt like I was living authentically.

## The Business: Treating Writing Like a Career

The biggest lesson I learned is that successful self-publishing requires treating writing like a business, not just a creative pursuit. This means:

**Consistent Publishing:** I release at least four books per year, maintaining reader engagement and algorithm visibility.

**Professional Standards:** Every book gets professional editing, cover design, and formatting. Quality matters.

**Marketing Investment:** I allocate 20% of my revenue to marketing—ads, newsletters, promotional campaigns.

**Reader Relationships:** I built an email list from day one and nurture those relationships with exclusive content and genuine engagement.

**Financial Management:** I track expenses, plan for taxes, and reinvest strategically in my business growth.

## The Reality: It's Not All Glamorous

Let me be honest: self-publishing isn't a get-rich-quick scheme. It requires consistent work, continuous learning, and emotional resilience. There are months when sales dip, reviews sting, and imposter syndrome hits hard.

But there are also moments of pure magic: fan emails that bring tears to your eyes, seeing your book on a bestseller list, the freedom to write the stories you love, and the satisfaction of building something from nothing.

## Advice for Aspiring Authors

If you're considering self-publishing, here's what I wish someone had told me:

1. **Start before you're ready.** You'll never feel completely prepared. Publish that first book.

2. **Invest in quality.** Professional covers and editing aren't optional—they're essential.

3. **Build your email list from day one.** It's your most valuable asset.

4. **Write in a series.** Reader retention and discoverability improve dramatically with series.

5. **Learn the business side.** Understanding Amazon's algorithms, advertising, and marketing is as important as writing well.

6. **Connect with other authors.** The indie author community is incredibly supportive. Don't try to do this alone.

7. **Be patient but persistent.** Success rarely happens overnight, but it does happen for those who keep showing up.

## Looking Forward

Today, I have 15 published books, a six-figure author income, and the freedom to work from anywhere. I've helped dozens of aspiring authors through coaching and mentorship. But the best part? I get to spend my days creating stories I love and connecting with readers who love them too.

If you're dreaming of becoming a published author, know that it's possible. It won't be easy, but it will be worth it. Your stories deserve to be shared with the world. Take that first step—you might surprise yourself with how far you can go.`,
    category: "Author Journey",
    readTime: "12 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-11-10'),
  },
  {
    title: "Building Your Author Brand on Social Media",
    slug: "author-brand-social-media",
    excerpt: "Practical strategies for growing your author platform on Instagram and Facebook without spending hours online every day.",
    content: `As a romance author, your social media presence can be a powerful tool for connecting with readers, building your brand, and ultimately selling more books. But between writing, publishing, and living your life, who has time to be constantly online? Here's how to build an effective author platform without social media taking over your life.

## Define Your Brand Identity First

Before posting anything, get clear on your author brand. What makes you unique? What themes run through your books? What personality do you want to project? Your brand should feel authentic to you while appealing to your target readers.

For romance authors, consider: Are you the sultry seductress, the girl-next-door, the empowerment advocate, or the romantic dreamer? Your brand influences everything from your visual aesthetic to your caption voice to the content you share.

## Choose Your Platforms Strategically

You don't need to be everywhere. Focus on 1-2 platforms where your readers actually hang out. For romance authors, Instagram and Facebook are typically most effective, though TikTok (BookTok) is increasingly powerful for reaching younger readers.

Instagram works well for visual storytelling, behind-the-scenes content, and building an aspirational brand. Facebook is excellent for community building, reader groups, and longer-form engagement. Choose based on where you feel most comfortable and where your ideal readers spend time.

## Batch Create Your Content

Instead of posting in real-time throughout the week, dedicate 2-3 hours once a week to batch create content. Plan your posts, write captions, and schedule everything in advance using tools like Later, Planoly, or Meta Business Suite.

This approach is more efficient and ensures consistency even during busy writing weeks. Create content themes for different days (e.g., Monday motivation, Wednesday writing tips, Friday book recommendations) to streamline the creation process.

## The 80/20 Rule for Content

Only 20% of your content should be direct book promotion. The other 80% should provide value, entertainment, or connection. Share writing tips, behind-the-scenes glimpses of your process, book recommendations, personal stories, or relatable memes about the writing life.

Readers follow authors they feel connected to, not authors who constantly sell to them. Build relationships first, and sales will follow naturally.

## Engage Authentically (But Efficiently)

Set aside 15-20 minutes twice daily for genuine engagement: respond to comments, reply to DMs, and interact with other accounts in your niche. Use this time intentionally rather than scrolling endlessly.

Authentic engagement builds community and increases your visibility through algorithms. But protect your time—set a timer and stick to it.

## Leverage User-Generated Content

Encourage readers to share photos with your books, tag you in posts, and use your branded hashtag. Reshare this content (with permission) to fill your feed with authentic social proof while giving readers recognition.

Reader photos, reviews, and testimonials are more powerful than any promotional post you could create. Make it easy for fans to create and share content about your books.

## Create Reusable Content Templates

Design 5-10 Canva templates for different post types (quote graphics, book announcements, reader questions, etc.). When you need content, simply swap out the text and images rather than starting from scratch each time.

Templates ensure brand consistency while dramatically reducing creation time. Your feed will look cohesive and professional with minimal effort.

## Track What Works

Pay attention to which posts get the most engagement, saves, and shares. Double down on content types that resonate with your audience. If writing tips perform well, create more. If personal stories connect, share more of your journey.

Use Instagram Insights or Facebook Analytics to identify your best-performing content and optimal posting times. Let data guide your strategy rather than guessing.

## Don't Chase Viral—Build Community

Viral posts might boost your follower count temporarily, but engaged community members buy books. Focus on attracting and nurturing your ideal readers rather than chasing massive numbers.

A thousand engaged fans who love your work are infinitely more valuable than 10,000 followers who don't care about romance novels.

## Protect Your Creative Energy

Social media should support your author career, not consume it. If you find yourself spending more time on Instagram than writing, reassess your strategy. Your books are your most important marketing tool—don't sacrifice writing time for social media.

Consider taking social media breaks during intensive writing periods. Your true fans will still be there when you return, and your mental health will thank you.

## Final Thoughts

Building an author brand on social media is a marathon, not a sprint. Consistency matters more than perfection. Show up regularly, provide value, engage authentically, and protect your creative time. Your platform will grow steadily as you build genuine connections with readers who love your stories.

Remember: you're not trying to be an influencer—you're building a community of readers who can't wait for your next book. That's a much more achievable and sustainable goal.`,
    category: "Marketing",
    readTime: "10 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-11-05'),
  },
  {
    title: "The Business Side of Romance Writing",
    slug: "business-side-romance-writing",
    excerpt: "Why treating your writing like a business is the key to building a sustainable, profitable author career.",
    content: `Many aspiring authors dream of writing full-time, but few understand that successful authors aren't just creative artists—they're entrepreneurs running small businesses. If you want to build a sustainable, profitable author career, you need to think like a business owner. Here's how.

## Shift Your Mindset from Hobby to Business

The first and most crucial step is changing how you view your writing. A hobby is something you do when you have time. A business is something you prioritize, invest in, and manage strategically.

This doesn't mean sucking the joy out of writing—it means respecting your craft enough to treat it professionally. Would you show up to a corporate job only when you felt inspired? Would you skip important business meetings because you weren't in the mood? Your writing deserves the same commitment.

## Set Clear Financial Goals

Successful businesses have revenue targets, and your author business should too. Define what success looks like financially:

- How much do you want to earn per month?
- How many books do you need to sell to reach that goal?
- What price points and royalty rates will get you there?
- How long will it take to achieve profitability?

Break down annual goals into quarterly and monthly targets. Track your progress consistently. Adjust your strategy based on results, not just feelings.

## Understand Your Numbers

You can't manage what you don't measure. Track these key metrics:

**Revenue Streams:** Book sales, Kindle Unlimited page reads, audiobook royalties, coaching income, etc.

**Expenses:** Editing, cover design, advertising, software subscriptions, professional development.

**Profit Margins:** Revenue minus expenses. This is what you actually earn.

**Return on Investment (ROI):** For every dollar spent on advertising or services, how much revenue do you generate?

**Customer Lifetime Value:** How much does an average reader spend on your books over time?

Understanding these numbers allows you to make informed decisions about where to invest your time and money.

## Invest Strategically in Your Business

Every business requires investment to grow. For authors, essential investments include:

**Professional Services:** Editing, cover design, formatting. These aren't luxuries—they're necessities for competing in today's market.

**Education:** Courses, conferences, coaching. Continuous learning accelerates your growth and helps you avoid costly mistakes.

**Marketing:** Advertising, promotional services, newsletter tools. You can't sell books readers don't know exist.

**Tools and Software:** Writing software, design tools, accounting programs, email platforms.

Don't let fear of spending hold you back, but do ensure every investment has a clear purpose and expected return. Track results to determine what's working.

## Build Multiple Revenue Streams

Relying solely on book sales is risky. Diversify your author income:

- **Direct book sales** (Amazon, other retailers, direct-to-reader)
- **Kindle Unlimited page reads**
- **Audiobook royalties**
- **Coaching or teaching** for aspiring authors
- **Courses or workshops** on writing or publishing
- **Patreon or subscription content** for superfans
- **Licensing opportunities** (foreign rights, audio, film)

Multiple income streams provide stability and growth potential beyond just publishing more books.

## Implement Systems and Processes

Successful businesses run on systems, not chaos. Create repeatable processes for:

- **Writing:** Daily word count goals, writing schedules, project timelines
- **Publishing:** Checklists for editing, formatting, uploading, launch preparation
- **Marketing:** Content calendars, email sequences, advertising campaigns
- **Administration:** Bookkeeping, tax preparation, contract management

Systems free up mental energy for creativity while ensuring nothing falls through the cracks.

## Manage Your Time Like a CEO

Your time is your most valuable resource. Protect it fiercely:

- **Block time for deep writing work** when you're most creative
- **Batch similar tasks** (social media, email, admin work) to minimize context switching
- **Delegate or outsource** tasks that aren't the best use of your time
- **Say no to opportunities** that don't align with your goals
- **Schedule rest and recovery** to prevent burnout

Track how you spend your time for a week. You might be shocked by how much time disappears into low-value activities.

## Plan for Taxes and Retirement

As a self-employed author, you're responsible for your own taxes and retirement planning:

- Set aside 25-30% of income for taxes (varies by location)
- Make quarterly estimated tax payments to avoid penalties
- Track all business expenses for deductions
- Consider setting up a retirement account (SEP IRA, Solo 401k)
- Work with an accountant who understands self-employment

Financial security matters. Plan for it from the beginning, not as an afterthought.

## Build Your Author Brand as a Business Asset

Your author brand is intellectual property with real value. Protect and develop it:

- Maintain consistent branding across all platforms
- Deliver quality consistently to build reader trust
- Protect your copyrights and trademarks
- Build your email list as an owned asset
- Create systems that could eventually run without you

A strong brand becomes increasingly valuable over time and can even be sold if you choose to exit the business.

## Network and Collaborate Strategically

Business owners build relationships with peers, mentors, and potential partners. Join author communities, attend conferences, and collaborate with other authors on:

- Cross-promotions and newsletter swaps
- Anthology projects
- Co-writing opportunities
- Mastermind groups for accountability and support

Your network is a valuable business asset. Invest in relationships that are mutually beneficial.

## Review and Adjust Quarterly

Set aside time every quarter to review your business performance:

- Did you meet your revenue and publishing goals?
- Which marketing strategies worked best?
- What expenses could be reduced or eliminated?
- What new opportunities should you pursue?
- What's working that you should do more of?

Treat this like a board meeting with yourself. Make data-driven decisions about the next quarter's strategy.

## Final Thoughts

Treating your writing like a business doesn't diminish the art—it honors it by giving your creative work the best chance to reach readers and generate income. You can be both an artist and an entrepreneur. In fact, in today's publishing landscape, you must be both to build a sustainable career.

The authors who thrive aren't necessarily the most talented writers—they're the ones who combine solid writing skills with smart business practices. They invest wisely, track their numbers, build systems, and make strategic decisions based on data rather than hope.

Your stories deserve to reach readers. Your creative work deserves to support you financially. Embrace the business side of writing, and you'll build an author career that's both creatively fulfilling and financially sustainable.`,
    category: "Business Strategy",
    readTime: "15 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-10-28'),
  },
  {
    title: "Character Development: Creating Unforgettable Heroes",
    slug: "character-development-heroes",
    excerpt: "The secrets to crafting billionaire heroes who are powerful yet vulnerable, dominant yet respectful, and utterly irresistible.",
    content: `In romance novels, the hero can make or break your story. Readers want characters who are powerful and successful, yet emotionally available and capable of growth. Creating billionaire heroes who feel authentic rather than clichéd requires understanding what makes these characters truly compelling.

## Beyond the Surface: More Than Money and Looks

Yes, your billionaire hero is wealthy, successful, and probably devastatingly handsome. But if that's all he is, readers will see right through him. The most memorable heroes have depth that goes far beyond their bank accounts.

What drives him? What keeps him up at night? What childhood wounds shaped who he became? What does he fear more than anything? These questions create the foundation for a three-dimensional character readers can connect with emotionally.

## The Power-Vulnerability Balance

The key to a compelling billionaire hero is balancing power with vulnerability. He's successful in business, commanding in the boardroom, and confident in most situations. But with the heroine, he's uncertain. She gets under his skin in ways no one else can.

This vulnerability doesn't make him weak—it makes him human. Show moments where his carefully constructed control slips. Maybe he's tongue-tied around her, or his hands shake when they touch. These small moments of vulnerability create emotional intimacy that readers crave.

## Respect Over Dominance

Modern romance readers want heroes who are protective without being controlling, confident without being arrogant, and passionate without being pushy. The "alpha" hero has evolved from the domineering jerks of decades past to men who respect boundaries while still being decisively masculine.

Your hero can be commanding and take charge, but he should also:
- Ask for consent, even in subtle ways
- Respect the heroine's choices and autonomy
- Support her goals and dreams
- Apologize when he's wrong
- Grow and change based on her influence

## Give Him a Meaningful Backstory

Why is he a workaholic? Why does he avoid emotional connection? Why did he build this empire? The answers to these questions create sympathy and understanding.

Maybe he grew up poor and vowed never to be powerless again. Perhaps he lost someone he loved and threw himself into work to avoid grief. Maybe he's trying to prove something to a parent who never believed in him.

Whatever his backstory, it should:
- Explain his current behavior and walls
- Create obstacles to emotional intimacy
- Give him room for growth and healing
- Connect meaningfully to the romance arc

## Show His Competence (Without Telling)

Readers need to believe your hero is actually good at what he does. Show his intelligence, business acumen, and problem-solving skills through action, not exposition.

Instead of telling us he's a brilliant CEO, show him:
- Solving a complex business problem
- Reading people and situations accurately
- Making tough decisions with confidence
- Commanding respect from others naturally

Competence is attractive. Let readers see why he's successful rather than just asserting it.

## Create Specific, Revealing Details

Generic billionaire heroes blur together. Specific details make characters memorable:

- What's his morning routine?
- What does his office look like?
- What's the one luxury he can't live without?
- What's his guilty pleasure?
- What makes him laugh?
- What's his relationship with his family?

These details don't need to be plot-critical, but they create texture and authenticity that help readers visualize and connect with your hero.

## The Heroine's Influence

Your hero should be changed by knowing the heroine. She should challenge his assumptions, soften his edges, and help him heal old wounds. The best romance heroes grow throughout the story.

Show how she affects him:
- He starts smiling more
- He makes time for things beyond work
- He opens up about his past
- He becomes more patient or playful
- He prioritizes their relationship over business

This growth arc is essential. Readers want to see the heroine's positive influence on the hero's life.

## Avoid These Common Pitfalls

**The Controlling Jerk:** Jealousy and possessiveness can be romantic in small doses, but controlling behavior, stalking, or ignoring consent is not attractive—it's toxic.

**The Perfect Gary Stu:** If your hero never makes mistakes, never struggles, and has no real flaws, he's boring. Give him weaknesses and let him fail sometimes.

**The Workaholic Who Instantly Changes:** If he's been married to his work for 15 years, he won't suddenly become a relationship-focused family man overnight. Make his transformation gradual and believable.

**The Billionaire With No Business Sense:** If he's supposedly a brilliant businessman but makes obviously stupid decisions, readers will notice. Do basic research on how businesses actually work.

## Make Him Worthy of the Heroine

Ultimately, readers need to believe your hero deserves the heroine's love. He should bring something meaningful to her life beyond money:

- Emotional support and understanding
- Respect for her intelligence and capabilities
- Encouragement of her dreams and goals
- A safe space to be vulnerable
- Partnership and equality in the relationship

The best billionaire heroes are powerful in the world but humble in love. They're successful but not arrogant, confident but not controlling, protective but not possessive.

## Final Thoughts

Creating an unforgettable billionaire hero requires balancing strength with vulnerability, power with respect, and confidence with growth. Give him depth beyond his wealth, a meaningful backstory that explains his walls, and a genuine transformation arc driven by the heroine's influence.

When you create a hero who feels real—with flaws, fears, and the capacity for change—readers will fall in love with him just as deeply as your heroine does. And that's when your romance novel becomes truly unforgettable.`,
    category: "Writing Tips",
    readTime: "9 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-10-20'),
  },
  {
    title: "Email List Building for Authors: A Complete Guide",
    slug: "email-list-building-authors",
    excerpt: "How to grow your email list from zero to thousands of engaged readers who can't wait for your next release.",
    content: `Your email list is the most valuable marketing asset you own as an author. Unlike social media followers (which platforms can take away at any time), your email list belongs to you. These are readers who have actively chosen to hear from you, and they're far more likely to buy your books than casual social media followers. Here's how to build and nurture a thriving email list.

## Why Email Lists Matter for Authors

Before diving into tactics, understand why email marketing is crucial:

- **You own the relationship.** Social media algorithms change, but your email list is yours forever.
- **Higher conversion rates.** Email subscribers are 3-5x more likely to buy your books than social media followers.
- **Direct communication.** You can reach readers without competing with endless feeds and distractions.
- **Predictable sales.** A strong email list means predictable launch sales and consistent income.

Every successful author I know prioritizes email list building. It's not optional—it's essential.

## Start with a Compelling Lead Magnet

People won't give you their email address for nothing. You need to offer something valuable in exchange—a lead magnet. For romance authors, effective lead magnets include:

- **Free prequel novella** to your series
- **Exclusive short story** featuring beloved characters
- **Deleted scenes or bonus chapters** from published books
- **Character interviews or backstory** content
- **Romance reading guide or book recommendations**

Your lead magnet should be:
- Directly related to your books and brand
- High quality (edited and professionally formatted)
- Easy to deliver (usually a PDF or EPUB)
- Valuable enough that readers would pay for it

## Set Up Your Email Service Provider

You need professional email marketing software. Popular options for authors include:

- **MailerLite:** Affordable, user-friendly, great for beginners
- **ConvertKit:** Designed for creators, excellent automation
- **MailChimp:** Free tier available, widely used
- **BookFunnel:** Specifically for authors, includes delivery system

Choose based on your budget and technical comfort level. Most offer free tiers for small lists, so you can start without investment.

## Create High-Converting Landing Pages

Your landing page is where readers sign up for your lead magnet. It should include:

- **Compelling headline** that promises a benefit
- **Attractive cover image** of your lead magnet
- **Brief description** of what they'll receive
- **Clear call-to-action** button
- **Privacy assurance** (you won't spam or share their email)

Keep it simple and focused. The only goal is getting that email address—don't distract with other links or information.

## Promote Your Lead Magnet Everywhere

Build your list by promoting your lead magnet across all channels:

**In Your Books:**
- Include a link in the front and back matter of every book
- Mention it in your author bio
- Add a call-to-action at the end of sample chapters

**On Social Media:**
- Pin it to your profile
- Mention it regularly in posts and stories
- Include the link in your bio
- Create graphics promoting it

**On Your Website:**
- Feature it prominently on your homepage
- Create a dedicated landing page
- Add pop-ups or slide-ins (use sparingly)
- Include it in your blog sidebar

**In Your Author Bio:**
- Mention it in your Amazon author bio
- Include it in guest posts and interviews
- Add it to your email signature

## Use Reader Magnets and Group Promotions

Join forces with other romance authors for group promotions:

- **BookFunnel group promos:** Readers download multiple free books at once
- **Newsletter swaps:** Promote each other's lead magnets to your lists
- **Joint giveaways:** Collaborate on prizes that require email signup
- **Anthology projects:** Contribute to multi-author collections

These collaborations expose your lead magnet to thousands of potential readers who already love romance.

## Optimize Your Welcome Sequence

When someone joins your list, they're most engaged. Capitalize on this with a strategic welcome sequence:

**Email 1 (Immediate):** Deliver the lead magnet and thank them for subscribing

**Email 2 (1-2 days later):** Introduce yourself and your books, share your author journey

**Email 3 (3-4 days later):** Provide value (writing tips, book recommendations, behind-the-scenes content)

**Email 4 (5-7 days later):** Soft sell your books with a special offer or recommendation

This sequence builds relationship and trust while gently introducing your paid books.

## Provide Consistent Value

Don't only email when you have a new book to sell. Provide regular value to keep subscribers engaged:

- **Writing tips and advice** for aspiring authors
- **Book recommendations** in your genre
- **Behind-the-scenes content** about your writing process
- **Sneak peeks** of upcoming books
- **Personal updates** that create connection
- **Exclusive content** only for subscribers

Email frequency depends on your audience, but most successful authors send at least monthly, with many sending weekly or even more frequently during launches.

## Segment Your List for Better Results

As your list grows, segment subscribers based on:

- **Reading preferences** (which series they're interested in)
- **Engagement level** (active vs. inactive subscribers)
- **Purchase behavior** (buyers vs. freebie seekers)
- **Interests** (writing tips vs. just new releases)

Segmentation allows you to send more targeted, relevant emails that get better open and click rates.

## Clean Your List Regularly

Quality matters more than quantity. Regularly remove subscribers who:

- Haven't opened emails in 6+ months
- Have invalid email addresses
- Marked your emails as spam

This improves your deliverability rates and ensures you're not paying for inactive subscribers. Send a re-engagement campaign first, giving inactive subscribers a chance to stay on your list.

## Track and Optimize Your Metrics

Monitor these key metrics to improve your email marketing:

- **List growth rate:** How quickly you're adding subscribers
- **Open rate:** Percentage who open your emails (aim for 20-30%+)
- **Click rate:** Percentage who click links (aim for 3-5%+)
- **Conversion rate:** Percentage who buy after clicking
- **Unsubscribe rate:** Should stay below 0.5% per email

Test subject lines, send times, and content types to see what resonates with your audience.

## Avoid Common Mistakes

**Don't buy email lists.** It's ineffective, often illegal, and damages your sender reputation.

**Don't email too infrequently.** If you only email twice a year, subscribers forget who you are and unsubscribe.

**Don't only sell.** Provide value in most emails, with occasional promotional emails.

**Don't ignore mobile optimization.** Over 50% of emails are opened on mobile devices.

**Don't skip the personal touch.** Write like you're talking to a friend, not broadcasting to thousands.

## Final Thoughts

Building an email list takes time and consistent effort, but it's the single most important marketing activity you can do as an author. Start today with a simple lead magnet and landing page. Promote it everywhere. Provide value to your subscribers. And watch as your list becomes your most reliable source of book sales and reader connection.

Remember: every subscriber represents a real person who chose to hear from you. Treat that privilege with respect, provide genuine value, and nurture those relationships. Your email list will become the foundation of a sustainable, profitable author career.`,
    category: "Marketing",
    readTime: "11 min read",
    published: "published",
    authorId: adminUser.id,
    publishedAt: new Date('2024-10-12'),
  },
];

console.log('Seeding blog posts...');

for (const post of samplePosts) {
  try {
    await db.insert(schema.blogPosts).values(post);
    console.log(`✓ Created: ${post.title}`);
  } catch (error) {
    console.error(`✗ Failed to create: ${post.title}`, error);
  }
}

console.log('\nBlog posts seeded successfully!');
await connection.end();
