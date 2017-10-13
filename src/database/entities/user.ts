import { compare, genSalt, hash } from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment') public id: number;

  @Column()
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @Column()
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Column({ unique: true })
  public email: string;

  @Column()
  @Matches(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,20}$)'))
  @IsNotEmpty()
  public password: string;

  @Column({
    default: 'unknown',
  })
  @IsNotEmpty()
  @IsIn(['male', 'female', 'unknown'])
  public gender: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(200)
  public avatarUrl: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  public dob: Date;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @MaxLength(200)
  public language: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @MaxLength(200)
  public bio: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @MaxLength(200)
  public linkedinId: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @MaxLength(200)
  public facebookId: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @MaxLength(200)
  public twitterId: string;

  @Column({
    default: 1,
  })
  public versionKey: number;

  @CreateDateColumn() public createdAt: string;

  @UpdateDateColumn() public updatedAt: string;

  public async hashPassword(): Promise<void> {
    const salt = await genSalt(12);
    this.password = await await hash(this.password, salt);
  }

  public async comparePassword(password: string): Promise<boolean> {
    const result = await compare(password, this.password);
    return result;
  }
}
