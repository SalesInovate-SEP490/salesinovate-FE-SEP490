
export interface Address {
  addressInformationId: number;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Contract {
  contractId: number;
  userId: number;
  contractStartDate: string; 
  contractTerm: number;
  ownerExpirationNotice: string; 
  specialTerms: string;
  description: string;
  accountId: number;
  priceBookId: number;
  billingAddressId: Address;
  shippingAddressId: Address;
  contactId: number;
  customerSignedTitle: string;
  customerSignedDate: string; 
  companyId: number;
  companySignedDate: string; 
}

export interface Type {
  id: number;
  name: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}