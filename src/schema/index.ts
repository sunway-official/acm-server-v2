import { IResolvers } from 'graphql-tools/dist/Interfaces';
import { userResolvers } from './user/resolvers/index';
import { userType } from './user';
import { globalTypes } from './globalTypes';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = [userType, globalTypes];
const resolvers: IResolvers = {
  Query: { ...userResolvers.Query },
  Mutation: { ...userResolvers.Mutation },
};

export const schema = makeExecutableSchema({
  typeDefs: [...typeDefs],
  resolvers,
});
