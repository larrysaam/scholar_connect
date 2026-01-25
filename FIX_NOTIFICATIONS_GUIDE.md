# 🔧 Fix Notification URLs - Step by Step

## Problem
The error `42P13: no language specified` occurred because the full script might have syntax issues when run all at once.

## Solution: Run in 3 Separate Steps

### ✅ STEP 1: Fix Existing Notifications

**File:** `fix_notifications_step1.sql`

```sql
UPDATE notifications
SET action_url = REPLACE(action_url, 'tab=collaborations', 'tab=co-author-invitations')
WHERE category = 'collaboration'
  AND action_url LIKE '%tab=collaborations%';
```

**What it does:**
- Updates all existing collaboration notifications
- Changes `tab=collaborations` → `tab=co-author-invitations`

**Open Supabase SQL Editor → Paste this → Run**

**Expected Output:**
```
updated_count: X
correct_url_count: X  (should match updated_count)
```

---

### ✅ STEP 2: Fix Database Trigger Function

**File:** `fix_notifications_step2.sql`

**What it does:**
- Updates the `notify_coauthor_invitation_email()` function
- Future invitations will use correct URL automatically

**Open Supabase SQL Editor → Paste this → Run**

**Expected Output:**
```
function_name: notify_coauthor_invitation_email
function_source: [should contain 'tab=co-author-invitations']
```

---

### ✅ STEP 3: Verify Everything

**File:** `fix_notifications_step3_verify.sql`

**What it does:**
- Checks all notifications have correct URLs
- Confirms trigger function is updated
- Shows sample notifications

**Open Supabase SQL Editor → Paste this → Run**

**Expected Output:**
```
total_collaboration_notifications: X
correct_url_count: X  (should match total)
wrong_url_count: 0   (should be zero)
status: ✓ Correct
```

---

## Why This Approach?

The original `fix_coauthor_notification_url.sql` tried to do everything at once, which can cause:
- Syntax parsing issues
- Transaction conflicts
- Unclear error messages

By splitting into 3 steps:
1. ✅ Clear what each step does
2. ✅ Easy to identify which step fails
3. ✅ Can verify results at each step
4. ✅ Safer execution

---

## Quick Checklist

- [ ] Run `fix_notifications_step1.sql` in Supabase
- [ ] Verify output shows updated count
- [ ] Run `fix_notifications_step2.sql` in Supabase  
- [ ] Verify function is updated
- [ ] Run `fix_notifications_step3_verify.sql` in Supabase
- [ ] Verify all checks pass (correct_url_count matches total, wrong_url_count is 0)

---

## After Completion

✅ **Old notifications** → Now use `tab=co-author-invitations`
✅ **New invitations** → Will automatically use `tab=co-author-invitations`  
✅ **Frontend code** → Already fixed in `CoauthorNotifications.tsx`
✅ **Dashboard sync** → Already fixed in `ResearcherDashboard.tsx`

**Test it:**
1. Click "View Invitation" in notifications
2. Should navigate to Co-author Invitations tab
3. URL should show: `/dashboard?tab=co-author-invitations`

🎉 **Done!**
