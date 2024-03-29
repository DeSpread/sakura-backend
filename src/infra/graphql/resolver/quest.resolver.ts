import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Quest } from '../../schema/quest.schema';
import { QuestService } from '../../database/service/quest.service';
import { IsCompletedQuestByUserIdResponse } from '../dto/response.dto';

@Resolver(() => Quest)
export class QuestResolver {
  constructor(private readonly questService: QuestService) {}

  @Query(() => Quest)
  async findQuestById(@Args('questId') questId: string) {
    return this.questService.findQuestById(questId);
  }

  @Query(() => IsCompletedQuestByUserIdResponse)
  async isCompletedQuestByUserId(
    @Args('questId') questId: string,
    @Args('userId') userId: string,
  ) {
    return this.questService.isCompletedQuestByUserId(questId, userId);
  }

  @Mutation(() => Quest)
  async completeQuestOfUser(
    @Args('questId') questId: string,
    @Args('userId') userId: string,
  ) {
    return this.questService.completeQuestOfUser(questId, userId);
  }

  @Mutation(() => Quest)
  async verifyTwitterFollowQuest(
    @Args('questId') questId: string,
    @Args('userId') userId: string,
  ) {
    return this.questService.verifyTwitterFollowQuest(questId, userId);
  }

  @Mutation(() => Quest)
  async verifyTwitterRetweetQuest(
    @Args('questId') questId: string,
    @Args('userId') userId: string,
  ) {
    return this.questService.verifyTwitterRetweetQuest(questId, userId);
  }
}
