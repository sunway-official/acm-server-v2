import { register } from './register';
import { login } from './login';

export const userResolvers = {
  Query: {},
  Mutation: {
    register,
    login,
  },
};
