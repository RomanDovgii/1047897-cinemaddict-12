import {MAIN_IMAGES_PATH, ImageType, MINUTES_IN_HOUR, UserRank} from "./const.js";
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

export const convertEnumToCollection = (localEnum) => {
  return Object.values(localEnum);
};

export const getRank = (moviesTotal) => {
  switch (true) {
    case (moviesTotal <= UserRank.NOVICE.maximunMovies) && (moviesTotal > UserRank.NO_RANK.maximunMovies):
      return UserRank.NOVICE.name;
    case (moviesTotal <= UserRank.FAN.maximunMovies) && (moviesTotal > UserRank.NOVICE.maximunMovies):
      return UserRank.FAN.name;
    case (moviesTotal > UserRank.FAN.maximunMovies):
      return UserRank.MOVIE_BUFF.name;
    default:
      return UserRank.NO_RANK.name;
  }
};
