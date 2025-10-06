export interface Profile {
  id: string;
  user_id: string;
  name?: string;
  role: 'student' | 'researcher' | 'research-aide' | 'admin';
  institution?: string;
  created_at: string;
  updated_at: string;
  // Add other profile fields as needed
}
