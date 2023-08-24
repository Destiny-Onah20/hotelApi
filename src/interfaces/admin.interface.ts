export interface AdminAttribute {
  id: number,
  name: string,
  password: string,
  email: string,
  image: string,
  cloudId: string,
  emailPin: string;
  status: boolean,
  verify: boolean,
  token: string,
  updatedAt: Date,
  createdAt: Date,
};

