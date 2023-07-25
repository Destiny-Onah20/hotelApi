export interface AdminAttribute {
  id: number,
  name: string,
  password: string,
  email: string,
  isAdmin: boolean,
  verify: boolean,
  token: string,
  updatedAt: Date,
  createdAt: Date
};

