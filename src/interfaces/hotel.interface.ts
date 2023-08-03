export interface hotelAttributes {
  id: number,
  hotelName: string,
  address: string,
  description: string,
  website: string,
  adminId: number,
  imageId: string,
  cloudId: string,
  email: string,
  totalRooms?: number;
  city: string,
  state: string,
  updatedAt: Date,
  createdAt: Date
};