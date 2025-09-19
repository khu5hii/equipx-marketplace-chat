export interface User {
    _id?: string;
    name: string;
    email: string;
    role: "seller" | "buyer";
    password?: string;
    confirmPassword?: string;
    token?: string;
}

export interface Message {
  _id?: string;
  senderId: string;
  sender: string;
  message: string;
  timestamp: string;
  equipmentId: string;
}

export interface Equipment {
    _id: string;
    name: string;
    image: string;
    status: "new" | "used" | "unused";
    price: number;
    seller: string;
    sellerId: string;
    saleStatus?: "active" | "sold" | "archived";
}