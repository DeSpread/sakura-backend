import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { UserWallet } from '../../schema/user.schema';

@ArgsType()
@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  gmail: string;

  @Field(() => [UserWallet], { nullable: true })
  wallets: [UserWallet];

  @Field({ nullable: true })
  profileImageUrl: string;
}

@ArgsType()
@InputType()
export class UserCreateByGmailInput {
  @Field()
  gmail: string;

  @Field({ nullable: true })
  profileImageUrl: string;
}
