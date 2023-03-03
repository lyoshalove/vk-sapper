export const changeToGetValuesType = <
  V extends string,
  T extends { [key in string]: V }
>(
  object: T
): T => object;