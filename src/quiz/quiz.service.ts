import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Redis } from 'ioredis'
import * as R from 'ramda'

import { Question, Answer } from './entities'
import { SaveQuestion } from './dtos'
import { InjectRedis } from '../core/redis'
import { CacheKey } from './constants'

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
    gameId: number,
    data: SaveQuestion[],
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
      question.gameId = gameId

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

        if (question.id) {
          await this.deleteNotExistAnswers(question.id, answers)
        }
      }
      questions.push(question)
    }

    await this.deleteNotExistQuestions(gameId, questions)

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

  async getQuestions(gameId: number): Promise<Question[]> {
    const result = await this.questionRepository.find({
      relations: ['answers'],
      where: { gameId },
    })
    for (const question of result) {
      question.answers = await this.answerRepository.find({
        where: { questionId: question.id },
      })
    }
    return result
  }

  async deleteQuestions(gameId: number): Promise<void> {
    await this.questionRepository.softDelete({ gameId: gameId })
    //TODO: delete related answers
    return
  }

  async getQuestionsWithCache(gameId: number): Promise<Question[]> {
    const cache = await this.redisClient.get(CacheKey.questionList(gameId))
    if (cache) {
      return JSON.parse(cache)
    }
    let result: Question[]
    if (!cache) {
      result = await this.questionRepository.find({
        relations: [
          'answers.id',
          'answers.rank',
          'answers.score',
          'answers.type',
          'answers.content',
          'answers.imageUrl',
          'answers.imageDescription',
        ],
        where: { gameId },
        select: [
          'id',
          'title',
          'type',
          'isMultipled',
          'imageUrl',
          'hintType',
          'hintContent',
        ],
      })
      for (const question of result) {
        question.answers = await this.answerRepository.find({
          where: { questionId: question.id },
        })
      }
      await this.redisClient.set(
        CacheKey.questionList(gameId),
        JSON.stringify(result),
      )
    }
    return result
  }

  private async deleteNotExistQuestions(
    gameId: number,
    questions: Question[],
  ): Promise<void> {
    const currentQuestions = await this.questionRepository.find({
      where: {
        gameId: gameId,
      },
    })
    const notExistQuestions = R.differenceWith(
      (x, y) => x.id === y.id,
      currentQuestions,
      questions,
    )
    if (R.length(notExistQuestions) > 0) {
      await this.questionRepository.softDelete(notExistQuestions)
    }
    return
  }
  private async deleteNotExistAnswers(
    questionId: number,
    anwers: Answer[],
  ): Promise<void> {
    const currentAnswers = await this.answerRepository.find({
      where: {
        questionId: questionId,
      },
    })
    const notExistAnswers = R.differenceWith(
      (x, y) => x.id === y.id,
      currentAnswers,
      anwers,
    )
    if (R.length(notExistAnswers) > 0) {
      await this.answerRepository.softDelete(notExistAnswers)
    }
    return
  }
}
