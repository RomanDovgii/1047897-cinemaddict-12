import {MAIN_IMAGES_PATH, ImageTypes, FISH_TEXT} from "./const.js";

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
  switch (type) {
    case `icons`:
      return `${MAIN_IMAGES_PATH}/${ImageTypes.ICON}/${imageName}.svg`;
    case `emoji`:
      return `${MAIN_IMAGES_PATH}/${ImageTypes.EMOJI}/${imageName}.png`;
    default:
      return MAIN_IMAGES_PATH;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const sentences = FISH_TEXT.split(`. `);

export const convertEnumToArray = (localEnum) => {
  return Object.values(localEnum);
};
