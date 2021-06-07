import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as R from 'ramda'

import { QuizService, Question, Answer } from '.'
import { getRedisToken } from '../core/redis'

describe('QuizService', () => {
  let service: QuizService

  const fakeQuestionId = 1
  const fakeAnswerId = 2
  const fakeUserName = 'tester'
  const fakeReferenceId = 456
  const fakeText = 'test'

  const fakeAnswer = {
    id: fakeAnswerId,
    questionId: fakeQuestionId,
    content: fakeText,
  }
  const fakeQuestion = {
    id: fakeQuestionId,
    answers: [fakeAnswer],
    title: fakeText,
  }

  class QuestionRepo {
    static save = jest.fn().mockImplementation(([question]) => [question])
    static find = jest.fn().mockResolvedValue([fakeQuestion])
    static findOne = jest.fn().mockResolvedValue(fakeQuestion)
    static softDelete = jest.fn().mockResolvedValue(null)
  }

  class AnswerRepo {
    static find = jest.fn().mockResolvedValue([fakeAnswer])
  }

  class RedisClient {
    static get = jest.fn().mockResolvedValue(JSON.stringify([fakeQuestion]))
    static set = jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getRepositoryToken(Question),
          useValue: QuestionRepo,
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: AnswerRepo,
        },
        {
          provide: getRedisToken(),
          useValue: RedisClient,
        },
      ],
    }).compile()

    service = moduleRef.get<QuizService>(QuizService)
  })

  describe('saveQuestions', () => {
    it('should return an array of questions', async () => {
      const answer = R.merge(fakeAnswer, { updatedBy: fakeUserName })
      expect(
        await service.saveQuestions(
          fakeReferenceId,
          [fakeQuestion],
          fakeUserName,
        ),
      ).toStrictEqual([
        R.merge(fakeQuestion, {
          gameId: fakeReferenceId,
          updatedBy: fakeUserName,
          answers: [answer],
        }),
      ])
    })
  })

  describe('getQuestion', () => {
    it('should return a question', async () => {
      expect(await service.getQuestion(fakeQuestionId)).toStrictEqual(
        fakeQuestion,
      )
    })
  })

  describe('getQuestions', () => {
    it('should retrun an array of question', async () => {
      expect(await service.getQuestions(fakeReferenceId)).toStrictEqual([
        fakeQuestion,
      ])
    })
  })

  describe('deleteQuestion', () => {
    it('should execute delete func', async () => {
      await service.deleteQuestions(fakeReferenceId)
      expect(QuestionRepo.softDelete).toHaveBeenCalledWith({
        gameId: fakeReferenceId,
      })
    })
  })

  describe('getQuestionsWithCache', () => {
    it('should return an array of question', async () => {
      expect(
        await service.getQuestionsWithCache(fakeReferenceId),
      ).toStrictEqual([fakeQuestion])
    })

    it('should set question to cache', async () => {
      RedisClient.get = jest.fn().mockResolvedValue(null)
      await service.getQuestionsWithCache(fakeReferenceId)
      expect(RedisClient.set).toHaveBeenCalled()
    })
  })
})
