import { validate } from 'class-validator';
import { User } from '../../../database/entities/user';
import { IContextModel } from '../../../context.model';

interface IRegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async (
  _: undefined,
  data: IRegisterModel,
  context: IContextModel,
) => {
  try {
    const { repos: { userRepo } } = context;

    const user = new User();
    Object.assign(user, data);

    const validationErrors = await validate(user, {
      skipMissingProperties: true,
    });

    if (validationErrors.length > 0) {
      throw new Error(`invalid-${validationErrors[0].property}`);
    } else {
      const newUser = await userRepo.save(user);
      return newUser;
    }
  } catch (error) {
    throw new Error(error);
  }
};
