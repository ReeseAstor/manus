import { getDb } from "./server/db";
import { exclusiveContent } from "./drizzle/schema";

async function seedExclusiveContent() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  const content = [
    {
      title: "Bonus Chapter: Alexander's First Meeting",
      slug: "alexander-first-meeting",
      type: "bonus_chapter" as const,
      category: "Manhattan Money Kings",
      description: "Discover how Alexander Steele first laid eyes on the woman who would change his life forever. This exclusive bonus chapter reveals the untold story of their fateful encounter.",
      content: `# Alexander's First Meeting

The Manhattan skyline glittered like a promise through the floor-to-ceiling windows of the Steele Industries boardroom. Alexander Steele stood with his back to the room, hands clasped behind him, surveying his empire with the same calculating gaze that had built it.

"Mr. Steele, your three o'clock is here."

He didn't turn. Didn't need to. His assistant's voice carried that particular note of intrigue that meant this meeting would be different.

"Send them in."

The click of heels on marble was his first warning. Not the confident stride of a corporate shark, but something else entirely—measured, deliberate, like someone who knew exactly what they were worth and refused to apologize for it.

Alexander turned.

And his carefully constructed world tilted on its axis.

## The Woman Who Changed Everything

She stood in the doorway, silhouetted by the afternoon light, and for the first time in fifteen years, Alexander Steele forgot to breathe.

Dark hair swept back in a no-nonsense ponytail. A simple black dress that somehow made every other woman he'd ever known seem overdressed. And eyes—God, those eyes—that met his with zero fear, zero awe, zero anything except cool professional assessment.

"Mr. Steele," she said, extending her hand. "I'm here about the merger."

Her handshake was firm. Professional. And sent electricity racing up his arm like he'd grabbed a live wire.

"Miss...?"

"Carter. Sophia Carter." A slight smile played at the corners of her mouth. "Though I suspect you already knew that."

He did. He'd read her file three times. Harvard MBA. Five years at Goldman Sachs. Reputation for being brilliant, ruthless, and completely incorruptible.

What the file hadn't mentioned was the way she moved like liquid confidence. Or how her voice had a husky quality that made even business terminology sound like a promise.

## A Dangerous Attraction

"Please, sit." Alexander gestured to the conference table, buying himself time to regain his legendary composure.

She settled into the chair with elegant economy, pulling out a tablet and stylus. All business. All focus.

It should have been refreshing. Instead, it was infuriating.

"I've reviewed your proposal," she began, not waiting for pleasantries. "And I have concerns."

"Concerns." He leaned back, fingers steepled. The pose that had intimidated countless opponents. "About?"

"About whether you're serious about this merger, or if this is another one of your famous hostile takeovers disguised as partnership."

Direct. Fearless. Calling him out in his own boardroom.

Alexander felt something he hadn't experienced in years: genuine interest.

"And what," he said slowly, "would convince you of my sincerity?"

She met his gaze without flinching. "Actions, Mr. Steele. Not words. Not promises. Certainly not charm."

"You think I'm charming?"

"I think you're dangerous." She tapped her stylus against the tablet. "And I think you're used to getting exactly what you want."

"And if what I want," he said, voice dropping to something darker, more intimate, "is to prove you wrong?"

For the first time, something flickered in those remarkable eyes. Not fear. Not even uncertainty.

Recognition.

Of the game they were about to play. Of the stakes. Of the fact that this meeting had stopped being about business the moment she'd walked through that door.

"Then I suppose," Sophia said, that slight smile returning, "we'll see who's better at getting what they want."

## The Beginning of Everything

Three hours later, Alexander stood at the same window, watching the sun set over Manhattan.

The merger proposal lay on his desk, annotated in her precise handwriting. Professional. Thorough. Brilliant.

And completely beside the point.

Because somewhere in those three hours of negotiation and debate, of thrust and parry and intellectual combat, Alexander Steele had made a decision that would change everything.

He was going to marry Sophia Carter.

She just didn't know it yet.

His phone buzzed. A text from an unknown number:

*"Interesting meeting, Mr. Steele. Same time next week?"*

Alexander smiled—a real smile, not the corporate mask he usually wore.

*"Count on it, Miss Carter."*

He added her number to his contacts, paused, then changed the name from "Sophia Carter" to simply "Mine."

Because some things, he'd learned, were inevitable.

And Sophia Carter was the most inevitable thing that had ever happened to him.

---

*This bonus chapter takes place six months before the events of "The Billionaire's Baby Secret." Want to know what happens next? Get the full book now!*`,
      coverImage: "/manhattan-penthouse.jpg",
      featured: true,
      displayOrder: 1,
      publishDate: new Date("2024-01-15"),
    },
    {
      title: "Character Interview: Sophia Carter",
      slug: "interview-sophia-carter",
      type: "interview" as const,
      category: "Manhattan Money Kings",
      description: "Get to know Sophia Carter in this exclusive interview where she talks about life, love, and standing up to Manhattan's most powerful billionaire.",
      content: `# Character Interview: Sophia Carter

*Sophia Carter sits across from me in a sunlit café in Tribeca, looking effortlessly elegant in a cream silk blouse and tailored black pants. She's just finished a morning meeting—something about a tech startup acquisition—and she's graciously agreed to answer a few questions about her life, her work, and her relationship with Manhattan's most notorious billionaire.*

---

## On Her Career

**Q: You graduated top of your class from Harvard Business School. What drove you to pursue finance?**

**Sophia:** *(laughs)* My mother always said I was born arguing. I think finance appealed to me because it's the ultimate argument—numbers don't lie, and if you're good enough, you can make them tell any story you want. Plus, I liked the idea of playing in a world that told women they didn't belong.

**Q: And now you're one of the most respected deal-makers in Manhattan. How does that feel?**

**Sophia:** Exhausting. *(smiles)* But satisfying. I worked hard to get here. Every deal, every negotiation, every late night poring over contracts—it all mattered. I'm proud of what I've built.

**Q: Did you ever face discrimination in your field?**

**Sophia:** Every day. *(her expression hardens slightly)* But I learned early that the best revenge is success. When men underestimate you, you use it. When they dismiss you, you prove them wrong. And when they try to intimidate you... *(pauses)* Well, that's when it gets interesting.

## On Alexander Steele

**Q: Speaking of intimidation—let's talk about Alexander Steele. What was your first impression?**

**Sophia:** *(her eyes light up)* That he was trouble. The dangerous kind. The kind that makes you forget your own rules.

**Q: And did you? Forget your rules?**

**Sophia:** *(laughs)* Absolutely not. I just... rewrote them. There's a difference.

**Q: He's known for being ruthless in business. How do you handle that?**

**Sophia:** By being equally ruthless. *(leans forward)* Here's what people don't understand about Alexander—yes, he's powerful, yes, he's used to getting his way, but he respects strength. If you stand up to him, if you challenge him, if you refuse to be intimidated... that's when you get his attention. And his respect.

**Q: Is that what happened with you?**

**Sophia:** *(smiles mysteriously)* That's what happened with us. He expected me to fold. I didn't. And everything changed.

## On Love and Power

**Q: Your relationship with Alexander is... intense. How do you balance that with your career?**

**Sophia:** *(considers this carefully)* I don't balance it. I integrate it. Alexander doesn't want a trophy wife or a yes-woman. He wants an equal. Someone who challenges him, who matches him, who isn't afraid to tell him when he's wrong. And I want the same thing—a partner, not a project.

**Q: That sounds exhausting.**

**Sophia:** *(grins)* It is. But it's also exhilarating. Loving someone who's as strong as you are, who pushes you to be better, who sees all your flaws and loves you anyway—that's rare. That's worth fighting for.

**Q: What's the biggest challenge in your relationship?**

**Sophia:** His need for control. *(rolls her eyes)* The man thinks he can solve every problem with money or power. Sometimes I have to remind him that not everything can be fixed with a hostile takeover.

**Q: And how do you remind him?**

**Sophia:** *(laughs)* I have my methods.

## On the Future

**Q: What's next for you?**

**Sophia:** *(her expression softens)* Honestly? I'm learning to slow down. To appreciate what I have instead of always chasing the next deal, the next achievement. Alexander taught me that. That sometimes the most important thing isn't what you accomplish—it's who you come home to.

**Q: That's surprisingly romantic.**

**Sophia:** *(smiles)* Don't tell anyone. I have a reputation to maintain.

**Q: Any advice for women trying to make it in male-dominated fields?**

**Sophia:** Be excellent. Be relentless. Be unapologetically yourself. Don't try to be "one of the guys"—be better than all of them. And when someone tells you that you can't do something because you're a woman, smile sweetly and then prove them spectacularly wrong.

**Q: And on love?**

**Sophia:** *(pauses, then speaks softly)* Don't settle. Not for someone who wants to dim your light, not for someone who's intimidated by your strength, not for someone who thinks love means making yourself smaller. Find someone who wants you to shine. Who celebrates your wins. Who sees your power as a feature, not a bug.

*(She glances at her phone, where a text from Alexander has just appeared: "Dinner tonight? I'll cook.")*

**Sophia:** *(laughing)* And if they're willing to cook for you, that's a bonus.

---

*Want to read more about Sophia and Alexander's story? Get "The Billionaire's Baby Secret" now!*`,
      coverImage: "/manhattan-penthouse.jpg",
      featured: true,
      displayOrder: 2,
      publishDate: new Date("2024-02-01"),
    },
    {
      title: "Behind the Scenes: Creating the Manhattan Money Kings",
      slug: "behind-scenes-manhattan-money-kings",
      type: "behind_scenes" as const,
      category: "Writing Process",
      description: "Go behind the scenes and discover how the Manhattan Money Kings series came to life, from initial concept to published novels.",
      content: `# Behind the Scenes: Creating the Manhattan Money Kings

*A personal look at the creative process behind one of the most popular billionaire romance series.*

---

## The Spark of an Idea

It started, as most good ideas do, with a "what if?"

I was walking through Manhattan one evening, watching the lights come on in the skyscrapers, and I thought: *What if the most powerful men in this city—the ones who control billions, who shape markets with a phone call—what if they fell completely, irrevocably in love?*

Not the sanitized, easy version of love. The messy, complicated, all-consuming kind that makes you question everything you thought you knew about yourself.

That question became Alexander Steele. And then Marcus. And then Damian.

The Manhattan Money Kings were born.

## Building the World

### The Setting

Manhattan isn't just a backdrop in these books—it's a character. The city shapes these men as much as their wealth does. The relentless pace, the constant competition, the way success is measured in zeros on a bank statement—that's the world they live in.

I spent months researching:
- The actual buildings where billionaires work and live
- How private equity deals really work
- What it's like inside exclusive clubs and restaurants
- The culture of extreme wealth and power

I wanted readers to feel like they were stepping into a real world, not a fantasy. Yes, these men have private jets and penthouse apartments, but they also have board meetings and hostile takeovers and all the messy complications of running billion-dollar empires.

### The Characters

**Alexander Steele** was the hardest to write. He had to be powerful enough to be believable as a billionaire, ruthless enough to have built his empire, but vulnerable enough to fall in love. The key was finding his weakness—and making it Sophia.

**Sophia Carter** had to be his equal. Not someone who needed rescuing, but someone who could stand toe-to-toe with him and win. I gave her her own career, her own power, her own reasons for being in Manhattan that had nothing to do with him.

The chemistry between them came from that equality. They're not hero and damsel—they're two alphas circling each other, trying to figure out who'll blink first.

## The Writing Process

### Research

For each book, I:
- Interviewed people who work in finance (anonymously, of course)
- Visited the actual locations I write about
- Read countless articles about billionaire culture
- Studied real-life power couples to understand the dynamics

### The First Draft

I write fast and messy. My first drafts are terrible—full of placeholder dialogue like "[insert witty comeback here]" and notes to myself like "make this sexier."

The Manhattan Money Kings series took about six months per book for the first draft. I write in the mornings, when my brain is freshest, and I aim for 2,000 words a day.

### Revision

This is where the magic happens. I go through each scene and ask:
- Is the tension high enough?
- Are the characters acting consistently?
- Does every scene move the plot or relationship forward?
- Is the dialogue sharp enough?

I usually do 3-4 major revisions before sending to my editor.

## The Challenges

### Writing Billionaires

The biggest challenge is making billionaire characters relatable. Yes, they have private jets and unlimited resources, but they also have real problems—trust issues, family drama, the pressure of responsibility.

I tried to ground them in emotional truth. Alexander might be able to buy anything, but he can't buy Sophia's love. That's what makes him interesting.

### The Love Scenes

*(laughs)* People always ask about this. How do you write intimate scenes that are both hot and emotionally meaningful?

My answer: Focus on the emotion first. What are these characters feeling? What are they afraid of? What are they hoping for? The physical stuff is just the expression of all that emotional intensity.

Also, I have a very understanding spouse who doesn't ask too many questions about my browser history.

### Balancing Romance and Plot

These books aren't just about the relationship—they're about hostile takeovers, family secrets, corporate espionage. Balancing the romance with the external plot is always a challenge.

I use a technique I call "pressure cooking"—the external plot puts pressure on the relationship, forcing the characters to make choices that reveal who they really are.

## The Rewards

The best part of writing this series has been the reader response. I've gotten emails from:
- Women who said Sophia inspired them to ask for a raise
- Couples who said the books helped them communicate better
- Readers who just needed an escape and found it in Manhattan

That's why I write. Not for the lists, but for the connection with readers who see themselves in these characters.

## What's Next

I'm currently working on Book 4 in the series—Damian's story. He's been the hardest brother to crack, but I think I've finally figured him out.

And there might be a spin-off series in the works. But that's all I can say for now. 😉

## Writing Advice

If you're an aspiring romance writer, here's what I've learned:

1. **Read widely** - Not just romance, but everything. The best ideas come from unexpected places.

2. **Write the book you want to read** - Don't chase trends. Write what excites you.

3. **Character first** - Plot is important, but readers fall in love with characters.

4. **Don't be afraid of emotion** - Romance is about feelings. Go deep. Make it hurt. Make it real.

5. **Finish the book** - A finished imperfect book is better than a perfect unfinished one.

---

*Thank you for being part of this journey. Your support means everything.*

*With love,*
*Reese*`,
      coverImage: "/manhattan-night-skyline.jpg",
      featured: false,
      displayOrder: 3,
      publishDate: new Date("2024-02-15"),
    },
  ];

  console.log("Seeding exclusive content...");

  for (const item of content) {
    await db.insert(exclusiveContent).values(item);
    console.log(`✓ Created: ${item.title}`);
  }

  console.log("\n✅ Exclusive content seeded successfully!");
  process.exit(0);
}

seedExclusiveContent().catch((error) => {
  console.error("Error seeding exclusive content:", error);
  process.exit(1);
});
