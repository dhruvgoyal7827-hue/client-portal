export interface Client {
  id: string;
  _id?: string;
  name: string;
  email: string;
  pkg: string;
  status: string;
  lastActive: string;
}

export interface Project {
  _id?: string;
  id: string;
  name: string;
  clientId: string;
  status: string;
  package?: string;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  revisionsUsed?: number;
  totalRevisions?: number;
  filesShared?: number;
  pendingFilesReview?: number;
  pages?: string;
  addOns?: string[];
  paymentAmount?: string;
  paymentStatus?: string;
  techStack?: string;
  domain?: string;
  lastUpdated?: string;
  timeline?: {
    discovery?: 'done' | 'current' | 'pending';
    design?: 'done' | 'current' | 'pending';
    development?: 'done' | 'current' | 'pending';
    launch?: 'done' | 'current' | 'pending';
  };
}

export interface Invoice {
  _id?: string;
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
}

export interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  totalRevenue: number;
  pendingInvoices: number;
}
