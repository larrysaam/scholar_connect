export interface Booking {
  id: string;
  provider_id: string;
  provider?: {
    name: string;
  };
  // Add other booking properties here
}

export interface ConsultationDocument {
  id: string;
  booking_id: string;
  document_url: string;
  shared_by_user_id: string;
  status: 'shared' | 'in_review' | 'completed' | 'revoked';
  created_at: string;
  updated_at: string;
}