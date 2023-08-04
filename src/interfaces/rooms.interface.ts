interface roomAttributes {
  id: number;
  roomNumber: number;
  roomDescription: string;
  price: number;
  image: string;
  booked: boolean;
  cloudId: string;
  hotelId: number;
  checkIn: Date | null;
  checkOut: Date | null;
  rating: number;
  adminId: number;
  createdAt: Date;
  updatedAt: Date
};

export default roomAttributes;