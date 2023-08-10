export interface AdminAttribute {
  id: number,
  name: string,
  password: string,
  email: string,
  image: string,
  cloudId: string,
  emailPin: string;
  isAdmin: boolean,
  verify: boolean,
  token: string,
  updatedAt: Date,
  createdAt: Date,
  del: boolean
};

