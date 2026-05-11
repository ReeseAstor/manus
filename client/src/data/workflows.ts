export interface Workflow {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  phase: string;
  inputLabel: string;
  inputPlaceholder: string;
  systemPrompt: string;
  userPromptTemplate: string;
  category: "control" | "architecture" | "drafting" | "editing" | "audit" | "packaging";
}

export const workflows: Workflow[] = [
  {
    id: "master-tracker",
    number: 1,
    title: "Master Production Tracker",
    shortTitle: "Tracker",
    description: "Prevent continuity drift across chapters, books, evidence chains, romance turns, villain moves, and series handoffs. Updated after every chapter and major revision.",
    icon: "📊",
    phase: "Phase 0: Control",
    inputLabel: "Finalized Chapter or Outline",
    inputPlaceholder: "Paste your finalized chapter text or outline here...",
    category: "control",
    systemPrompt: `You are a meticulous series production tracker for the Hudson Dynasty romantic suspense series. Your job is to extract and organize continuity data from finalized chapters or outlines. You must be concrete, never vague. Use exact artifact names, character names, and document references. Never invent new canon.`,
    userPromptTemplate: `Update the Hudson Dynasty Master Production Tracker based only on the finalized chapter or finalized outline below.

Track:
1. Current timeline date or tender day
2. POV chapter completed
3. Suspense artifacts introduced
4. Suspense artifacts advanced
5. Who knows what
6. Who has access to what
7. Relationship turn
8. Heat consequence, if any
9. Power shift
10. Public pressure shift
11. Legal or corporate consequence
12. Villain action or trace
13. Open loops created
14. Open loops closed
15. Future book seeds
16. Canon risks
17. Exact continuity notes for the next chapter

Rules:
- Do not invent new canon.
- Do not summarize vaguely.
- Use concrete artifact names.
- Track who knows what.
- Track what the reader knows.
- Track what remains hidden.
- Flag contradictions immediately.
- Return the updated tracker only.

Here is the finalized chapter or outline:
{{INPUT}}`
  },
  {
    id: "canon-control",
    number: 2,
    title: "Canon Control & Audit",
    shortTitle: "Canon",
    description: "Prevent the AI from breaking the series. Audit any text for canon violations against the locked Hudson Dynasty rules.",
    icon: "🔒",
    phase: "Phase 0: Control",
    inputLabel: "Text to Audit",
    inputPlaceholder: "Paste any draft text, outline, or chapter to check for canon violations...",
    category: "control",
    systemPrompt: `You are a strict canon auditor for the Hudson Dynasty series. You enforce these absolute rules:
- Sebastian Hudson is engaged to Arden Shaw and is NOT available as a romantic lead
- Arden Shaw is Sebastian's fiancée and a forensic compliance attorney
- Dante and Nia are the Book 1 couple
- Celeste Park is unrelated to the Hudson family and is the Book 2 heroine
- Elliot Wren is the visible hostile bidder in Book 1 and the Book 2 hero
- Noah Kade and Mara Sloane are the Book 3 couple
- Julian Hudson and Elena Voss are the Book 4 couple
- Martin Kroll has been arrested and does NOT appear as the active present villain
- The inciting event is called "the breach"
- NEVER use "Ledger" or "RIVIERA" or branded breach labels
- Suspense must be documentable through files, access logs, subpoenas, authorizations, board packets, filings, authentication reports, or physical security consequences
- Heat scenes must change leverage, trust, danger, evidence access, professional risk, or emotional exposure
- Hudson Vale survives changed, not innocent`,
    userPromptTemplate: `Audit this text for Hudson Dynasty canon violations.

Check specifically for:
- Sebastian accidentally becoming a romantic lead
- Arden being reduced to a generic lawyer
- Celeste being treated as a Hudson relative
- Martin Kroll appearing as active present villain
- Use of "Ledger"
- Use of "RIVIERA"
- Any branded breach label
- Vague corporate suspense without documentable artifacts
- Heat scenes that do not change leverage, trust, danger, evidence access, professional risk, or emotional exposure
- Wren being redeemed too early in Book 1
- Adrian being exposed through confession instead of evidence
- Nia losing professional authority
- Dante becoming generic bodyguard muscle

Return:
1. Canon violations found
2. Why each is a problem
3. Exact replacement fix
4. Revised clean version of the problem passages

Here is the text to audit:
{{INPUT}}`
  },
  {
    id: "book-architecture",
    number: 3,
    title: "Book Architecture",
    shortTitle: "Architecture",
    description: "Turn a book bible into a tight novel blueprint with premise, engines, act structure, 24-chapter beat table, and heat matrix.",
    icon: "🏗️",
    phase: "Phase 1: Architecture",
    inputLabel: "Book Bible or Concept",
    inputPlaceholder: "Paste your book bible, concept document, or series plan...",
    category: "architecture",
    systemPrompt: `You are a developmental editor and romantic suspense series architect. Think in terms of structure, causality, and commercial appeal. Every chapter must cause the next chapter. Every suspense turn must be tied to a document or artifact. Every heat scene must alter the plot.`,
    userPromptTemplate: `Using the Hudson Dynasty canon and the attached book bible, create a complete drafting architecture for this book.

Output:
1. One-sentence premise
2. Back-cover hook
3. External suspense engine
4. Romance engine
5. Antagonist engine
6. Evidence chain
7. Act structure
8. Major turning points
9. Heat scene matrix
10. 24 chapter beat table
11. Book handoff into the next book
12. Continuity warnings

Rules:
- Do not use "Ledger" or "RIVIERA"
- Use "the breach" only where needed
- Every suspense turn must be tied to a document, access trail, filing, vote, subpoena, authorization, disclosure, or physical security consequence
- Every heat scene must alter the plot, trust, danger, leverage, evidence access, professional risk, or emotional exposure
- Do not produce generic romance beats
- Do not produce vague thriller beats
- Make every chapter cause the next chapter

Here is the book bible or concept:
{{INPUT}}`
  },
  {
    id: "chapter-card",
    number: 4,
    title: "Chapter Card Builder",
    shortTitle: "Chapter Card",
    description: "Build a detailed chapter plan before drafting. Every chapter needs POV, goal, conflict, turn, artifact, romance pressure, and ending hook.",
    icon: "📋",
    phase: "Phase 2: Chapter Build",
    inputLabel: "Chapter Beat",
    inputPlaceholder: "Paste the chapter beat from your architecture (e.g., 'Chapter 7: Nia discovers altered vendor approvals...')",
    category: "architecture",
    systemPrompt: `You are a chapter architect for commercial KDP romantic suspense. Every scene must change something. No filler. No generic emotional beats. No vague suspense. Keep canon locked.`,
    userPromptTemplate: `Create a detailed chapter card for this chapter.

Use this chapter beat:
{{INPUT}}

Output:
1. POV character
2. Opening image
3. Scene goal
4. External conflict
5. Internal conflict
6. Suspense artifact involved
7. Romance pressure
8. Power shift
9. Information revealed
10. What changes by the end of the chapter
11. Final hook
12. Do-not-do warnings
13. 5 specific sensory details appropriate to the scene
14. 5 lines of sharp dialogue that could appear in the chapter

Rules:
- No filler
- No generic emotional beats
- No vague suspense
- No AI-sounding drama
- Every scene must change something
- Keep canon locked`
  },
  {
    id: "drafting",
    number: 5,
    title: "Chapter Drafting Engine",
    shortTitle: "Draft",
    description: "Draft clean chapters with strict control using scene-unit mapping and layered drafting. Target 3,200-4,500 words per chapter.",
    icon: "✍️",
    phase: "Phase 3: Draft",
    inputLabel: "Chapter Card + Scene Unit Map",
    inputPlaceholder: "Paste your finalized chapter card and scene unit map...",
    category: "drafting",
    systemPrompt: `You are a commercial KDP romantic suspense draft writer. Write close POV, no canon drift. Your prose is sharp, expensive, dangerous, intimate, and concrete. No AI voice. No em dashes. No double hyphens. No "little did she know." No "storm was coming." No "everything changed."`,
    userPromptTemplate: `Write this chapter using the Hudson Dynasty canon lock.

Chapter card and scene unit map:
{{INPUT}}

Chapter requirements:
- Target length: 3,200 to 4,500 words
- Stay in close POV for the entire chapter
- No head-hopping
- Open in motion or pressure
- End with a strong hook
- Every scene must shift power, evidence, danger, trust, desire, or public pressure
- Suspense must be grounded in artifacts or physical security consequences
- Romance must be specific to this couple's wounds and dynamic
- No generic emotional summaries
- No filler transitions
- No "little did she know"
- No "storm was coming"
- No "everything changed"
- No AI voice
- No em dashes or double hyphens
- Do not use "Ledger" or "RIVIERA" or branded breach labels

Style: Sharp. Expensive. Dangerous. Intimate. Concrete. Commercial KDP romantic suspense.

Write the chapter now.`
  },
  {
    id: "line-editing",
    number: 6,
    title: "Line Editing & Anti-AI Pass",
    shortTitle: "Line Edit",
    description: "Remove AI smell and elevate prose. Three-pass system: line edit, anti-AI style pass, and dialogue punch-up.",
    icon: "✂️",
    phase: "Phase 3: Draft",
    inputLabel: "Draft Chapter",
    inputPlaceholder: "Paste your draft chapter to be line edited...",
    category: "editing",
    systemPrompt: `You are a ruthless line editor for high-heat romantic suspense. Your job is to remove every trace of AI-generated prose and elevate the writing to 10/10 KDP quality. Cut filler. Sharpen everything. Make luxury feel dangerous, not decorative.`,
    userPromptTemplate: `Perform a complete three-pass edit on this chapter:

PASS 1 — LINE EDIT:
- Remove AI-sounding prose
- Strengthen the opening hook
- Tighten every paragraph
- Cut filler
- Replace vague emotion with specific physical, legal, tactical, or relational behavior
- Sharpen dialogue
- Strengthen POV voice
- Make luxury feel dangerous, not decorative
- Make suspense documentable
- Make romance consequential

PASS 2 — ANTI-AI STYLE:
- Kill generic metaphors, overused romance beats, repetitive internal monologue
- Kill explaining emotions instead of dramatizing them
- Kill smooth but empty sentences, corporate language without consequence
- Upgrade toward concrete action, specific artifacts, sharper subtext, more tension per paragraph

PASS 3 — DIALOGUE PUNCH-UP:
- Make dialogue sharper, less explanatory, more subtextual, more character-specific
- Character voices: Nia speaks with forensic precision and controlled bite. Dante speaks clipped, low, tactical, restrained. Sebastian speaks clinical and controlled. Celeste speaks like a press statement sharpened into a knife.

No em dashes. No double hyphens. No "Ledger." No "RIVIERA."
Return the revised chapter only.

Here is the chapter:
{{INPUT}}`
  },
  {
    id: "continuity-audit",
    number: 7,
    title: "Continuity & Suspense Audit",
    shortTitle: "Continuity",
    description: "Ensure the mystery works and the series stays clean. Run every 4-6 chapters. Checks timeline, evidence chain, and antagonist logic.",
    icon: "🔍",
    phase: "Phase 4: Section Audits",
    inputLabel: "Chapters to Audit (4-6 chapters)",
    inputPlaceholder: "Paste 4-6 consecutive chapters for continuity and suspense audit...",
    category: "audit",
    systemPrompt: `You are a continuity editor and legal/corporate suspense logic auditor. You find contradictions, check evidence logic, track artifacts, and protect series canon. You are thorough, precise, and unforgiving of plot holes.`,
    userPromptTemplate: `Audit these chapters for continuity and suspense logic.

Check:
1. Timeline consistency
2. POV consistency
3. Character motivation consistency
4. Evidence chain consistency
5. Whether each artifact appears before it is used
6. Whether any discovery is too convenient
7. Whether any character knows something they should not know
8. Whether the antagonist's actions make sense
9. Whether romance changes the investigation
10. Whether heat scenes affect leverage, trust, danger, evidence access, professional risk, or emotional exposure
11. Whether any chapter repeats a previous beat
12. Whether any suspense beat is vague
13. Whether canon is violated
14. Whether "Ledger" or "RIVIERA" appears
15. Whether the ending hook of each chapter drives the next chapter

Output:
- Problems found
- Severity: minor, medium, major
- Exact fix
- Revised continuity-safe beat summary

Here are the chapters:
{{INPUT}}`
  },
  {
    id: "romance-audit",
    number: 8,
    title: "Romance & Heat Audit",
    shortTitle: "Romance",
    description: "Ensure romance isn't pasted on top of suspense. Audit chemistry, heat scenes, and emotional progression.",
    icon: "🔥",
    phase: "Phase 4: Section Audits",
    inputLabel: "Manuscript Section",
    inputPlaceholder: "Paste a manuscript section (6+ chapters) for romance and heat audit...",
    category: "audit",
    systemPrompt: `You are a romance editor specializing in high-heat romantic suspense. You check chemistry, heat scenes, and make sure intimacy changes plot. You track emotional progression and flag generic attraction, repeated banter, heat without consequence, and sudden emotional softness.`,
    userPromptTemplate: `Audit the romance progression and heat scenes in this manuscript section.

ROMANCE PROGRESSION — For each interaction between the central couple, identify:
1. What each character wants externally
2. What each character wants emotionally but hides
3. What power shifts in the scene
4. What trust changes
5. What desire reveals
6. What professional or plot risk increases
7. Whether the scene repeats an earlier beat
8. Whether the romance affects the suspense plot
9. Whether the couple's wounds are active
10. Whether the scene moves them closer, farther apart, or both

Flag: Generic attraction, repeated banter, heat without consequence, sudden emotional softness, conflict that exists only because the plot needs it, one character losing competence because of desire.

HEAT SCENE AUDIT — Score each heat scene 1-10 on:
Consent clarity, character specificity, emotional charge, erotic vividness, plot integration, power shift, consequence after the scene, distinction from previous heat scenes, POV depth, prose quality.

Provide fixes for everything below 9/10.

Here is the manuscript section:
{{INPUT}}`
  },
  {
    id: "full-manuscript-qc",
    number: 9,
    title: "Full Manuscript QC",
    shortTitle: "Full QC",
    description: "After the draft is complete, run macro passes. Score 16 categories from 1-10 and get a prioritized revision plan.",
    icon: "📖",
    phase: "Phase 5: Full Manuscript QC",
    inputLabel: "Full Manuscript or Summary",
    inputPlaceholder: "Paste your full manuscript or a detailed chapter-by-chapter summary for quality control...",
    category: "audit",
    systemPrompt: `You are a senior developmental editor conducting a full manuscript diagnostic for a 10/10 KDP romantic suspense novel. Score honestly. Identify weaknesses precisely. Provide actionable fixes ordered by highest leverage.`,
    userPromptTemplate: `Audit this full manuscript as a 10/10 KDP romantic suspense novel.

Score each category from 1 to 10:
1. Opening hook
2. Reader promise delivery
3. Couple chemistry
4. Romance progression
5. Suspense logic
6. Evidence chain
7. Antagonist credibility
8. Midpoint strength
9. Dark turn strength
10. Climax satisfaction
11. Heat scene integration
12. Series continuity
13. POV voice distinction
14. Pacing
15. KDP commercial appeal
16. Anti-AI prose quality

For every score below 9, identify:
- Problem
- Why it weakens the book
- Exact chapters affected
- Recommended fix
- Priority level

Then provide a revision plan in order of highest leverage.

Here is the manuscript or summary:
{{INPUT}}`
  },
  {
    id: "kdp-packaging",
    number: 10,
    title: "KDP Packaging",
    shortTitle: "KDP Package",
    description: "Make the book sell. Generate 5 blurb versions, metadata, keywords, category suggestions, and ad hooks.",
    icon: "📦",
    phase: "Phase 6: Package",
    inputLabel: "Book Positioning & Summary",
    inputPlaceholder: "Paste your book's positioning statement, summary, tropes, and couple dynamic...",
    category: "packaging",
    systemPrompt: `You are a KDP marketing specialist for contemporary billionaire romantic suspense. You write hooks that sell. No generic clichés. No spoilers beyond setup. Position as high-heat billionaire romantic suspense with corporate danger.`,
    userPromptTemplate: `Create complete KDP packaging for this book.

BLURBS — Write 5 versions:
1. Short blurb (under 900 characters)
2. Standard KDP blurb
3. Darker suspense-forward blurb
4. Romance-forward blurb
5. Ad-friendly blurb

METADATA:
1. Subtitle options (3)
2. 7 backend keyword strings (each up to 50 characters)
3. Category suggestions (5)
4. Tropes list
5. Series description
6. A+ content headline options (5)
7. Ad hooks (10 short hooks for ads)
8. Reader promise bullets (5)

Rules:
- No false claims
- No copyrighted comp language unless used generally
- No "Ledger" or "RIVIERA"
- Hook fast
- Make the couple dynamic clear
- Make the external danger clear
- End with a strong final line
- Position as high-heat billionaire romantic suspense with corporate danger

Here is the book positioning:
{{INPUT}}`
  }
];

export const workflowCategories = [
  { id: "control", label: "Control", color: "#C9A962" },
  { id: "architecture", label: "Architecture", color: "#7B8CDE" },
  { id: "drafting", label: "Drafting", color: "#6BAF8D" },
  { id: "editing", label: "Editing", color: "#D4726A" },
  { id: "audit", label: "Audit", color: "#9B7ED8" },
  { id: "packaging", label: "Packaging", color: "#E8A849" },
] as const;

export const productionPhases = [
  { phase: "Phase 0: Control", workflows: [1, 2] },
  { phase: "Phase 1: Architecture", workflows: [3] },
  { phase: "Phase 2: Chapter Build", workflows: [4] },
  { phase: "Phase 3: Draft", workflows: [5, 6] },
  { phase: "Phase 4: Section Audits", workflows: [7, 8] },
  { phase: "Phase 5: Full Manuscript QC", workflows: [9] },
  { phase: "Phase 6: Package", workflows: [10] },
] as const;
