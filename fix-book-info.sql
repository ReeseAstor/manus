-- Fix Book 2: The Billionaire's Fake Wife
-- Current error: Character name is "Lily", should be "Elena Kim"
UPDATE books 
SET description = 'Elena Kim never expected her latest heist to go wrong. Breaking into billionaire David Kim''s penthouse was supposed to be her ticket to freedom. Instead, she finds herself caught by a man who''s more dangerous—and more compelling—than any mark she''s ever targeted.

David Kim built his empire on control, precision, and never letting anyone get close. But this beautiful thief has shattered every rule he lives by. When her past catches up with them both, he''ll use every weapon in his arsenal to protect what''s his.

Instead of turning her over to the police, he offers a deal: marry him for 12 months in exchange for protection from her violent father and compensation. But as they work together, their forced alliance ignites into something neither expected.

With her father''s threats escalating and David''s empire at risk, Elena must decide: betray the man she''s falling for, or risk everything for a chance at redemption and love.'
WHERE slug = 'the-billionaires-fake-wife';

-- Verify the fix
SELECT title, LEFT(description, 100) as description_preview FROM books WHERE slug = 'the-billionaires-fake-wife';
