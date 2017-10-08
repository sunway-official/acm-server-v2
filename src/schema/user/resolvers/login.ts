import { config } from '../../../config';
import { IContextModel } from '../../../context.model';
import { sign } from 'jsonwebtoken';

interface ILoginModel {
  email: string;
  password: string;
}

export const login = async (
  _: undefined,
  data: ILoginModel,
  context: IContextModel,
) => {
  try {
    if (context.user) {
      throw new Error('still-logging-in');
    }
    const { repos: { userRepo } } = context;

    const user = await userRepo.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error('user-not-found');
    }

    const isPasswordMatched = await user.comparePassword(data.password);
    if (!isPasswordMatched) {
      throw new Error('wrong-password');
    }

    const payload = {
      id: user.id,
      versionKey: user.versionKey,
    };

    const token = await sign(payload, config.authKeys.jwtKey, {
      expiresIn: '5s',
    });
    const refreshToken = await sign(payload, config.authKeys.jwtRefreshKey, {
      expiresIn: '7d',
    });

    return {
      token,
      refreshToken,
    };
  } catch (error) {
    throw new Error(error);
  }
};
