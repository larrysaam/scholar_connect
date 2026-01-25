# Testing Guide - Portal Cleanup Fix

## 🎯 What to Test
The white screen bug that occurred when creating or updating consultation services.

## 🚀 Quick Test Steps

### Test 1: Create a New Service
1. Navigate to Dashboard → Consultation Services tab
2. Click "Paid Service" or "Free Service" button
3. Fill in the service form:
   - Select a category from dropdown
   - Enter title
   - Enter description
   - Set duration
   - Add pricing for academic levels
4. Click "Create Service" button
5. **Expected Result:**
   - ✅ "Creating..." spinner appears
   - ✅ After ~500ms, dialog closes smoothly
   - ✅ New service appears in the list
   - ✅ **NO white screen**
   - ✅ **NO console errors**

### Test 2: Update an Existing Service
1. Find any service in the list
2. Click the "Edit" button
3. Modify any field (title, description, pricing, etc.)
4. Click "Update Service" button
5. **Expected Result:**
   - ✅ "Updating..." spinner appears
   - ✅ After ~500ms, dialog closes smoothly
   - ✅ Service updates appear in the list
   - ✅ **NO white screen**
   - ✅ **NO console errors**

### Test 3: Multiple Rapid Operations
1. Create a service
2. Immediately edit it
3. Create another service
4. **Expected Result:**
   - ✅ All operations complete successfully
   - ✅ No race conditions or crashes

## 🔍 What to Watch For

### ✅ Success Indicators
- Dialog closes smoothly after save
- Service appears/updates correctly
- No console errors
- No white screen
- Loading spinner shows during delay

### ❌ Failure Indicators
- White screen after clicking save
- Console error: `NotFoundError: Failed to execute 'removeChild'`
- Dialog doesn't close
- Service doesn't save

## 🌐 Test Environment
- Dev Server: `http://localhost:8083/`
- Browser: Chrome/Edge/Firefox (all should work)
- Open DevTools Console (F12) to watch for errors

## 📊 Expected Console Output
**Before Fix:**
```
❌ Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node'
❌ The above error occurred in the <ServiceForm> component
```

**After Fix:**
```
✅ (No errors - clean console)
```

## 🎬 Demo Workflow
```
1. Open http://localhost:8083/
2. Login as researcher
3. Go to "Consultation Services" tab
4. Click "Paid Service"
5. Fill form:
   - Category: "General Consultation"
   - Title: "Test Service"
   - Description: "Testing portal cleanup fix"
   - Duration: 60 minutes
   - Pricing: Keep defaults
6. Click "Create Service"
7. Wait for spinner → Dialog closes → ✅ Success!
```

## 🐛 If Issues Occur
1. Check browser console for errors
2. Verify dev server is running
3. Hard refresh (Ctrl+Shift+R)
4. Clear browser cache
5. Check network tab for API errors

## ✅ Fix Verification
If all tests pass:
- ✅ Portal cleanup fix is working
- ✅ Race condition is resolved
- ✅ Ready for production

---

**Last Updated:** January 25, 2025  
**Status:** Ready for Testing
