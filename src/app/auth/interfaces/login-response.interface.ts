import { UserData } from "./user.interface";

export interface LoginResponse {
  token: string;
  userData: UserData;
}
