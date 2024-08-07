type Role = 'EMPLOYEE' | 'MANANGER' | 'ADMIN' | 'USER';
export interface IGenerateToken {
  sub: number;
  name: string;
  username: string;
  role: Role;
}
export interface ISaveToken {
  employeeId?: number;
  token?: string | null;
}
export interface IRefreshToken {
  oldToken: string;
}
