-- Improved delete_user_account function with better error handling
-- This ensures the function always returns a JSON response, never throws

DROP FUNCTION IF EXISTS delete_user_account(UUID);

CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer := 0;
  error_msg text;
  error_detail text;
  error_hint text;
BEGIN
  -- Verify the user calling this function is the account owner
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated: You must be logged in to delete your account'
    );
  END IF;

  IF auth.uid() != target_user_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: You can only delete your own account'
    );
  END IF;

  -- Start deletion process
  BEGIN
    -- Delete in order to avoid foreign key constraint violations

    -- 1. Delete messages
    BEGIN
      DELETE FROM messages WHERE sender_id = target_user_id OR receiver_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % messages', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting messages: %', SQLERRM;
    END;

    -- 2. Delete notifications
    BEGIN
      DELETE FROM notifications WHERE user_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % notifications', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting notifications: %', SQLERRM;
    END;

    -- 3. Delete discussion replies
    BEGIN
      DELETE FROM discussion_replies WHERE author_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % discussion replies', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting discussion replies: %', SQLERRM;
    END;

    -- 4. Delete discussion likes
    BEGIN
      DELETE FROM discussion_likes WHERE user_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % discussion likes', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting discussion likes: %', SQLERRM;
    END;

    -- 5. Delete discussion posts
    BEGIN
      DELETE FROM discussion_posts WHERE author_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % discussion posts', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting discussion posts: %', SQLERRM;
    END;

    -- 6. Delete reviews
    BEGIN
      DELETE FROM reviews WHERE reviewer_id = target_user_id OR reviewee_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % reviews', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting reviews: %', SQLERRM;
    END;

    -- 7. Delete service bookings
    BEGIN
      DELETE FROM service_bookings WHERE student_id = target_user_id OR researcher_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % service bookings', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting service bookings: %', SQLERRM;
    END;

    -- 8. Delete consultation services
    BEGIN
      DELETE FROM consultation_services WHERE researcher_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % consultation services', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting consultation services: %', SQLERRM;
    END;

    -- 9. Delete coauthor memberships
    BEGIN
      DELETE FROM coauthor_memberships WHERE user_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % coauthor memberships', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting coauthor memberships: %', SQLERRM;
    END;

    -- 10. Delete coauthor invitations
    BEGIN
      DELETE FROM coauthor_invitations WHERE inviter_id = target_user_id OR invitee_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % coauthor invitations', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting coauthor invitations: %', SQLERRM;
    END;

    -- 11. Delete resource versions (for resources owned by user)
    BEGIN
      DELETE FROM resource_versions 
      WHERE resource_id IN (
        SELECT id FROM shared_resources WHERE owner_id = target_user_id
      );
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % resource versions', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting resource versions: %', SQLERRM;
    END;

    -- 12. Delete shared resources
    BEGIN
      DELETE FROM shared_resources WHERE owner_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % shared resources', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting shared resources: %', SQLERRM;
    END;

    -- 13. Delete projects (only if user is the owner)
    BEGIN
      DELETE FROM projects WHERE owner_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % projects', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting projects: %', SQLERRM;
    END;

    -- 14. Delete wallet transactions
    BEGIN
      DELETE FROM wallet_transactions WHERE user_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % wallet transactions', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting wallet transactions: %', SQLERRM;
    END;

    -- 15. Delete researcher profile
    BEGIN
      DELETE FROM researcher_profiles WHERE user_id = target_user_id;
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      RAISE NOTICE 'Deleted % researcher profiles', deleted_count;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting researcher profiles: %', SQLERRM;
    END;

    -- 16. Delete user profile (THIS IS CRITICAL - MUST SUCCEED)
    DELETE FROM users WHERE id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count = 0 THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Failed to delete user profile. User may not exist or deletion failed.'
      );
    END IF;
    
    RAISE NOTICE 'Deleted % user profiles', deleted_count;

    -- Return success
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Account and all associated data deleted successfully'
    );

  EXCEPTION WHEN OTHERS THEN
    -- Catch any errors and return them as JSON (not throw)
    GET STACKED DIAGNOSTICS 
      error_msg = MESSAGE_TEXT,
      error_detail = PG_EXCEPTION_DETAIL,
      error_hint = PG_EXCEPTION_HINT;
    
    RAISE WARNING 'Error deleting user account: % (Detail: %, Hint: %)', error_msg, error_detail, error_hint;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', error_msg,
      'detail', error_detail,
      'hint', error_hint
    );
  END;
END;
$$;

-- Grant execute permission to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_user_account IS 'Deletes a user account and all associated data. Users can only delete their own account. Always returns JSON with success status.';
