import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Game {
  @Prop()
  name: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
