import {MIN_DURATION, MAX_DURATION, MAIN_IMAGES_PATH, MOCKS_COUNT, ImageTypes, movieNames, userNames, countries, genres} from "../utils/const.js";
import {getRandomNumber, getRandomDoubleNumber, getRandomElementFromArray, sentences} from "../utils/main.js";
import {generateComments} from "./comments.js";

let movieMocks = [];

const getMovieName = () => {
  return movieNames[getRandomNumber(movieNames.length - 1)];
};

const getPeopleList = (quantity) => {
  let people = [];

  for (let i = 0; i < quantity; i++) {
    people.push(userNames[getRandomNumber(userNames.length - 1)]);
  }

  return people;
};

const getDescription = () => {
  const sentencesCount = getRandomNumber(1, 10);
  let descriptionText = ``;

  for (let i = 0; i < sentencesCount; i++) {
    descriptionText += sentences[getRandomNumber(sentences.length - 1)];
  }

  return descriptionText;
};

const getGenres = () => {
  let genresCount = getRandomNumber(5);
  let genresLocal = [];

  for (let i = 0; i < genresCount; i++) {
    const genre = genres[getRandomNumber(genres.length - 1)];

    if (!genresLocal.includes(genre)) {
      genresLocal.push(genre);
    } else {
      i--;
    }

  }

  return genresLocal;
};

const getPath = () => {
  let imageName = movieNames[getRandomNumber(movieNames.length - 1)].toLowerCase().split(` `).join(`-`);
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
    raiting: getRandomDoubleNumber(),
    path: getPath(),
    isWatchlist: Boolean(getRandomNumber()),
    isWatched: Boolean(getRandomNumber()),
    isFavorite: Boolean(getRandomNumber()),
    comments: generateComments()
  };
};

for (let i = 0; i < MOCKS_COUNT; i++) {
  movieMocks.push(createMovie());
}

export const mocks = movieMocks;
