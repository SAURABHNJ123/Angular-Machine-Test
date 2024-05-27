export interface Profile {
    profileImage: File | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
    country: string;
    state: string;
    address: string;
    tags?: string; // Optional field
    subscribe: boolean;
  }
  