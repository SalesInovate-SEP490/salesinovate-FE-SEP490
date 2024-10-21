
export interface Type {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
}

export interface User{
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email:string;
  createDate: string;
  roles: Role[];
  id: string;
  name:string;
  phone: number;
  background: string;
  avatar: string;
  avatarId: string;
  image: string;
  isActive: boolean;
}



