import { User } from '../../../../database/entities/user';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IContextModel } from '../../../../context.model';

export const updateMe = async (
  _: undefined,
  data: object,
  context: IContextModel,
) => {
  if (!context.user) {
    throw new Error('unauthorized');
  }

  try {
    const { repos: { userRepo } } = context;

    const parsedData: User = plainToClass(User, data);

    const errors = await validate(parsedData, {
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new Error('invalid-body');
    } else {
      await userRepo.updateById(context.user.id, data);
      const updatedUser = await userRepo.findOneById(context.user.id);

      return updatedUser;
    }
  } catch (error) {
    throw new Error(error);
  }
};
