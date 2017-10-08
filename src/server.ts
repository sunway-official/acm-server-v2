import { IRepositories } from './context.model';
import { schema } from './schema/index';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { connectToDB } from './database/index';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import { User } from './database/entities/user';
import * as jwt from 'jsonwebtoken';
import { config } from './config';
import { plainToClass } from 'class-transformer';

class IAuthRequest {
  public id: number;
  public versionKey: number;
}

export const start = async () => {
  const app = express();

  app.use(helmet());
  app.use(cors());

  const connection = await connectToDB();

  const userRepo = connection.getRepository(User);
  const repos: IRepositories = {
    userRepo,
  };

  const authenticate = async (
    req: express.Request & { user: User | undefined },
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      // Get token from request headers
      const token = req.header('authorization');

      // If there is no token then don't do anything
      if (!token) {
        return next();
      }

      // Verify token and get the raw payload
      const rawPayload = await jwt.verify(token, config.authKeys.jwtKey);

      // Parse the payload to proper type
      const payload: IAuthRequest = plainToClass(IAuthRequest, rawPayload);
      const { id, versionKey } = payload;

      const user = await userRepo.findOneById(id);
      if (!user || versionKey !== user.versionKey) {
        return next();
      }

      req.user = user;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = req.get('RefreshToken');

        // tslint:disable-next-line:no-console
        console.log(refreshToken);

        if (!refreshToken) {
          return next();
        }

        const rawPayload = await jwt.verify(
          refreshToken,
          config.authKeys.jwtRefreshKey,
        );

        const payload: IAuthRequest = plainToClass(IAuthRequest, rawPayload);
        const { id, versionKey } = payload;

        const user = await userRepo.findOneById(id);
        if (!user || versionKey !== user.versionKey) {
          return next();
        }

        req.user = user;

        const newPayload = {
          id: user.id,
          versionKey: user.versionKey,
        };

        const newToken = await jwt.sign(newPayload, config.authKeys.jwtKey, {
          expiresIn: '20m',
        });
        const newRefreshToken = await jwt.sign(
          newPayload,
          config.authKeys.jwtRefreshKey,
          { expiresIn: '7d' },
        );

        res.set('Access-Control-Expose-Headers', 'X-Token, X-Refresh-Token');
        res.set('X-Token', newToken);
        res.set('X-Refresh-Token', newRefreshToken);
        return next();
      }
      return next();
    }
  };

  app.use(authenticate);

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress((req: express.Request & { user: User | undefined }) => ({
      schema,
      context: {
        repos,
        user: req.user,
      },
    })),
  );

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    }),
  );

  return app.listen(8080, () => {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${8080}`);
  });
};

export const stop = (app: Server) => {
  app.close();
};
