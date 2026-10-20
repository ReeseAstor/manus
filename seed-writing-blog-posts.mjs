/**
 * Retired. These three posts associated the Reese Astor pen name with an AI
 * writing workflow and must not be inserted or updated again:
 *   - ai-assisted-romance-writing-workflow
 *   - romance-author-writing-tools-setup
 *   - quality-control-workflows-romance-authors
 *
 * The live rows are removed from Postgres separately. This script is a no-op
 * so an old setup hook cannot recreate them.
 */
const retired = [
  "ai-assisted-romance-writing-workflow",
  "romance-author-writing-tools-setup",
  "quality-control-workflows-romance-authors",
];

console.log("Writing-workflow blog posts are retired and were not seeded:");
for (const slug of retired) console.log(`  - ${slug}`);
