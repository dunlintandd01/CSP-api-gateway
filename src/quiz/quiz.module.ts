import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question, Answer } from './entities'

import { QuizService } from './quiz.service'

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer])],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
