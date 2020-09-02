import {MAIN_IMAGES_PATH, ImageTypes, FISH_TEXT, minutesInHour} from "./const.js";
import moment from "moment";

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
  const time = moment.utc().startOf(`day`).add({minutes: duration});
  switch (true) {
    case duration < minutesInHour:
      return time.format(`m[m]`);
    case duration > minutesInHour && duration % minutesInHour === 0:
      return time.format(`H[h]`);
    default:
      return time.format(`H[h] M[m]`);
  }
};

export const getRandomElementFromArray = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

export const getPath = (type, imageName) => {
  switch (type) {
    case `icons`:
      return `${MAIN_IMAGES_PATH}/${ImageTypes.ICON}/${imageName}.svg`;
    case `emoji`:
      return `${MAIN_IMAGES_PATH}/${ImageTypes.EMOJI}/${imageName.replace(`emoji-`, ``)}.png`;
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

export const updateItem = (elements, updatedElement) => {
  const index = elements.findIndex((item) => item.id === updatedElement.id);

  if (index === -1) {
    return elements;
  }

  return [
    ...elements.slice(0, index),
    updatedElement,
    ...elements.slice(index + 1)
  ];
};

const formatDigitsProperly = (digit) => {
  return digit < 10 ? `0${digit}` : digit;
};

export const generateDateString = (minimumYear) => {
  const year = getRandomNumber(minimumYear, 2020);
  const month = getRandomNumber(1, 12);
  const day = getRandomNumber(1, 30);
  const hour = getRandomNumber(0, 23);
  const minute = getRandomNumber(0, 59);
  const second = getRandomNumber(0, 59);
  return `${year}-${formatDigitsProperly(month)}-${formatDigitsProperly(day)}T${formatDigitsProperly(hour)}:${formatDigitsProperly(minute)}:${formatDigitsProperly(second)}`;
};
