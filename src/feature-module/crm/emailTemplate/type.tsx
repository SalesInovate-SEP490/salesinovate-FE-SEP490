export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  gender: number,
  title: string,
  email: string;
  phone: number;
  website: string;
  company: string;
  address: string;
  image: string;
  status: string;
  createdBy: string;
  createDate: string;
  editDate: string;
  editBy: string;
  lastModifiedBy: string;
  rating: string;
  leadId: number;
}

export interface ApiResponse {
  leads: Lead[];
  totalLeads: number;
}

export interface EmailTemplate {
  id: number;
  emailTemplateId: number;
  sendTo: string;
  mailSubject: string;
  htmlContent: string;
  userId: string;
  isDeleted: number;
}