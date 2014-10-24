var MathUtil = {};

MathUtil.getRandom = function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};

MathUtil.getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
