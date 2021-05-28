import { Injectable, Logger } from '@nestjs/common'
import { hk01 } from '@hk01-digital/shared-event-proto'
import EventbusSDK from '@hk01-digital/eventbus-js-sdk'
import { EventBusSDKService } from './eventBusSDK.service'

const { GameCompleted } = hk01.protobuf.game.mcgame

@Injectable()
export class PointsService {
  logger: Logger

  constructor(private eventBusSDKService: EventBusSDKService) {
    this.logger = new Logger(PointsService.name)
  }

  async publishGameCompleted(
    gameId: number,
    accountId: number,
    scoreInGame: number,
    isFirstTimeGamer: boolean,
    completedTs: number,
    lotteryRewardId: number,
    attempt: number,
  ): Promise<any> {
    try {
      const pojo = {
        gameId: gameId.toString(),
        accountId: accountId,
        scoreInGame: scoreInGame,
        isFirstTimeGamer: isFirstTimeGamer === true ? 1 : 0,
        attempt: attempt,
        completedTs: completedTs,
        lotteryRewardId: lotteryRewardId,
      }

      const verifyErr = GameCompleted.verify(pojo)
      if (verifyErr) {
        //TODO: integrate error
        throw new Error('protobuf error')
      }

      const message = GameCompleted.create(pojo)
      const { topic, envelope } = EventbusSDK.createEnvelopeWithBody(message)
      return this.eventBusSDKService.publish(topic, envelope)
    } catch (error) {
      //TODO: insert to eventbus retry queue
      this.logger.error('eventbus publish error')
      return false
    }
  }
}
