-- Drop the old function if it exists
DROP FUNCTION IF EXISTS delete_user_account(UUID);

-- Create an improved function to delete user account and all related data
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer := 0;
  error_msg text;
BEGIN
  -- Verify the user calling this function is the account owner
  IF auth.uid() != target_user_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: You can only delete your own account'
    );
  END IF;

  BEGIN
    -- Delete in order to avoid foreign key constraint violations

    -- 1. Delete messages
    DELETE FROM messages WHERE sender_id = target_user_id OR receiver_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % messages', deleted_count;

    -- 2. Delete notifications
    DELETE FROM notifications WHERE user_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % notifications', deleted_count;

    -- 3. Delete discussion replies
    DELETE FROM discussion_replies WHERE author_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % discussion replies', deleted_count;

    -- 4. Delete discussion likes
    DELETE FROM discussion_likes WHERE user_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % discussion likes', deleted_count;

    -- 5. Delete discussion posts
    DELETE FROM discussion_posts WHERE author_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % discussion posts', deleted_count;

    -- 6. Delete reviews
    DELETE FROM reviews WHERE reviewer_id = target_user_id OR reviewee_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % reviews', deleted_count;

    -- 7. Delete service bookings
    DELETE FROM service_bookings WHERE student_id = target_user_id OR researcher_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % service bookings', deleted_count;

    -- 8. Delete consultation services
    DELETE FROM consultation_services WHERE researcher_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % consultation services', deleted_count;

    -- 9. Delete coauthor memberships
    DELETE FROM coauthor_memberships WHERE user_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % coauthor memberships', deleted_count;

    -- 10. Delete coauthor invitations
    DELETE FROM coauthor_invitations WHERE inviter_id = target_user_id OR invitee_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % coauthor invitations', deleted_count;

    -- 11. Delete resource versions (for resources owned by user)
    DELETE FROM resource_versions 
    WHERE resource_id IN (
      SELECT id FROM shared_resources WHERE owner_id = target_user_id
    );
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % resource versions', deleted_count;

    -- 12. Delete shared resources
    DELETE FROM shared_resources WHERE owner_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % shared resources', deleted_count;

    -- 13. Delete projects (only if user is the owner)
    DELETE FROM projects WHERE owner_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % projects', deleted_count;

    -- 14. Delete wallet transactions
    DELETE FROM wallet_transactions WHERE user_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % wallet transactions', deleted_count;

    -- 15. Delete researcher profile
    DELETE FROM researcher_profiles WHERE user_id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % researcher profiles', deleted_count;

    -- 16. Delete user profile
    DELETE FROM users WHERE id = target_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Deleted % user profiles', deleted_count;

    -- Return success
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Account and all associated data deleted successfully'
    );

  EXCEPTION WHEN OTHERS THEN
    -- Catch any errors and return them
    GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
    RAISE WARNING 'Error deleting user account: %', error_msg;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', error_msg
    );
  END;
END;
$$;

-- Grant execute permission to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_user_account IS 'Deletes a user account and all associated data. Users can only delete their own account.';
