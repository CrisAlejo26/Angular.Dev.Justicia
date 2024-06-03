import { UserData } from "./user.interface";

export interface CheckTokenResponse {
  token:    string;
  userData: UserData;
}
