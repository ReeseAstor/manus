import { getDb } from "./server/db";
import { books, bookReviews } from "./drizzle/schema";

const sampleBooks = [
  {
    title: "The Billionaire's Baby Secret",
    slug: "the-billionaire-s-baby-secret",
    series: "Manhattan Money Kings",
    seriesOrder: 3,
    coverImage: "/book3-cover.jpg",
    description: `Three years ago, Sophia Reed walked away from a hotel room and a man she should've never trusted—rising mogul Dominic Kane. She built stability the hard way: early trains, late invoices, and a tiny apartment where nothing could touch the life growing inside her.

Now the CEO who controls outcomes for a living is back… and the daughter Sophia's protected has the storm-gray eyes he can't deny.

When Dominic returns to reclaim his empire, he discovers the truth he was never meant to miss—and a city eager to devour the scandal. He can buy silence, clear rooms, bend markets. But Sophia has rules: boundaries around her child, transparency instead of power plays, and love that's earned, not purchased.

Between boardroom wars, paparazzi flash storms, and a custody fight waiting to ignite, he has to become more than a headline and more than a boss. He has to be the father Bella needs…and the partner Sophia deserves.`,
    sampleChapter: `Chapter One

The email arrived at 6:47 AM, three minutes before Sophia Reed's alarm.

She stared at the subject line—RE: Kane Industries Acquisition Proposal—and felt her coffee go cold in her hand. The sender's name glowed on her phone screen like a warning: Dominic Kane.

Three years. Three years of silence, of building a life he knew nothing about, of telling herself she'd made the right choice. And now, with seven words in a subject line, he was back.

Sophia set down her mug with a trembling hand. Through the thin walls of her Brooklyn apartment, she could hear Mrs. Chen's morning news program and the rumble of the Q train passing beneath the street. Normal sounds. Safe sounds. The sounds of the life she'd carefully constructed, one paycheck at a time.

"Mama?"

She turned to find Bella standing in the doorway of their shared bedroom, her dark curls wild from sleep, clutching the stuffed elephant Sophia had bought at a thrift store last month. At two and a half, her daughter was all chubby cheeks and curious eyes—eyes that were an unmistakable storm-gray, the same shade as the man whose email now sat unopened on Sophia's phone.

"Good morning, baby." Sophia forced brightness into her voice, scooping Bella into her arms. "Did you sleep well?"

Bella nodded, then pointed at the phone. "Who's that?"

"Just work stuff." Sophia kissed her daughter's forehead, breathing in the scent of baby shampoo and innocence. "Nothing important."

But it was important. Everything about Dominic Kane was important, even when she wished it wasn't.

Especially now.

She settled Bella at their small kitchen table with a bowl of cereal and turned back to her phone. Her thumb hovered over the email for a long moment before she finally opened it.

*Ms. Reed,*

*I hope this message finds you well. I'm reaching out regarding a potential partnership between Kane Industries and Hartley & Associates. I understand you're now the senior project manager there.*

*I'd like to discuss this opportunity in person. Would you be available for lunch this Thursday at Marea? My assistant will send a calendar invite.*

*Best regards,*
*Dominic Kane*
*CEO, Kane Industries*

Sophia read it twice, searching for hidden meaning in the formal words. There was no acknowledgment of their past, no hint that he remembered the night they'd spent together in a hotel room overlooking Central Park. No mention of the morning after, when she'd slipped out while he was in the shower, leaving nothing but a note that said *This was a mistake.*

Maybe he didn't remember. Maybe she'd been just another conquest for Manhattan's youngest self-made billionaire, forgettable among dozens of others.

Or maybe—and this thought made her stomach twist—he was playing a game she didn't understand yet.

"Mama, more juice please!"

Sophia blinked, pulling herself back to the present. Bella was holding up her empty sippy cup, a milk mustache on her upper lip.

"Of course, sweetheart."

As she refilled the cup, Sophia's mind raced. She couldn't avoid Dominic forever. Hartley & Associates was a small firm, and if Kane Industries wanted to partner with them, she'd have to be involved. Her boss, Richard Hartley, would insist on it. This could be the account that finally gave her the financial security she'd been chasing since Bella was born.

But seeing Dominic again meant risk. It meant the possibility of questions she wasn't ready to answer, of a truth she'd kept buried for three years.

It meant he might look at Bella and see himself in her eyes.

Sophia's phone buzzed again. A calendar invite from *D. Kane's Office* for Thursday at 1 PM.

She stared at it for a long moment, then looked at her daughter, who was happily kicking her feet and humming a tuneless song.

*What choice do I have?* Sophia thought. She needed this job. Needed the stability, the health insurance, the chance at a better life for Bella.

She could handle one lunch. She could sit across from Dominic Kane, discuss business, and keep her secrets locked away. She'd done harder things in the past three years.

With a deep breath, Sophia clicked "Accept" on the meeting invite.

Thursday. Marea. One o'clock.

She had three days to prepare for the man who'd changed her life without ever knowing it.

Three days to build walls strong enough to keep him out.

And as Bella laughed at something on her placemat, Sophia prayed those walls would be enough.`,
    rating: 5,
    reviewCount: 523,
    tropes: "Secret Baby, Second Chance, Billionaire Romance, Forced Proximity",
    heatLevel: 4,
    pageCount: 340,
    publishDate: "2024-01-15",
    amazonUrl: "https://swiy.co/3rd",
    appleUrl: "https://books.apple.com/us/book/example",
    koboUrl: "https://www.kobo.com/us/en/ebook/example",
    barnesNobleUrl: "https://www.barnesandnoble.com/w/example",
    googlePlayUrl: "https://play.google.com/store/books/details/example",
    featured: true,
    displayOrder: 1,
  },
  {
    title: "The Billionaire's Fake Wife",
    slug: "the-billionaire-s-fake-wife",
    series: "Manhattan Money Kings",
    seriesOrder: 2,
    coverImage: "/book2-cover.jpg",
    description: `Elena Volkov never wanted to be a thief. But when her father threatens her life unless she steals corporate secrets from billionaire David Kim, she has no choice.

Breaking into his Manhattan penthouse should have been simple—until David catches her in the act.

Instead of turning her over to the police, he offers a deal: help him expose her father's criminal empire, and he'll protect her. But there's a catch—they have to pretend to be married to make it convincing.

As they work together to bring down a dangerous man, their forced alliance ignites into something neither expected. Late nights planning their next move turn into stolen kisses. Fake touches for the cameras become all too real.

But with her father's threats escalating and David's empire at risk, Elena must decide: betray the man she's falling for, or risk everything for a chance at redemption and love.`,
    sampleChapter: `Chapter One

Elena Volkov had broken into exactly seven buildings in her life, and she'd never been caught.

Tonight would be number eight.

She stood in the service corridor of the Apex Tower, Manhattan's newest luxury high-rise, dressed in the navy uniform of a cleaning service that didn't exist. Her hands were steady as she swiped the cloned keycard—steady because they had to be, because her father had made it clear what would happen if she failed.

The penthouse elevator opened with a soft chime. Elena stepped inside, pressed the button for the 47th floor, and watched the numbers climb.

*In and out in twenty minutes,* she reminded herself. *Just like the others.*

But this wasn't like the others. This was David Kim's penthouse—tech billionaire, venture capitalist, and according to her father, the man who held the key to destroying their family's enemies.

Or so her father claimed. Elena had stopped believing his justifications years ago.

The elevator doors opened directly into the penthouse. Elena's breath caught despite herself. Floor-to-ceiling windows showcased a glittering view of Manhattan, the city spread out like a jewel box. Modern art hung on white walls. Everything was clean lines and expensive taste.

And completely silent.

*He's supposed to be in Tokyo,* Elena thought, consulting the schedule her father had provided. *Board meeting. Won't be back until tomorrow.*

She moved quickly through the living room, heading for the study her father had described. The safe would be behind the Rothko print, he'd said. Inside would be a flash drive containing financial records—proof of something, though her father had been vague about what.

Elena found the study exactly where it should be. The Rothko hung on the far wall, a splash of red and orange that probably cost more than her entire apartment building.

She was reaching for the painting when a voice spoke behind her.

"I have to say, this is a first."

Elena spun around, her heart slamming against her ribs.

David Kim stood in the doorway, wearing a t-shirt and sweatpants, his dark hair slightly mussed. He looked nothing like the sharp-suited businessman from the photos her father had shown her. He looked... human. And annoyingly attractive.

"The board meeting," Elena said stupidly. "You're supposed to be—"

"In Tokyo?" He leaned against the doorframe, arms crossed. "I was. Caught an earlier flight. Jet lag's a bitch, so I was in the kitchen making tea when I heard the elevator."

Elena's mind raced. She could run—but the elevator required a keycard, and he was blocking the only other exit. She could fight—but he was bigger, and she'd never been good at that anyway.

"I can explain," she started.

"Please do." David's voice was mild, almost curious. "Because from where I'm standing, you broke into my home wearing a fake uniform to steal from my safe. I'm very interested in your explanation."

Elena's mouth went dry. She'd prepared for a lot of scenarios, but getting caught had never been one of them. Her father's threats echoed in her mind: *Fail me, and you'll wish you'd never been born.*

"I..." She swallowed hard. "I need what's in that safe."

"Do you." It wasn't a question.

"My father—" She stopped. Saying too much could get them both killed.

David studied her for a long moment. Then, to her shock, he walked past her to the Rothko and moved it aside, revealing the safe. His fingers flew over the keypad.

"What are you doing?" Elena asked.

"Helping you." The safe clicked open. David reached inside and pulled out a flash drive. "This is what you came for, isn't it?"

Elena stared at him. "Why would you help me?"

"Because," David said, turning to face her, "I know exactly who sent you. And I've been waiting for him to make a move like this."

Her blood ran cold. "You know my father?"

"Yuri Volkov." David's voice hardened. "Yes, I know him. And I know what he does to people who disappoint him." His eyes met hers, and she saw something unexpected there—not anger, but understanding. "Including his own daughter."

Elena's carefully constructed walls cracked. "If you know what he is, then you know I don't have a choice."

"Everyone has a choice." David held up the flash drive. "But some choices are harder than others. So here's mine: I'll give you this drive. You take it to your father, tell him you succeeded. But in return, you help me."

"Help you do what?"

"Bring him down." David's smile was sharp. "I've been building a case against your father's organization for two years. You're going to help me finish it."

"He'll kill me," Elena whispered.

"Not if I protect you." David stepped closer. "But there's a catch. To make this work, to get close enough to gather the evidence we need, we'll need to make it convincing. We'll need to make everyone believe we're together."

"Together?"

"Married." David said it like he was proposing a business merger, not a life-altering deception. "You'll move in here. We'll be seen in public. And while everyone's watching the happy couple, we'll be dismantling your father's empire piece by piece."

Elena's head spun. "That's insane."

"Probably." David held out the flash drive. "But it's your choice. Take this, go back to your father, and spend the rest of your life as his puppet. Or take a chance on something different."

She looked at the drive, then at David Kim's steady gaze. She thought about her father's threats, about the life she'd been living—always afraid, always controlled, never free.

Maybe it was time to choose differently.

Elena reached out and took the flash drive. "Okay. I'll do it."

David smiled. "Then welcome home, Mrs. Kim."

And just like that, Elena Volkov's life changed forever.`,
    rating: 5,
    reviewCount: 892,
    tropes: "Fake Marriage, Suspense, Billionaire Romance, Enemies to Lovers",
    heatLevel: 4,
    pageCount: 350,
    publishDate: "2023-08-20",
    amazonUrl: "https://www.amazon.com/dp/B0FCCBNF8X",
    appleUrl: "https://books.apple.com/us/book/example",
    koboUrl: "https://www.kobo.com/us/en/ebook/example",
    featured: false,
    displayOrder: 2,
  },
  {
    title: "The Billionaire's Executive Assistant",
    slug: "the-billionaire-s-executive-assistant",
    series: "Manhattan Money Kings",
    seriesOrder: 1,
    coverImage: "/book1-cover.jpg",
    description: `Sarah Shah never expected to work for Manhattan's most ruthless billionaire. Michael Hastings is demanding, arrogant, and devastatingly attractive.

As his executive assistant, she's determined to keep things professional—but when late nights at the office turn into stolen glances and forbidden touches, the line between business and pleasure begins to blur.

Michael built his empire on control, but Sarah makes him lose it. She challenges him, stands up to him, and ignites a fire he can't ignore. But mixing business with pleasure has consequences, especially when a corporate takeover threatens everything they've built.

With a scandal that could destroy them both brewing and enemies circling, Sarah must decide: is love worth risking her career, her reputation, and her heart?`,
    sampleChapter: `Chapter One

Sarah Shah had been Michael Hastings' executive assistant for exactly three months, two weeks, and four days.

She knew this because she'd been counting down until her probation period ended and she could finally breathe without wondering if she'd be fired for looking at him wrong.

"Sarah!" Michael's voice crackled through the intercom. "My office. Now."

Sarah saved her spreadsheet and stood, smoothing her pencil skirt. Through the glass walls of his corner office, she could see him pacing like a caged tiger, phone pressed to his ear, his other hand gesturing sharply.

She grabbed her tablet and walked across the executive floor of Hastings Industries, aware of the curious glances from other assistants. Everyone knew that working for Michael Hastings was either a career-making opportunity or a one-way ticket to burnout.

Sarah was determined it would be the former.

She knocked once and entered. Michael waved her to a chair without looking up, still deep in his phone conversation.

"I don't care what the board thinks, Richard. The Singapore deal is solid, and I'm not backing down because some old men are afraid of innovation." He paused, listening. "Then they can vote me out. See how that works for them."

He ended the call and finally looked at Sarah. Even after three months, the full force of Michael Hastings' attention still made her pulse skip. He was tall, dark-haired, with sharp cheekbones and eyes that missed nothing. Today he'd ditched his suit jacket, and his white shirt was rolled up to reveal forearms that had no business being that distracting.

*Professional,* Sarah reminded herself. *Stay professional.*

"The board meeting's been moved up to tomorrow morning," Michael said. "I need the Singapore projections updated with the latest market data, a full competitive analysis, and talking points for every possible objection they might raise."

Sarah's mind raced. That was at least twenty hours of work. "Tomorrow morning?"

"Is that a problem?" His tone was mild, but she heard the challenge underneath.

"No." Sarah met his gaze steadily. "I'll have it ready."

Something flickered in his eyes—approval, maybe, or surprise. "Good. I'll need you to stay late tonight. Order dinner on the company card."

"Of course." Sarah stood to leave.

"Sarah."

She turned back. Michael was watching her with an expression she couldn't quite read.

"You've been here almost four months now. You're the longest-lasting assistant I've had in two years."

"I'm aware, sir."

"Why is that, do you think?"

Sarah considered the question. She could give him the easy answer—that she was organized, efficient, unflappable. But Michael Hastings didn't respect easy answers.

"Because I'm not afraid of you," she said finally.

His eyebrows rose. "No?"

"No. You're demanding and sometimes unreasonable, but you're not cruel. You push people because you want excellence, not because you enjoy making them suffer." Sarah tilted her head. "And you respect people who push back."

Michael's lips curved into something that might have been a smile. "Interesting theory."

"It's not a theory. It's an observation."

This time he definitely smiled. "Get to work, Ms. Shah. And Sarah?"

"Yes?"

"You're right. I do respect people who push back." His eyes held hers for a moment too long. "Don't stop."

Sarah left his office with her heart pounding in a way that had nothing to do with the impossible deadline she'd just been given.

*Dangerous,* she thought. *This is dangerous.*

But as she settled at her desk and pulled up the Singapore files, she couldn't quite make herself care.

Three months, two weeks, and four days.

And counting.`,
    rating: 4,
    reviewCount: 1247,
    tropes: "Billionaire Romance, Office Romance, Steamy, Boss/Employee",
    heatLevel: 5,
    pageCount: 320,
    publishDate: "2023-03-10",
    amazonUrl: "https://www.amazon.com/dp/B0F2W8QL7S",
    appleUrl: "https://books.apple.com/us/book/example",
    koboUrl: "https://www.kobo.com/us/en/ebook/example",
    featured: false,
    displayOrder: 3,
  },
];

// Reader reviews are never seeded. Only real, attributable reviews may be
// added, by hand, through the admin. (10/2026 audit: fabricated reviews removed.)
const sampleReviews: Array<{
  bookTitle: string;
  reviewerName: string;
  rating: number;
  review: string;
  source: string;
  featured: boolean;
}> = [];

async function seed() {
  console.log("Seeding books...");

  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Insert books
    for (const book of sampleBooks) {
      const [insertedBook] = await db.insert(books).values(book).$returningId();
      console.log(`Inserted book: ${book.title} (ID: ${insertedBook.id})`);

      // Insert reviews for this book
      const bookReviewsData = sampleReviews
        .filter((review) => review.bookTitle === book.title)
        .map((review) => ({
          bookId: insertedBook.id,
          reviewerName: review.reviewerName,
          rating: review.rating,
          review: review.review,
          source: review.source,
          featured: review.featured,
        }));

      if (bookReviewsData.length > 0) {
        await db.insert(bookReviews).values(bookReviewsData);
        console.log(`Inserted ${bookReviewsData.length} reviews for ${book.title}`);
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding books:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
