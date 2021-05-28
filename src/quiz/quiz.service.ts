import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Question, Answer } from './entities'

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async createQuestion(
    question: Question,
    answers?: Answer[],
  ): Promise<Question> {
    question.createdAt = new Date()

    const newQuestion = this.questionRepository.create({ ...question })
    const result = await this.questionRepository.save(newQuestion)

    if (answers) {
      await this.answerRepository.save(answers)
    }
    return result
  }
}
