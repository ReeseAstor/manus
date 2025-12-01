# Project TODO

## Initial Website Setup
- [x] Create homepage with hero section
- [x] Add navigation header and footer
- [x] Implement responsive design
- [x] Set up dark theme with luxury gold accents
- [x] Configure MailerLite newsletter integration
- [x] Create contact form with email notifications
- [x] Build blog CMS with admin panel
- [x] Add Books page with all three Manhattan Money Kings books
- [x] Create About page
- [x] Create Coaching page

## Book 2 Integration
- [x] Copy Book 2 cover images to project public directory
- [x] Extract book blurb from provided documents
- [x] Update Books page with Book 2 information and cover
- [x] Add Amazon link for Book 2
- [x] Update homepage books section with Book 2

## Book 1 Integration
- [x] Copy Book 1 cover images to project public directory
- [x] Update Books page with Book 1 cover and correct Amazon link
- [x] Update homepage with Book 1 cover and correct Amazon link

## Free Prequel Integration
- [x] Copy prequel cover image to project public directory
- [x] Copy QR code image to project public directory
- [x] Add free prequel to homepage as lead magnet
- [x] Add free prequel to Books page
- [x] Integrate BookFunnel download link
- [x] Add QR code for easy mobile access
- [x] Update newsletter signup messaging to mention free prequel

## Free Book Landing Page
- [x] Create dedicated /free-book route and page component
- [x] Design compelling landing page with hero section
- [x] Add book preview/sample chapter section
- [x] Include reader testimonials and social proof
- [x] Add multiple CTAs for BookFunnel download
- [x] Include FAQ section about the free book
- [x] Add social sharing buttons
- [x] Update navigation to include free book link

## Social Media Promotional Graphics
- [x] Generate Instagram post graphic (1080x1080)
- [x] Generate Facebook ad graphic (1200x628)
- [x] Generate Pinterest pin graphic (1000x1500)
- [x] Generate Instagram Story graphic (1080x1920)
- [x] Save all graphics to project public directory

## Email Automation Sequence
- [x] Create comprehensive email sequence template document
- [x] Write Email 1: Welcome + free book delivery
- [x] Write Email 2: Character introduction and series overview
- [x] Write Email 3: Behind-the-scenes writing process
- [x] Write Email 4: Book 1 introduction with special offer
- [x] Write Email 5: Complete series overview with limited-time discount
- [x] Include subject lines, timing, and CTAs for each email
- [x] Provide MailerLite setup instructions

## Blog Category Filtering System
- [x] Update database schema to add category field to blog posts
- [x] Run database migration (pnpm db:push)
- [x] Update tRPC procedures to support category filtering
- [x] Add category filter UI to blog listing page
- [x] Add category selection dropdown to admin blog editor
- [x] Display category badges on blog post cards
- [x] Add "All Categories" option to show all posts
- [x] Test category filtering functionality

## Bug Fixes
- [x] Fix nested anchor tag error on homepage

## Gemini AI Integration - Visual Capabilities
- [x] Set up Google Gemini AI API credentials
- [x] Create AI image generation backend helper
- [ ] Build AI Book Cover Generator page
- [ ] Create Character Portrait Generator tool
- [ ] Build Social Media Graphics Generator
- [ ] Create Personalized Reading Recommendation visual generator
- [ ] Add AI-generated image gallery/management

## Gemini AI Integration - Interactive Features
- [x] Create AI chatbot backend with Gemini API
- [x] Build chatbot UI component for reader questions
- [x] Integrate chatbot on Books and Homepage
- [x] Create "Which Manhattan Money King is your perfect match?" quiz
- [x] Build quiz results page with AI-generated personality analysis
- [ ] Create AI Blog Post Assistant for coaching content
- [ ] Build Story Idea Generator for writing coaching clients
- [ ] Add AI writing tools page for coaching services

## Gemini AI Integration - Database & Admin
- [ ] Create database table for AI chat history
- [ ] Create database table for quiz results
- [ ] Add admin panel for viewing AI interactions
- [ ] Implement rate limiting for AI API calls
- [ ] Add cost tracking for Gemini API usage

## Book Information Accuracy Audit
- [x] Read Book 1: The Billionaire's Executive Assistant (full manuscript)
- [x] Read Book 2: The Billionaire's Fake Wife (full manuscript)
- [x] Read Book 3: The Billionaire's Baby Secret (full manuscript)
- [x] Read Prequel: The Billionaire's One Night Stand (full manuscript)
- [x] Extract accurate character names, relationships, and plot details
- [x] Identify all inaccuracies on website pages
- [x] Fix character names and descriptions on all pages
- [x] Fix plot summaries and book blurbs
- [x] Update AI chatbot system instruction with accurate information
- [x] Verify all book information is consistent across the site

## Stripe Payment Integration
- [ ] Add Stripe feature to project using webdev_add_feature
- [ ] Request Stripe API keys from user
- [ ] Create products page for digital products (writing guides, courses)
- [ ] Create subscription tiers page for premium content
- [ ] Build checkout flow with Stripe
- [ ] Add payment success/cancel pages
- [ ] Test Stripe integration in test mode

## Luxury Website Redesign (10/10 World-Class)
- [x] Generate luxury background graphics and textures
- [x] Create cinematic hero section with parallax scrolling
- [x] Add 3D book cover animations with Framer Motion
- [x] Implement interactive book showcase with hover effects
- [x] Add smooth page transitions and scroll animations
- [ ] Create luxury color scheme with gold accents
- [ ] Add micro-interactions (button hovers, card animations)
- [ ] Implement particle effects for premium feel
- [ ] Add animated section reveals on scroll
- [ ] Create custom cursor effects for luxury experience
- [ ] Add ambient background animations
- [ ] Implement glass morphism effects for cards
- [ ] Add gradient overlays and lighting effects

## Premium Typography Upgrade
- [x] Replace Playfair Display with luxury serif font (Cormorant Garamond or Bodoni Moda)
- [x] Replace Inter with premium sans-serif (Montserrat or Raleway)
- [x] Update font imports in index.html
- [x] Update CSS font variables in index.css
- [x] Adjust font weights and letter spacing for luxury feel

## Book 3 Launch Promotion Campaign
- [x] Generate Book 3 promotional banner graphics
- [x] Create "New Release" announcement banner at top of homepage
- [x] Add Book 3 featured spotlight section with special launch pricing
- [ ] Create dedicated Book 3 landing page with extended preview
- [ ] Add countdown timer for limited-time launch discount
- [ ] Add social sharing buttons for Book 3
- [ ] Create "Complete the Series" bundle promotion
- [ ] Add Book 3 launch announcement to blog

## Book 3 Link Update
- [x] Replace all Book 3 Amazon links with https://swiy.co/3rd
- [x] Update Book3LaunchBanner component
- [x] Update Books page Book 3 link
- [x] Update Home page Book 3 link
- [x] Update any other Book 3 references

## Remove Coaching Section
- [x] Remove Coaching link from navigation (Header.tsx)
- [x] Remove Coaching page route from App.tsx
- [x] Delete Coaching.tsx page file
- [x] Remove any coaching references from other pages
