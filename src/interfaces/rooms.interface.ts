interface roomAttributes {
  id: number;
  roomNumber: number;
  roomDescription: string;
  price: number;
  image: string;
  booked: boolean;
  cloudId: string;
  address: string;
  hotelname: string;
  hotelId: number;
  checkIn: string | null;
  checkOut: string | null;
  rating: number;
  adminId: number;
  createdAt: Date;
  updatedAt: Date
};

export default roomAttributes;