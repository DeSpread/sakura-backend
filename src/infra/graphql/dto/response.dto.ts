import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IsCompletedQuestByUserIdResponse {
  @Field()
  questId: string;

  @Field()
  isCompleted: boolean;
}
