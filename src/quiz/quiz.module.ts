import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question, Answer } from './entities'

import { QuizController } from './quiz.controller'
import { QuizService } from './quiz.service'

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer])],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
