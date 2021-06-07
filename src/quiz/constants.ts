export const CacheKey = {
  questionList: (referenceId: string | number): string =>
    `questions:${referenceId}`,
}
