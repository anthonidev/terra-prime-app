export class Role {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly name: string
  ) {}
}

export class View {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly url: null | string,
    public readonly order: number,
    public readonly metadata: null,
    public readonly children: View[]
  ) {}
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly document: string,
    public readonly photo: null,
    public readonly role: Role,
    public readonly views: View[]
  ) {}
}

export class Profile {
  constructor(
    public readonly user: User,
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {}
}

export class UserList {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly document: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly photo: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly role: Role
  ) {}
}
