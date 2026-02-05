import { UserRole } from 'src/schemas/user.schema';

export interface UpdateProfileResponse {
  success: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    avatar?: string;
    cover?: string;
    role: UserRole;
    balance: number;
  };
}
