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
}
export interface Forecast {
  id: number;
  name: string;
}

export interface Stage {
  id: number;
  name: string;
}

export interface Type {
  id: number;
  name: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}

export interface AccountType {
  accountId: number;
  accountName: string;
}

export interface Industry {
  industryId: number;
  industryStatusName: string;
}

export interface Account {
  id: number;
  accountId: number;
  accountName: string;
  userId: number;
  parentAccountId: number | null;
  description: string;
  phone: string;
  website: string;
  billingInformationId: number;
  shippingInformationId: number;
  postalCode: string;
  createdBy: number;
  createDate: Date;
  editDate: Date;
  editBy: number;
  isDeleted: boolean;
  role: Role;
  accountType: AccountType;
  industry: Industry;
  industryId: number;
  accountTypeId: number;
  roleId: number;
}

export interface Contact {
  contactId: number;
  accountId: number;
  accountName: string;
  userId:number;
  firstName:string;
  lastName: string;
  middleName:string;
  report_to: string;

  leadSalutionId:number;
  leadSalutionName: number;

  addressInformationId:number;
  street:string;
  city:string;
  province:string;
  postalCode:string;
  country:string;

  suffix:string;
  title:string;
  email:string;
  phone:string;
  department:string;
  mobile:string;
  fax:string;
  createdBy:string;
  createDate:string;
  editDate:string;
  editBy:string;
  isDeleted:Boolean;

}
