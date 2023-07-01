import Admin from "../models/admin.model";
export interface hotelAttributes {
  id: number,
  hotelName: string,
  address: string,
  description: string,
  website: string,
  adminId: number,
  admin?: any;
  email: string,
  city: string,
  state: string,
  updatedAt: Date,
  createdAt: Date
};