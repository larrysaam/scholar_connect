# Account Deletion Fix - ResearchAidsSettings.tsx

## ✅ Issue Resolved

**Error**: `Edge Function returned a non-2xx status code`

**Root Cause**: `ResearchAidsSettings.tsx` was calling a non-existent Edge Function `delete-account` instead of using the database RPC function `delete_user_account`.

---

## 🔧 What Was Fixed

### Before (Broken):
```typescript
const response = await supabase.functions.invoke('delete-account', {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});
```
❌ Called non-existent Edge Function  
❌ Returns 404 or 5xx error  
❌ No proper error handling  

### After (Fixed):
```typescript
const { data, error: rpcError } = await supabase.rpc('delete_user_account', {
  target_user_id: settings.id
});
```
✅ Calls database RPC function (already created)  
✅ Returns JSON with success status  
✅ Comprehensive error handling  
✅ Detailed console logging  

---

## 📋 Files Updated

1. **`frontend/src/components/dashboard/tabs/ResearchAidsSettings.tsx`**
   - ✅ Replaced Edge Function call with RPC function
   - ✅ Added detailed error handling
   - ✅ Added console logging for debugging
   - ✅ Improved user feedback

2. **`frontend/src/components/dashboard/tabs/SettingsTab.tsx`**
   - ✅ Already fixed (previously)

---

## 🎯 Database Functions Status

### ✅ Applied:
1. `delete_user_account` - Main deletion function (from migration `20260126000000_fix_delete_user_account.sql`)

### ⏳ Pending (Apply Now):
2. `delete_auth_user_on_public_user_delete` - Trigger to delete auth.users

**Apply this SQL in Supabase SQL Editor:**
```sql
-- Create a function to delete auth.users when public.users is deleted
CREATE OR REPLACE FUNCTION delete_auth_user_on_public_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the auth user
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Create trigger on public.users table
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON public.users;
CREATE TRIGGER trigger_delete_auth_user
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user_on_public_user_delete();

-- Add comment
COMMENT ON FUNCTION delete_auth_user_on_public_user_delete IS 'Automatically deletes auth.users record when public.users record is deleted';
```

---

## 🧪 Testing

### For Research Aids:
1. Login as a **research aid** user
2. Navigate to **Dashboard → Settings**
3. Scroll to **"Danger Zone"**
4. Click **"Delete Account"**
5. Fill in deletion reason (optional)
6. Check **"I understand this action is permanent"**
7. Type **"DELETE"** in confirmation field
8. Click **"Delete My Account Permanently"**
9. Watch console for detailed logs
10. Should see "Account Deleted" toast
11. Should redirect to home page

### For Regular Users (Students/Experts):
Same process in **SettingsTab** component.

---

## 📊 What Gets Deleted

The `delete_user_account` function removes data from these tables in order:
1. messages
2. notifications
3. discussion_replies
4. discussion_likes
5. discussion_posts
6. reviews
7. service_bookings
8. consultation_services
9. coauthor_memberships
10. coauthor_invitations
11. resource_versions
12. shared_resources
13. projects
14. wallet_transactions
15. researcher_profiles
16. users (public.users table)
17. auth.users (via trigger - pending application)

---

## 🛡️ Security

✅ **Authorization**: Users can only delete their own account  
✅ **Confirmation Required**: Must type "DELETE"  
✅ **Transaction Safety**: All deletions in single transaction  
✅ **Error Handling**: Comprehensive try-catch blocks  
✅ **Logging**: Detailed console logs for debugging  

---

## 🐛 Debugging

If deletion still fails, check:

1. **Console Logs**: Look for detailed error messages
   ```
   === Starting Account Deletion ===
   User ID: xxx-xxx-xxx
   Calling delete_user_account RPC...
   === RPC Response ===
   Data: {...}
   Error: {...}
   ```

2. **RPC Function Exists**: Verify in Supabase SQL Editor
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name = 'delete_user_account';
   ```

3. **Permissions**: Ensure function is granted to authenticated users
   ```sql
   SELECT has_function_privilege('authenticated', 'delete_user_account(uuid)', 'execute');
   ```

4. **Trigger Status**: Check if trigger is applied (after you run the SQL above)
   ```sql
   SELECT trigger_name FROM information_schema.triggers 
   WHERE trigger_name = 'trigger_delete_auth_user';
   ```

---

## ✅ Verification Checklist

- [x] Fixed ResearchAidsSettings.tsx
- [x] Fixed SettingsTab.tsx  
- [x] RPC function created (`delete_user_account`)
- [ ] **Trigger created** (`trigger_delete_auth_user`) ← **APPLY NOW**
- [x] Error handling implemented
- [x] Console logging added
- [x] TypeScript errors resolved

---

## 🚀 Next Steps

1. **Apply the trigger SQL** (copy from above)
2. **Test with a dummy account**
3. **Verify deletion in database**:
   ```sql
   -- Should return no rows
   SELECT * FROM users WHERE email = 'deleted@example.com';
   SELECT * FROM auth.users WHERE email = 'deleted@example.com';
   ```

---

## 📝 Related Documentation

- `ACCOUNT_DELETION_FIX.md` - Detailed implementation guide
- `supabase/migrations/20260126000000_fix_delete_user_account.sql` - Main deletion function
- `supabase/migrations/20260126000001_add_delete_auth_user_trigger.sql` - Auth deletion trigger

---

**Status**: ✅ Fixed and Ready to Test!

Once you apply the trigger SQL, account deletion will work for both regular users and research aids.
