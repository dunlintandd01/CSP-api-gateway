export enum GAME_STATUS_ENUM {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

export interface IGame {
  readonly id: number
  readonly name: string
  readonly status: GAME_STATUS_ENUM
}
