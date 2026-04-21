# MailerLite Email Automation Setup Guide

## Post-Purchase Nurture & Re-Engagement Win-Back Sequences

**Prepared for:** Reese Astor
**Date:** April 21, 2026

---

## Overview

This guide walks you through setting up two new email automation sequences in MailerLite. All 6 HTML email templates have been pre-built and are available for preview and one-click copy on your admin dashboard at `/admin/email-templates`. The templates match the dark luxury gold Manhattan design of your existing welcome series.

| Sequence | Emails | Trigger | Purpose |
|---|---|---|---|
| **Post-Purchase Nurture** | 3 emails | Stripe purchase confirmed | Deepen buyer loyalty, reduce remorse, upsell |
| **Re-Engagement Win-Back** | 3 emails | 60 days inactive | Re-engage or clean list for deliverability |

---

## Part 1: Post-Purchase Nurture Sequence

### Sequence Structure

| Email | Name | Subject Line | Delay | Purpose |
|---|---|---|---|---|
| 1 | Thank You + Reading Companion | Your books are on their way — plus a surprise inside | 1 day after purchase | Immediate gratification, bonus content |
| 2 | Behind the Scenes — Deleted Scene | The deleted scene I almost kept in Book 1 | 5 days after purchase | Exclusive content, reward purchase |
| 3 | What's Next — Upsell & Preview | Finished the series? Here's what's coming next | 14 days after purchase | Forward momentum, upsell |

### Step-by-Step Setup

**Step 1: Create the Automation**

1. Go to **MailerLite Dashboard** > **Automations** > **Create automation**
2. Name it: `Post-Purchase Nurture Sequence`
3. Click **Save**

**Step 2: Set the Trigger**

1. Click **Add trigger**
2. Select **"When subscriber joins a group"**
3. Choose the group: **"Book Buyer"** (create this group first if it does not exist)
4. Click **Save trigger**

> **Important:** The website's Stripe webhook automatically adds subscribers to the "Book Buyer" group when a purchase completes. This trigger will fire automatically for every new buyer.

**Step 3: Add Email 1 — "Thank You + Your Reading Companion"**

1. Click **Add step** > **Email**
2. Set the email details:
   - **Name:** Thank You + Your Reading Companion
   - **Subject:** Your books are on their way — plus a surprise inside
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Click **Design email** > **Custom HTML editor**
4. Go to your admin dashboard at `reeseastor.com/admin/email-templates`
5. Select **Post-Purchase** > **Email 1**
6. Click **Copy HTML** to copy the complete template
7. Paste the HTML into the MailerLite custom HTML editor
8. Click **Done editing**
9. Click **Save**

**Step 4: Add a 4-Day Delay**

1. Click **Add step** > **Delay**
2. Set to **4 days** (Email 1 is sent 1 day after purchase, so 4 more days = Day 5)
3. Click **Save**

**Step 5: Add Email 2 — "Behind the Scenes — Deleted Scene"**

1. Click **Add step** > **Email**
2. Set the email details:
   - **Name:** Behind the Scenes — Deleted Scene
   - **Subject:** The deleted scene I almost kept in Book 1
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Click **Design email** > **Custom HTML editor**
4. Copy the HTML from your admin dashboard: **Post-Purchase** > **Email 2**
5. Paste and save

**Step 6: Add a 9-Day Delay**

1. Click **Add step** > **Delay**
2. Set to **9 days** (Day 5 + 9 = Day 14)
3. Click **Save**

**Step 7: Add Email 3 — "What's Next — Upsell & Preview"**

1. Click **Add step** > **Email**
2. Set the email details:
   - **Name:** What's Next — Upsell & Preview
   - **Subject:** Finished the series? Here's what's coming next
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Click **Design email** > **Custom HTML editor**
4. Copy the HTML from your admin dashboard: **Post-Purchase** > **Email 3**
5. Paste and save

**Step 8: Activate**

1. Review the complete workflow: Trigger > Email 1 > 4-day delay > Email 2 > 9-day delay > Email 3
2. Click **Activate** to make the automation live

---

## Part 2: Re-Engagement Win-Back Sequence

### Sequence Structure

| Email | Name | Subject Line | Delay | Purpose |
|---|---|---|---|---|
| 1 | I Miss You — Welcome Back Gift | Still there? I have something special for you | Triggered at 60 days inactive | Emotional reconnection, bonus chapter |
| 2 | One Last Thing — Stay or Go | Should I keep sending you emails? | 7 days after Email 1 | Direct yes/no engagement check |
| 3 | Goodbye (For Now) — Final Chance | Removing you from my list tomorrow | 14 days after Email 1 | Loss aversion, final chance before removal |

### Step-by-Step Setup

**Step 1: Create the "At Risk" Segment**

Before creating the automation, you need a segment to identify inactive subscribers:

1. Go to **Subscribers** > **Segments** > **Create segment**
2. Name it: `Inactive 60 Days`
3. Set the condition: **"Last campaign was opened"** > **"more than 60 days ago"**
4. Add condition: **AND** **"Last campaign was clicked"** > **"more than 60 days ago"**
5. Click **Save segment**

**Step 2: Create the Automation**

1. Go to **Automations** > **Create automation**
2. Name it: `Re-Engagement Win-Back Sequence`
3. Click **Save**

**Step 3: Set the Trigger**

1. Click **Add trigger**
2. Select **"When subscriber joins a group"**
3. Choose the group: **"At Risk"** (create this group if it does not exist)
4. Click **Save trigger**

> **Note:** You will need to periodically move subscribers from the "Inactive 60 Days" segment into the "At Risk" group. This can be done manually or via a scheduled campaign. Alternatively, use the trigger **"When subscriber matches segment"** if available on your MailerLite plan.

**Step 4: Add Email 1 — "I Miss You"**

1. Click **Add step** > **Email**
2. Set the email details:
   - **Name:** I Miss You — Welcome Back Gift
   - **Subject:** Still there? I have something special for you
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Click **Design email** > **Custom HTML editor**
4. Copy the HTML from your admin dashboard: **Win-Back** > **Email 1**
5. Paste and save

**Step 5: Add a 7-Day Delay**

1. Click **Add step** > **Delay**
2. Set to **7 days**
3. Click **Save**

**Step 6: Add a Condition (Optional but Recommended)**

1. Click **Add step** > **Condition**
2. Set: **"Subscriber opened previous email"**
3. **Yes branch:** End workflow (subscriber re-engaged successfully)
4. **No branch:** Continue to Email 2

> This prevents engaged subscribers from receiving the increasingly urgent follow-up emails.

**Step 7: Add Email 2 — "One Last Thing"**

1. In the **No** branch, click **Add step** > **Email**
2. Set the email details:
   - **Name:** One Last Thing — Stay or Go
   - **Subject:** Should I keep sending you emails?
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Copy the HTML from your admin dashboard: **Win-Back** > **Email 2**
4. Paste and save

**Step 8: Add a 7-Day Delay**

1. Click **Add step** > **Delay**
2. Set to **7 days**
3. Click **Save**

**Step 9: Add Email 3 — "Goodbye (For Now)"**

1. Click **Add step** > **Email**
2. Set the email details:
   - **Name:** Goodbye (For Now) — Final Chance
   - **Subject:** Removing you from my list tomorrow
   - **From:** info@reeseastor.com
   - **From name:** Reese Astor
3. Copy the HTML from your admin dashboard: **Win-Back** > **Email 3**
4. Paste and save

**Step 10: Add Cleanup Action (Optional)**

1. After Email 3, click **Add step** > **Action**
2. Select **"Remove from group"**
3. Choose the main subscriber group
4. This automatically removes subscribers who did not re-engage

**Step 11: Activate**

1. Review the complete workflow
2. Click **Activate** to make the automation live

---

## Required MailerLite Groups

Make sure these groups exist in your MailerLite account before activating the automations:

| Group Name | Purpose | How Subscribers Are Added |
|---|---|---|
| **Book Buyer** | Triggers post-purchase sequence | Automatically via Stripe webhook |
| **At Risk** | Triggers win-back sequence | Manually or via segment-to-group automation |
| **VIP Member** | For future VIP-specific sequences | Via VIP Club subscription |

---

## Testing Checklist

Before activating each automation, verify the following:

- [ ] All 3 emails render correctly in the MailerLite preview
- [ ] Subject lines and sender details are correct
- [ ] Unsubscribe links work (MailerLite handles `{$unsubscribe}` automatically)
- [ ] CTA buttons link to the correct pages on reeseastor.com
- [ ] Test with a personal email address by manually adding yourself to the trigger group
- [ ] Check email rendering on mobile (use MailerLite's built-in preview tool)
- [ ] Verify delays are set correctly between emails

---

## Accessing Your Email Templates

All 6 email templates are available on your admin dashboard:

1. Log in to **reeseastor.com**
2. Navigate to **Admin Dashboard** > **Email Templates**
3. Select the sequence (Post-Purchase or Win-Back)
4. Click on any email to preview it
5. Use the **Copy HTML** button to copy the complete template
6. Paste directly into MailerLite's Custom HTML editor

The templates include:
- Responsive design (looks great on mobile and desktop)
- Dark luxury gold Manhattan aesthetic matching your brand
- MailerLite-compatible `{$unsubscribe}` merge tags
- Email-safe inline CSS for maximum compatibility
- Preheader text for inbox preview optimization
