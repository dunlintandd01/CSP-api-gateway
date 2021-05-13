export interface GAME_TYPE {
  NONE: 'NONE';
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE';
  PSY_TEST: 'PSY_TEST';
}
export interface GAME_STATUS {
  DRAFT: 'DRAFT';
  PUBLISHED: 'PUBLISHED';
  DELETED: 'DELETED';
}

export interface USER_AGENT_LIMIT_MODE {
  NONE: 'NONE';
  HK01_WEBVIEW_ONLY: 'HK01_WEBVIEW_ONLY';
  WEB_ONLY: 'WEB_ONLY';
}
export interface AUTH_MODE {
  PUBLIC: 'PUBLIC';
  STAFF: 'STAFF';
  MEMBER_WITHOUT_BIND_PHONE: 'MEMBER_WITHOUT_BIND_PHONE';
  MEMBER_BIND_PHONE: 'MEMBER_BIND_PHONE';
}

export interface ANSWER_DISPLAY_MODE {
  NONE: 'NONE';
  IN_QUESTION: 'IN_QUESTION';
  POST_GAME: 'POST_GAME';
}
export interface QUESTION_ORDER_MODE {
  ASC: 'ASC';
  DESC: 'DESC';
  RANDOM: 'RANDOM';
}

export interface IGame extends Document {
  readonly _id: string;
  readonly name: string;
}
