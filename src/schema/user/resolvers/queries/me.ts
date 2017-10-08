import { IContextModel } from '../../../../context.model';
export const me = (_ROOT: undefined, _: {}, context: IContextModel) => {
  if (!context.user) {
    throw new Error('unauthorized');
  }
  return context.user;
};
