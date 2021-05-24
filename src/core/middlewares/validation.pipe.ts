import {
  ValidationPipe as NestjsValidationPipe,
  ValidationError,
} from '@nestjs/common'

export const ValidationPipe = new NestjsValidationPipe({
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => errors[0],
})
