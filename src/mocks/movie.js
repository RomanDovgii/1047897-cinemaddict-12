import {MIN_DURATION, MAX_DURATION, MAIN_IMAGES_PATH, MAX_RAITING, MOCKS_COUNT, MIN_SENTENCE, MAX_SENTENCE, ImageTypes, movieNames, userNames, countries, genres, contentRaiting} from "../utils/const.js";
import {getRandomNumber, getRandomDoubleNumber, getRandomElementFromArray, sentences} from "../utils/main.js";
import {generateComments} from "./comments.js";

let movieMocks = [];

const getMovieName = () => {
  return movieNames[getRandomNumber(0, movieNames.length - 1)];
};

const getPeopleList = (quantity) => {
  let people = [];

  for (let i = 0; i < quantity; i++) {
    people.push(userNames[getRandomNumber(0, userNames.length - 1)]);
  }

  return people;
};

const getDescription = () => {
  const sentencesCount = getRandomNumber(MIN_SENTENCE, MAX_SENTENCE);
  let descriptionText = ``;

  for (let i = 0; i < sentencesCount; i++) {
    descriptionText += sentences[getRandomNumber(0, sentences.length - 1)];
  }

  return descriptionText;
};

const getGenres = () => {
  let genresCount = getRandomNumber(1, 5);
  let genresLocal = [];

  for (let i = 0; i < genresCount; i++) {
    const genre = genres[getRandomNumber(0, genres.length - 1)];

    if (!genresLocal.includes(genre)) {
      genresLocal.push(genre);
    } else {
      i--;
    }

  }

  return genresLocal;
};

const getPath = () => {
  let imageName = movieNames[getRandomNumber(0, movieNames.length - 1)].toLowerCase().split(` `).join(`-`);
  let fileFormat = ``;

  switch (imageName) {
    case `made-for-each-other`:
      fileFormat = `.png`;
      break;

    case `popeye-the-sailor-meets-sindbad-the-sailor`:
      imageName = `popeye-meets-sinbad`;
      fileFormat = `.png`;
      break;

    default:
      fileFormat = `.jpg`;
      break;
  }

  return `${MAIN_IMAGES_PATH}/${ImageTypes.POSTER}/${imageName}${fileFormat}`;
};

const getRandomDate = () => {
  const DATE = new Date();
  return DATE;
};

export const createMovie = () => {
  return {
    name: getMovieName(),
    originalName: getMovieName(),
    director: getRandomElementFromArray(userNames),
    writers: getPeopleList(3),
    actors: getPeopleList(5),
    release: getRandomDate(),
    runtime: getRandomNumber(MIN_DURATION, MAX_DURATION),
    country: getRandomElementFromArray(countries),
    genres: getGenres(),
    description: getDescription(),
    movieRaiting: getRandomElementFromArray(contentRaiting),
    raiting: getRandomDoubleNumber(0, MAX_RAITING),
    path: getPath(),
    isWatchlist: Boolean(getRandomNumber(0, 1)),
    isWatched: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
    comments: generateComments()
  };
};

for (let i = 0; i < MOCKS_COUNT; i++) {
  movieMocks.push(createMovie());
}

export const mocks = movieMocks;
