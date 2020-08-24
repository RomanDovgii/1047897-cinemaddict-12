import {MIN_DURATION, MAX_DURATION, MAIN_IMAGES_PATH, MAX_RAITING, MOCKS_COUNT, MIN_SENTENCES, MAX_SENTENCES, ImageTypes, MOVIE_NAMES, USER_NAMES, COUNTRIES, GENRES, CONTENT_RAITING, JPG_EXTENSION, PNG_EXTENSION, POPEY_MEETS_SINDBAD_NAME} from "../utils/const.js";
import {getRandomNumber, getRandomDoubleNumber, getRandomElementFromArray, sentences} from "../utils/main.js";
import {generateComments} from "./comments.js";

const movieMocks = [];

const getMovieName = () => {
  return MOVIE_NAMES[getRandomNumber(0, MOVIE_NAMES.length - 1)];
};

const getPeopleList = (quantity) => {
  const people = [];

  for (let i = 0; i < quantity; i++) {
    people.push(USER_NAMES[getRandomNumber(0, USER_NAMES.length - 1)]);
  }

  return people;
};

const getDescription = () => {
  const sentencesCount = getRandomNumber(MIN_SENTENCES, MAX_SENTENCES);
  let descriptionText = ``;

  for (let i = 0; i < sentencesCount; i++) {
    descriptionText += sentences[getRandomNumber(0, sentences.length - 1)];
  }

  return descriptionText;
};

const getGenres = () => {
  const genresCount = getRandomNumber(1, 5);
  const genresLocal = [];

  for (let i = 0; i < genresCount; i++) {
    const genre = GENRES[getRandomNumber(0, GENRES.length - 1)];

    if (!genresLocal.includes(genre)) {
      genresLocal.push(genre);
    } else {
      i--;
    }

  }

  return genresLocal;
};

const getPath = () => {
  const pathToFile = `${MAIN_IMAGES_PATH}/${ImageTypes.POSTER}/`;
  const imageName = MOVIE_NAMES[getRandomNumber(0, MOVIE_NAMES.length - 1)].toLowerCase().split(` `).join(`-`);


  switch (imageName) {
    case `made-for-each-other`:
      return `${pathToFile}${imageName}${PNG_EXTENSION}`;

    case `popeye-the-sailor-meets-sindbad-the-sailor`:
      return `${pathToFile}${POPEY_MEETS_SINDBAD_NAME}${PNG_EXTENSION}`;

    default:
      return `${pathToFile}${imageName}${JPG_EXTENSION}`;
  }
};

export const createMovie = () => {
  return {
    name: getMovieName(),
    originalName: getMovieName(),
    director: getRandomElementFromArray(USER_NAMES),
    writers: getPeopleList(3),
    actors: getPeopleList(5),
    release: new Date(),
    runtime: getRandomNumber(MIN_DURATION, MAX_DURATION),
    country: getRandomElementFromArray(COUNTRIES),
    genres: getGenres(),
    description: getDescription(),
    movieRaiting: getRandomElementFromArray(CONTENT_RAITING),
    raiting: getRandomDoubleNumber(0, MAX_RAITING),
    path: getPath(),
    isWatchlist: Boolean(getRandomNumber(0, 1)),
    isWatched: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
    comments: generateComments(),
    id: getRandomNumber(0, 1000000)
  };
};

for (let i = 0; i < MOCKS_COUNT; i++) {
  movieMocks.push(createMovie());
}

export const mocks = movieMocks;
