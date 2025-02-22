/* eslint-disable */
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

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
      role: {
        id: number;
        code: string;
        name: string;
      };
      views: {
        id: number;
        code: string;
        name: string;
        icon: string;
        url: null | string;
        order: number;
        metadata: null;
        children: {
          id: number;
          code: string;
          name: string;
          icon: string;
          url: string;
          order: number;
          metadata: null;
        }[];
      }[];
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
    role: {
      id: number;
      code: string;
      name: string;
    };
    views: {
      id: number;
      code: string;
      name: string;
      icon: string;
      url: null | string;
      order: number;
      metadata: null;
      children: {
        id: number;
        code: string;
        name: string;
        icon: string;
        url: string;
        order: number;
        metadata: null;
      }[];
    }[];
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
      document: string;
      role: {
        id: number;
        code: string;
        name: string;
      };
      views: {
        id: number;
        code: string;
        name: string;
        icon: string;
        url: null | string;
        order: number;
        metadata: null;
        children: {
          id: number;
          code: string;
          name: string;
          icon: string;
          url: string;
          order: number;
          metadata: null;
        }[];
      }[];
    };
    error?: string;
  }
}
