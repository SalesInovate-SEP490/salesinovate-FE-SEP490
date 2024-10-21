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

export interface Forecast {
  forecastCategoryId: number;
  forecastName: string;
}

export interface Stage {
  stageId: number;
  stageName: string;
}

export interface Type {
  id: number;
  name: string;
}

export interface Opportunity {
  id: number;
  opportunityId: number;
  opportunityName: string;
  amount: number;
  probability: number;
  nextStep: string;
  userId: number;
  accountId: number;
  closeDate: string;
  leadSourceId: number;
  primaryCampaignSourceId: number;
  description: string;
  last_modified_by: number;
  partner_id: number;
  isDeleted: boolean;
  forecast: Forecast;
  stage: Stage;
  type: Type;
  stageId?: number;
  forecastCategoryId?: number;
}
