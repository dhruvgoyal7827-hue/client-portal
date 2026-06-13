import { Client, Project, Invoice, DashboardStats } from './types';

const API_URL = import.meta.env.VITE_API_URL || '';
const API_KEY = import.meta.env.VITE_API_SECRET_KEY || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
});

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    const message = text || response.statusText;
    throw new Error(`API error ${response.status}: ${message}`);
  }
  return response.json();
}

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/api/clients`, {
    headers: getHeaders(),
  });
  return handleResponse<Client[]>(res);
}

export async function getClientByFirebaseUid(firebaseUid: string): Promise<Client | null> {
  const res = await fetch(`${API_URL}/api/clients/me/${encodeURIComponent(firebaseUid)}`, {
    headers: getHeaders(),
  });
  if (res.status === 404) return null;
  return handleResponse<Client>(res);
}

export async function getProjects(clientId?: string): Promise<Project[]> {
  const url = clientId
    ? `${API_URL}/api/projects?clientId=${encodeURIComponent(clientId)}`
    : `${API_URL}/api/projects`;
  const res = await fetch(url, {
    headers: getHeaders(),
  });
  return handleResponse<Project[]>(res);
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Project>(res);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Project>(res);
}

export async function getInvoices(clientId?: string): Promise<Invoice[]> {
  const url = clientId
    ? `${API_URL}/api/invoices?clientId=${encodeURIComponent(clientId)}`
    : `${API_URL}/api/invoices`;
  const res = await fetch(url, {
    headers: getHeaders(),
  });
  return handleResponse<Invoice[]>(res);
}

export async function createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
  const res = await fetch(`${API_URL}/api/invoices`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Invoice>(res);
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
  const res = await fetch(`${API_URL}/api/invoices/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Invoice>(res);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: getHeaders(),
  });
  return handleResponse<DashboardStats>(res);
}
