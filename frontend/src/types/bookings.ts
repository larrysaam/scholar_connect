export interface Booking {
  id: string;
  provider_id: string;
  client_id: string;
  service_id: string;
  academic_level: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  base_price: number;
  addon_price: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  meeting_link?: string;
  notes?: string;
  client_notes?: string;
  provider_notes?: string;
  created_at: string;
  updated_at: string;
  has_review?: boolean;
  // Related data
  provider?: {
    name: string;
    email?: string;
    institution?: string;
  };
  service?: {
    title: string;
    category?: string;
    description?: string;
  };
  addons?: any[];
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