
export interface Campaign {
    id: string,
    campaignId: number,
    campaignName:string,
    status: string,
    isActive: boolean;
    startDate: string;
    endDate: string;
    description: string;
    role: Role;
    roleId: number;
    roleName: string;
}

export interface Type {
    id: number;
    name: string;
  }
  
  export interface Role {
    roleId: number;
    roleName: string;
  }