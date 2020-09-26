import {MAIN_IMAGES_PATH, ImageType, FISH_TEXT, MINUTES_IN_HOUR} from "./const.js";
import moment from "moment";

export const formateDuration = (duration) => {
  const time = moment.utc().startOf(`day`).add({minutes: duration});
  switch (true) {
    case duration < MINUTES_IN_HOUR:
      return time.format(`m[m]`);
    case duration > MINUTES_IN_HOUR && duration % MINUTES_IN_HOUR === 0:
      return time.format(`H[h]`);
    default:
      return time.format(`H[h] M[m]`);
  }
};

export const getPath = (type, imageName) => {
  switch (type) {
    case `icons`:
      return `${MAIN_IMAGES_PATH}/${ImageType.ICON}/${imageName}.svg`;
    case `emoji`:
      return `${MAIN_IMAGES_PATH}/${ImageType.EMOJI}/${imageName.replace(`emoji-`, ``)}.png`;
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

export const convertEnumToCollection = (localEnum) => {
  return Object.values(localEnum);
};

export const getRank = (moviesTotal) => {
  switch (true) {
    case (moviesTotal <= 10) && (moviesTotal > 0):
      return `novice`;
    case (moviesTotal <= 20) && (moviesTotal > 10):
      return `fan`;
    case (moviesTotal > 20):
      return `movie buff`;
    default:
      return ``;
  }
};
