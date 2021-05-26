export enum PAGE_TYPE {
  LANDING = 'LANDING',
  SSO = 'SSO',
  QUESTION = 'QUESTION',
  FORM = 'FORM',
  RESULT = 'RESULT',
}

export enum PAGE_RESULT_TYPE {
  CUSTOM_BUTTON = 'CUSTOM_BUTTON',
}

export interface CustomButtonMeta {
  buttonText: string
  buttonLink: string
}
