import { User } from 'src/services/user.schema';

export interface RequestWithUser extends Request {
  user: User;
}
