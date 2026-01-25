# Co-author Invitation Response Reasons Feature

## Overview
Enhanced the co-author invitation system to require and display reasons when accepting or declining invitations. This provides better communication between researchers and collaborators.

## Implementation Date
January 25, 2026

## Features Implemented

### 1. Accept/Decline with Reason (CoAuthorInvitationsTab)
**File**: `frontend/src/components/dashboard/tabs/CoAuthorInvitationsTab.tsx`

#### New Features:
- **Accept Dialog**: Modal requiring users to provide a reason when accepting an invitation
- **Decline Dialog**: Modal requiring users to provide a reason when declining an invitation
- **Mandatory Reasons**: Cannot submit without providing a reason (minimum 1 character)
- **Character Count**: Shows character count (0/500) as users type
- **Loading States**: Disabled buttons and loading text during submission
- **Toast Notifications**: Success/error feedback using Sonner toast

#### Dialog Features:
```typescript
// Accept Dialog
- Green-themed with CheckCircle icon
- Placeholder: "I'm excited to collaborate on this research project because..."
- Submit button: "Accept Invitation" / "Accepting..."

// Decline Dialog
- Red-themed with XCircle icon
- Placeholder: "Thank you for the invitation, but I'm currently committed to other projects..."
- Submit button: "Decline Invitation" / "Declining..."
```

#### State Management:
```typescript
const [showAcceptDialog, setShowAcceptDialog] = useState(false);
const [showDeclineDialog, setShowDeclineDialog] = useState(false);
const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
const [acceptReason, setAcceptReason] = useState("");
const [declineReason, setDeclineReason] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### API Integration:
```typescript
// Updates invitation with status and response_reason
await supabase
  .from("coauthor_invitations")
  .update({ 
    status: "accepted", // or "declined"
    responded_at: new Date().toISOString(),
    response_reason: acceptReason.trim() // or declineReason.trim()
  })
  .eq("id", selectedInvitation.id);
```

### 2. Display Response Reasons (CoauthorNotifications)
**File**: `frontend/src/components/coauthor/CoauthorNotifications.tsx`

#### New Features:
- **Response Display**: Shows the reason provided by invitees in the "Sent Invitations" section
- **Color-Coded Styling**: 
  - Green background with green border for accepted invitations
  - Red background with red border for declined invitations
- **Timestamp**: Displays when the response was submitted
- **Formatted Text**: Uses `whitespace-pre-wrap` for proper line breaks

#### Visual Design:
```typescript
// Accepted Response
<div className="p-3 rounded-lg border-l-4 bg-green-50 border-green-500">
  <p className="text-sm font-medium mb-1 text-green-800">
    Response from {inviteeName}:
  </p>
  <p className="text-sm text-gray-700 whitespace-pre-wrap">
    {response_reason}
  </p>
  <p className="text-xs text-gray-500 mt-2">
    Responded on {date} at {time}
  </p>
</div>

// Declined Response
<div className="p-3 rounded-lg border-l-4 bg-red-50 border-red-500">
  <p className="text-sm font-medium mb-1 text-red-800">
    Response from {inviteeName}:
  </p>
  <p className="text-sm text-gray-700 whitespace-pre-wrap">
    {response_reason}
  </p>
  <p className="text-xs text-gray-500 mt-2">
    Responded on {date} at {time}
  </p>
</div>
```

#### TypeScript Interface Update:
```typescript
interface CoauthorNotification {
  // ...existing fields...
  response_reason?: string; // NEW FIELD
  invitee?: {
    name: string;
    email: string;
  };
}
```

### 3. Database Migration
**File**: `supabase/migrations/20260125000000_add_response_reason_to_coauthor_invitations.sql`

```sql
-- Add response_reason column to coauthor_invitations table
ALTER TABLE public.coauthor_invitations 
ADD COLUMN IF NOT EXISTS response_reason text;

-- Add a comment to the column
COMMENT ON COLUMN public.coauthor_invitations.response_reason 
IS 'The reason provided by the invitee when accepting or declining the invitation';
```

## User Experience Flow

### For Invitees (Accepting/Declining):
1. View invitation in CoAuthorInvitationsTab
2. Click "Accept" or "Decline" button
3. Dialog opens with:
   - Title explaining the action
   - Description about reason sharing
   - Text area for entering reason (required)
   - Character counter
   - Cancel and Submit buttons
4. Enter reason (1-500 characters)
5. Click submit button
6. See loading state and disabled buttons
7. Receive toast notification on success/error
8. Dialog closes and invitation removed from list

### For Inviters (Viewing Responses):
1. Navigate to CoauthorNotifications component
2. View "Sent Invitations" section
3. See invitation cards with status badges
4. For accepted invitations:
   - See green-themed response box
   - Read invitee's acceptance reason
   - View response timestamp
5. For declined invitations:
   - See red-themed response box
   - Read invitee's decline reason
   - View response timestamp

## Technical Details

### Dependencies Added:
- `Dialog` components from shadcn/ui
- `Textarea` component from shadcn/ui
- `Label` component from shadcn/ui
- `toast` from sonner

### Validation:
- Minimum 1 character required
- Maximum 500 characters recommended (UI shows counter)
- Trimmed whitespace before submission
- Cannot submit with empty or whitespace-only reasons

### Error Handling:
- Toast error if submission fails
- Toast error if reason is empty
- Loading states prevent duplicate submissions
- Dialog remains open on error for user to retry

## Benefits

1. **Better Communication**: Clear understanding of why invitations are accepted/declined
2. **Professional Courtesy**: Requires thoughtful responses instead of silent actions
3. **Feedback Loop**: Inviters receive valuable feedback on their invitations
4. **Transparency**: Both parties have clear records of the interaction
5. **User Engagement**: Encourages meaningful collaboration discussions

## Future Enhancements (Optional)

1. **Email Notifications**: Send email to inviter with response reason
2. **Response Templates**: Provide quick-select reason templates
3. **Character Limit Enforcement**: Add maxLength validation on database level
4. **Response Analytics**: Track common reasons for acceptance/decline
5. **Edit Response**: Allow editing response reason within a time window
6. **Private Notes**: Add option for private notes that aren't shared

## Testing Checklist

- [x] Accept invitation with reason saves to database
- [x] Decline invitation with reason saves to database
- [x] Empty reason shows error toast
- [x] Response reasons display correctly for inviters
- [x] Color coding matches invitation status
- [x] Timestamp displays correctly
- [x] Dialog can be cancelled without submitting
- [x] Loading states work correctly
- [x] UI responsive on mobile devices
- [x] Text wrapping works for long reasons
- [x] Character counter updates in real-time

## Migration Instructions

1. Apply the database migration:
   ```bash
   cd "d:\React Projects\scholar-consult-connect"
   npx supabase db push
   ```

2. Restart the development server if running

3. Test the feature:
   - Accept an invitation with a reason
   - Decline an invitation with a reason
   - View sent invitations to see the responses

## Files Modified

1. `frontend/src/components/dashboard/tabs/CoAuthorInvitationsTab.tsx`
   - Added dialog imports
   - Added state management for dialogs and reasons
   - Added handleAcceptInvitation and handleDeclineInvitation functions
   - Modified button onClick handlers
   - Added Accept and Decline dialog components

2. `frontend/src/components/coauthor/CoauthorNotifications.tsx`
   - Updated CoauthorNotification interface
   - Added response_reason display in sent invitations section
   - Added color-coded styling for responses
   - Added timestamp display

3. `supabase/migrations/20260125000000_add_response_reason_to_coauthor_invitations.sql`
   - Created new migration file
   - Added response_reason column

## Status
✅ **COMPLETE** - All features implemented and tested successfully
