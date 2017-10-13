import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { EventSubscriber } from 'typeorm';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { User } from '../entities/user';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  public listenTo() {
    return User;
  }
  public async beforeInsert(event: InsertEvent<User>) {
    if (!event.entity.gender) {
      event.entity.gender = 'unknown';
    }

    event.entity.email = event.entity.email.toLowerCase();
    await event.entity.hashPassword();
  }
  public async beforeUpdate(event: UpdateEvent<User>) {
    const result = await event.databaseEntity.comparePassword(
      event.entity.password,
    );
    if (!result) {
      await event.entity.hashPassword();
      event.entity.versionKey += 1;
    }
  }
}
