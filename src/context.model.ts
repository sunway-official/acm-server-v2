import { User } from './database/entities/user';
import { Repository } from 'typeorm';

export interface IRepositories {
  userRepo: Repository<User>;
}
export interface IContextModel {
  repos: IRepositories;
  user: User | undefined;
}
