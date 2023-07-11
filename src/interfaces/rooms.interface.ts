interface roomAttributes {
  id: number;
  roomNumber: number;
  roomDescription: string;
  price: number;
  image: string;
  hotelId: number;
  adminId: number;
  createdAt: Date;
  updatedAt: Date
};

export default roomAttributes;