import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ObjectID } from 'mongodb';

/**
 * Defines the pipe for MongoDB ObjectID validation and transformation
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectID> {
  /**
   * Validates and transforms a value to a MongoDB ObjectID
   *
   * @remarks
   * Throws a ArgumentException if the validation fails
   *
   * @param value - The value to validate and transform
   * @returns The MongoDB ObjectID
   */
  public transform(value: any): ObjectID {
    try {
      const transformedObjectId: ObjectID = ObjectID.createFromHexString(value);
      return transformedObjectId;
    } catch (error) {
      throw new HttpException(
        'Validation failed (ObjectId is expected)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
