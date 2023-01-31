import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCode } from '../../../constant/error.constant';
import { Quest } from '../../schema/quest.schema';
import { QuestPolicy } from '../../graphql/dto/policy.dto';
import { QuizQuestInput } from '../../../model/quiz.quest.model';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { QuestPolicyType } from '../../../constant/quest.policy';
import { UserService } from './user.service';
import { User } from '../../schema/user.schema';
import { VerifySocialQuest } from '../../../model/verify.quest.model';
import { VerifierService } from './verifier.service';
import { ObjectUtil } from '../../../util/object.util';

@Injectable()
export class QuestService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    @InjectModel(Quest.name)
    private readonly questModel: Model<Quest>,
    private userService: UserService,
    private verifierService: VerifierService,
  ) {}

  async isInvalidQuest(questPolicy: QuestPolicy): Promise<boolean> {
    try {
      switch (questPolicy.questPolicy) {
        case QuestPolicyType.QUIZ:
          const quizQuestInput: QuizQuestInput = JSON.parse(
            questPolicy.context,
          );
          return false;
        case QuestPolicyType.VERIFY_TWITTER_FOLLOW:
          const verifyTwitterQuest: VerifySocialQuest = JSON.parse(
            questPolicy.context,
          );
          return false;
      }
    } catch (e) {
      this.logger.error(`Requested quest is invalid. error: [${e.message}]`);
      return true;
    }
  }

  async getQuestList(quests: Quest[]): Promise<Quest[]> {
    const questList: Quest[] = [];
    for (const quest of quests) {
      if (await this.isInvalidQuest(quest.questPolicy)) {
        throw ErrorCode.BAD_REQUEST_QUIZ_QUEST_COLLECTION;
      }
      const questModel = new this.questModel(quest);
      questList.push(await questModel.save());
    }
    return questList;
  }

  async completeQuestOfUser(questId: string, userId: string) {
    const user: User = await this.userService.findUserById(userId);
    const quest: Quest = await this.questModel.findByIdAndUpdate(
      { _id: questId },
      {
        $push: {
          completedUsers: user,
        },
      },
      { new: true },
    );
    return quest;
  }

  async verifyTwitterFollowQuest(questId: string, userId: string) {
    const quest: Quest = await this.questModel.findById(questId);

    if (await this.isInvalidQuest(quest.questPolicy)) {
      throw ErrorCode.BAD_REQUEST_QUIZ_QUEST_COLLECTION;
    }

    const verifyTwitterQuest: VerifySocialQuest = JSON.parse(
      quest.questPolicy.context,
    );
    const targetTwitterUsername: string =
      verifyTwitterQuest.verifyTwitterFollowQuest.username;

    const user: User = await this.verifierService.isFollowTwitterByUserId(
      userId,
      targetTwitterUsername,
    );

    if (ObjectUtil.isNull(user)) {
      throw ErrorCode.NOT_FOUND_USER;
    }

    await this.questModel.findByIdAndUpdate(
      { _id: questId },
      {
        $push: {
          completedUsers: user,
        },
      },
      { new: true },
    );

    this.logger.debug(
      `Successful to verify twitter follow questId: ${questId}, userId: ${userId}, targetTwitterUsername: ${targetTwitterUsername}`,
    );

    return quest;
  }
}
