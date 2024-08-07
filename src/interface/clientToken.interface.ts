export interface IPayloadClientToken {
  sub: number;
  name: string;
  username: string;
  role?: string;
}
export interface IClientToken {
  token: string;
}
