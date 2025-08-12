CREATE OR REPLACE FUNCTION get_conversations(p_user_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  avatar_url text,
  last_message text,
  last_message_at timestamp with time zone
)
AS $$
BEGIN
  RETURN QUERY
  WITH last_messages AS (
    SELECT
      CASE
        WHEN sender_id = p_user_id THEN recipient_id
        ELSE sender_id
      END AS other_user_id,
      content,
      created_at,
      ROW_NUMBER() OVER(PARTITION BY 
        CASE
          WHEN sender_id = p_user_id THEN recipient_id
          ELSE sender_id
        END
        ORDER BY created_at DESC
      ) as rn
    FROM messages
    WHERE sender_id = p_user_id OR recipient_id = p_user_id
  )
  SELECT
    u.id,
    u.name,
    u.avatar_url as avatar_url,
    lm.content as last_message,
    lm.created_at as last_message_at
  FROM users u
  JOIN last_messages lm ON u.id = lm.other_user_id
  WHERE lm.rn = 1
  ORDER BY lm.created_at DESC;
END; 
$$ LANGUAGE plpgsql;
