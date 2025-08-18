export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl: string;
}

export type GetMeResponse = User;
