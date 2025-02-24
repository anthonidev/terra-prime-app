"use server";

import {
  CreateUserDto,
  PaginatedUsers,
  UpdateUserDto,
  UserList,
} from "@/types/user.types";
import { httpClient } from "@/lib/api/http-client";

export async function createUser(data: CreateUserDto): Promise<UserList> {
  try {
    return await httpClient<UserList>("/api/users", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: UpdateUserDto
): Promise<UserList> {
  try {
    return await httpClient<UserList>(`/api/users/${id}`, {
      method: "PATCH",
      body: data,
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
}

export async function getUsers(
  params?: Record<string, unknown> | undefined
): Promise<PaginatedUsers> {
  return httpClient<PaginatedUsers>("/api/users", {
    params,
  });
}
