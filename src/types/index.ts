export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'supervisor';
  name: string;
}

export interface Client {
  id: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  createdBy: string;
}