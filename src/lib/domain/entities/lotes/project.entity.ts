export class Project {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly currency: string,
    public readonly logo: string,
    public readonly logoPublicId: string,
    public readonly projectCode: string,
    public readonly createdAt: string
  ) {}
}
