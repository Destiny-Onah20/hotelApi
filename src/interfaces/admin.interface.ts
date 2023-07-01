export interface AdminAttribute {
  id: number,
  hotelName: string,
  password: string,
  email: string,
  isAdmin: boolean,
  verify: boolean,
  token: string,
  updatedAt: Date,
  createdAt: Date
};

