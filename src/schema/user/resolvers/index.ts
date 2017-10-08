import { me } from './queries';
import { register, login, updateMe } from './mutation';

export const userResolvers = {
  Query: {
    me,
  },
  Mutation: {
    register,
    login,
    updateMe,
  },
};
