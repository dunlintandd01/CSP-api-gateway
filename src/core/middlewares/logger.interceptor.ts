import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

const logger = new Logger('RequestLog')

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    logger.log(`Request Comming [${request.path}]`)

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          logger.log(
            `Request Response [${request.path} (${Date.now() - now}ms)]`,
          ),
        ),
      )
  }
}
