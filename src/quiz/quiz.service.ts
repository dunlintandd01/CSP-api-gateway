import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Redis } from 'ioredis'
import * as R from 'ramda'

import { Question, Answer } from './entities'
import { SaveQuestionReq } from './dtos'
import { InjectRedis } from '../core/redis'

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRedis() private redisClient: Redis,
  ) {}

  async saveQuestions(
    referenceId: number,
    data: SaveQuestionReq[],
    operator: string,
  ): Promise<Question[]> {
    const questions = []
    for (const questionData of data) {
      let question = new Question()
      question = R.merge(questionData, question)
      if (questionData.id) {
        question.id = questionData.id
      } else {
        question.createdBy = operator
      }
      question.updatedBy = operator
      question.referenceId = referenceId

      if (questionData.answers) {
        const answers = []
        for (const answerData of questionData.answers) {
          let answer = new Answer()
          answer = R.merge(answerData, answer)
          if (answerData.id) {
            answer.id = answerData.id
          } else {
            answer.createdBy = operator
          }
          answer.updatedBy = operator
          answers.push(answer)
        }
        question.answers = answers
      }
      questions.push(question)
    }
    const result = await this.questionRepository.save(questions)
    return result
  }

  async getQuestion(id: number): Promise<Question> {
    const result = await this.questionRepository.findOne({
      relations: ['answers'],
      where: { id },
    })
    result.answers = await this.answerRepository.find({
      where: { questionId: id },
    })
    return result
  }

  async getQuestions(referenceId: number): Promise<Question[]> {
    const result = await this.questionRepository.find({
      relations: ['answers'],
      where: { referenceId },
    })
    for (const question of result) {
      question.answers = await this.answerRepository.find({
        where: { questionId: question.id },
      })
    }
    return result
  }

  async deleteQuestions(ids: number[]): Promise<void> {
    await this.questionRepository.softDelete(ids)
    return
  }

  async getQuestionsWithCache(referenceId: number): Promise<Question[]> {
    const cacheKey = `questions_data:${referenceId}`
    const cache = await this.redisClient.get(cacheKey)
    if (cache) {
      return JSON.parse(cache)
    }
    let result: Question[]
    if (!cache) {
      result = await this.questionRepository.find({
        relations: ['answers'],
        where: { referenceId },
      })
      for (const question of result) {
        question.answers = await this.answerRepository.find({
          where: { questionId: question.id },
        })
      }
      await this.redisClient.set(cacheKey, JSON.stringify(result))
    }
    return result
  }
}
