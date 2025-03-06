import { DefaultSession, DefaultUser } from "next-auth";
import { View } from "./user.types";
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      fullName: string;
      document: string;
      photo: string;
      role: {
        id: number;
        code: string;
        name: string;
      };
      views: View[];
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    document: string;
    photo: string;
    role: {
      id: number;
      code: string;
      name: string;
    };
    views: View[];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      fullName: string;
      photo: string;
      document: string;
      role: {
        id: number;
        code: string;
        name: string;
      };
      views: View[];
    };
    error?: string;
  }
}
