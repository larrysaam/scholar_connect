# Co-author Invitation Notification Navigation Fix

## Problem
When researchers clicked "View Invitation" in their notifications tab, the URL would change to `/dashboard?tab=co-author-invitations`, but the dashboard would remain on the overview tab instead of navigating to the co-author invitations tab.

## Root Cause
The `ResearcherDashboard` component only read the `tab` parameter from the URL **once** during initialization:

```typescript
const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");
```

When the `NotificationsTab` component called `setActiveTab(tab)`, it correctly parsed the `tab` parameter from the notification's `action_url` and called the handler. However, there was **no listener** watching for URL parameter changes after the initial render.

## Solution
Added a `useEffect` hook that listens to `searchParams` changes and updates the `activeTab` state accordingly:

```typescript
// Sync activeTab with URL parameter changes
useEffect(() => {
  const tabFromUrl = searchParams.get("tab");
  if (tabFromUrl && tabFromUrl !== activeTab) {
    console.log("URL tab changed to:", tabFromUrl);
    setActiveTab(tabFromUrl);
  }
}, [searchParams]);
```

## How It Works Now

### Flow Diagram:
```
User clicks "View Invitation" in Notifications
                    ↓
NotificationsTab parses action_url: /dashboard?tab=co-author-invitations
                    ↓
Calls setActiveTab('co-author-invitations')
                    ↓
ResearcherDashboard's handleTabChange updates URL
                    ↓
setSearchParams({ tab: 'co-author-invitations' })
                    ↓
URL changes → searchParams changes
                    ↓
useEffect detects searchParams change
                    ↓
Updates activeTab state to 'co-author-invitations'
                    ↓
renderTabContent() switch statement returns <CoAuthorInvitationsTab />
                    ↓
✅ User sees the Co-author Invitations tab
```

## Files Modified

### `frontend/src/pages/ResearcherDashboard.tsx`
- **Added:** `useEffect` hook to sync `activeTab` with URL parameter changes
- **Effect:** Now responds to URL changes triggered by notification clicks

## Testing

### Test Case 1: Direct Notification Click
1. ✅ Go to Notifications tab
2. ✅ Click "View Invitation" on a collaboration notification
3. ✅ Should navigate to Co-author Invitations tab
4. ✅ URL should show `/dashboard?tab=co-author-invitations`

### Test Case 2: Browser Back/Forward
1. ✅ Navigate to Co-author Invitations via notification
2. ✅ Click browser back button
3. ✅ Should return to Notifications tab
4. ✅ Click browser forward button
5. ✅ Should navigate back to Co-author Invitations tab

### Test Case 3: Direct URL Entry
1. ✅ Manually enter `/dashboard?tab=co-author-invitations` in browser
2. ✅ Should show Co-author Invitations tab
3. ✅ Tab should be highlighted in sidebar

### Test Case 4: URL Sharing
1. ✅ Copy URL while on Co-author Invitations tab
2. ✅ Open in new tab/window
3. ✅ Should open directly to Co-author Invitations tab

## Benefits

1. **Improved UX** 🎯
   - Notifications now correctly navigate to their target tabs
   - No more confusion about missing invitations

2. **Browser Navigation Support** ⬅️➡️
   - Back/forward buttons work correctly
   - URL accurately reflects current tab

3. **Shareable URLs** 🔗
   - Users can share direct links to specific tabs
   - Bookmarks work as expected

4. **Consistent Behavior** ✅
   - Matches user expectations for web app navigation
   - Aligns with standard React Router patterns

## Related Changes

This fix works in conjunction with:
- ✅ `fix_coauthor_notification_url.sql` - Corrected notification URLs in database
- ✅ `CoAuthorInvitationsTab.tsx` - Accept/decline with reasons functionality
- ✅ `add_response_reason_column.sql` - Database schema for storing reasons

## Technical Notes

### Why useEffect is needed:
React's `useState` initialization only runs once when the component mounts. When the URL changes (via `setSearchParams` or browser navigation), the component doesn't re-mount, so the state doesn't update automatically. The `useEffect` with `searchParams` as a dependency ensures the state stays in sync with the URL.

### Dependency Array:
```typescript
useEffect(() => {
  // ...
}, [searchParams]); // Runs whenever searchParams changes
```

The effect runs whenever `searchParams` changes, which happens when:
- User clicks a notification action button
- Browser back/forward buttons are used
- URL is manually edited
- A link with query parameters is clicked

## Conclusion

The ResearcherDashboard now correctly responds to URL parameter changes, ensuring that notification links work as expected. Users can seamlessly navigate to the co-author invitations tab by clicking on notification action buttons.

---

**Status:** ✅ Complete and Tested
**Date:** January 25, 2026
