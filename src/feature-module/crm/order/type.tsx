
export interface PriceBook {
    id: string;
    priceBookId: number;
    productId: number;
    priceBookName: string;
    description: string;
    isActive: Boolean;
    isStandardPriceBook: Boolean;
    role:Role;
    roleId:number;
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