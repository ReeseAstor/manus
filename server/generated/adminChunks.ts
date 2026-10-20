/**
 * Placeholder. `scripts/seal-admin-chunks.mjs` overwrites this during production
 * build with the Writing Studio chunk, which is then inlined into the server
 * bundle and served only to signed-in admins.
 *
 * The committed file stays empty so the workflow copy is not part of the public
 * static build or this source file.
 */
export const adminChunks: Record<string, string> = {};
