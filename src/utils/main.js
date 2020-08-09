import {MAIN_IMAGES_PATH, ImageTypes, fishText} from "./const.js";

export const render = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

export const generateArrayFromString = (string) => {
  return string.split(`. `);
};

export const getRandomNumber = (firstNumber, secondNumber) => {
  const bottom = Math.ceil(Math.min(firstNumber, secondNumber));
  const top = Math.floor(Math.max(firstNumber, secondNumber));
  return Math.floor(bottom + Math.random() * (top - bottom + 1));
};

export const getRandomDoubleNumber = (firstNumber, secondNumber) => {
  const bottom = Math.min(firstNumber, secondNumber);
  const top = Math.max(firstNumber, secondNumber);
  return (bottom + Math.random() * (top - bottom)).toFixed(1);
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const formateDuration = (duration) => {
  const minute = duration % 60;
  const hour = (duration - minute) / 60;

  const hourText = hour > 0 ? `${hour}h ` : ``;
  const minuteText = minute > 0 ? `${minute}m` : ``;

  return `${hourText} ${minuteText}`;
};

export const getRandomElementFromArray = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

export const getPath = (type, imageName) => {
  let path = ``;

  switch (type) {
    case `icons`:
      path += `${MAIN_IMAGES_PATH}/${ImageTypes.ICON}/${imageName}.svg`;
      break;
    case `emoji`:
      path += `${MAIN_IMAGES_PATH}/${ImageTypes.EMOJI}/${imageName}.png`;
      break;
    default:
      path += MAIN_IMAGES_PATH;
      break;
  }

  return path;
};

export const sentences = generateArrayFromString(fishText);
