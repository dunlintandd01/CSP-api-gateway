import { Body, Controller, Post } from '@nestjs/common'

import { QuizService } from './quiz.service'

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('/')
  async createQuestion(@Body() question) {
    await this.quizService.createQuestion(question)
  }
}
