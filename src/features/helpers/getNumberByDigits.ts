export const getNumberByDigits = (num: number) => {
  return [Math.floor(num / 100) % 10, Math.floor(num / 10) % 10, num % 10];
};
