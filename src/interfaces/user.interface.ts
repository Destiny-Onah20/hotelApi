export interface UserAttribute {
  id: number,
  fullname: string,
  password: string,
  email: string,
  phoneNumber: number,
  token: string,
  verify: boolean,
  updatedAt: Date,
  createdAt: Date
};
