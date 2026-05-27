const accents = ["amber", "sky", "violet"];

export const pickAccent = (index = 0) => {
  return accents[index] ?? accents[0];
};
