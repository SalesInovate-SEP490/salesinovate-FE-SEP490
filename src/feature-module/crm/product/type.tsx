
export interface Product {
  productId: number;
  productName: string;
  productCode: string;
  productDescription: string;
  isActive: number;
  productFamily: {
    productFamilyId: number;
    productFamilyName: string;
  }
}

export interface ProductFamily {
  productFamilyId: number;
  productFamilyName: string;
}

export interface Type {
  id: number;
  name: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}