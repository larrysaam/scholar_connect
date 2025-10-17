-- Create function to delete user account and all related data
CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from tables in order to avoid foreign key constraint violations

  -- Delete messages
  DELETE FROM messages WHERE sender_id = user_id OR receiver_id = user_id;

  -- Delete notifications
  DELETE FROM notifications WHERE user_id = user_id;

  -- Delete reviews
  DELETE FROM reviews WHERE reviewer_id = user_id OR reviewee_id = user_id;

  -- Delete service bookings
  DELETE FROM service_bookings WHERE student_id = user_id OR researcher_id = user_id;

  -- Delete coauthor memberships
  DELETE FROM coauthor_memberships WHERE user_id = user_id;

  -- Delete coauthor invitations (both as inviter and invitee)
  DELETE FROM coauthor_invitations WHERE inviter_id = user_id OR invitee_id = user_id;

  -- Delete projects (only if user is the owner)
  DELETE FROM projects WHERE owner_id = user_id;

  -- Delete wallet transactions
  DELETE FROM wallet_transactions WHERE user_id = user_id;

  -- Delete wallet
  DELETE FROM wallets WHERE user_id = user_id;

  -- Delete user profile
  DELETE FROM users WHERE id = user_id;

  -- Note: The actual auth user deletion is handled by the edge function
END;
$$;
