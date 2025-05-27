
export interface PlatformWork {
  id: number;
  title: string;
  client: string;
  clientAvatar: string;
  completedDate: string;
  duration: string;
  rating: number;
  review: string;
  tags: string[];
  deliverables: string[];
  projectValue: string;
}

export interface PrePlatformWork {
  id: number;
  title: string;
  institution: string;
  completedDate: string;
  duration: string;
  description: string;
  tags: string[];
  outcomes: string[];
}

export interface NewWork {
  title: string;
  description: string;
  category: string;
  institution: string;
  duration: string;
  outcomes: string;
  projectType: string;
}
