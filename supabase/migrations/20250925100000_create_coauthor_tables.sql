-- Co-author Invitations and Memberships

-- Table to store co-author invitations
CREATE TABLE IF NOT EXISTS coauthor_invitations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    inviter_id uuid NOT NULL, -- user who sends the invitation
    invitee_id uuid,         -- user who is invited (nullable if invited by email only)
    invitee_email text,      -- email of the invitee
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'revoked'
    created_at timestamptz NOT NULL DEFAULT now(),
    responded_at timestamptz,
    message text,
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_inviter FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store co-author memberships (accepted invitations)
CREATE TABLE IF NOT EXISTS coauthor_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamptz NOT NULL DEFAULT now(),
    role text NOT NULL DEFAULT 'coauthor', -- 'coauthor', 'owner', etc.
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (project_id, user_id)
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_coauthor_invitee_email ON coauthor_invitations(invitee_email);
CREATE INDEX IF NOT EXISTS idx_coauthor_project_id ON coauthor_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_coauthor_memberships_project_id ON coauthor_memberships(project_id);

-- Optionally, add triggers to auto-create membership on accepted invitation
-- (Implementation can be in the backend logic or as a DB trigger)
