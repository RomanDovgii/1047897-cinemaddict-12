export const CARD_COUNT_MAIN = 5;
export const CARD_COUNT_EXTRA = 2;
export const MOCKS_COUNT = 40;
export const MAX_RAITING = 10;
export const MAX_GENRES = 5;
export const MIN_DURATION = 30;
export const MAX_DURATION = 360;
export const MIN_SENTENCES = 1;
export const MAX_SENTENCES = 10;
export const MAX_COMMENTS = 9;
export const MAX_DESCRIPTION_LENGTH_WITH_ELLIPSIS = 139;
export const MAX_DESCRIPTION_LENGTH = 140;
export const MINUTES_IN_HOUR = 60;

export const MAIN_IMAGES_PATH = `./images`;
export const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
export const AUTHORIZATION = `Basic eogwas90dk19883a`;

export const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

export const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export const ChangeType = {
  CONTROL: `control`,
  COMMENT: `comment`
};

export const MenuItem = {
  CHANGE_FILTER: `CHANGE_FILTER`,
  STATS: `STATS`
};

export const FilterType = {
  ALL: `ALL`,
  WATCHLIST: `WATCHLIST`,
  HISTORY: `HISTORY`,
  FAVORITES: `FAVORITES`
};

export const UserAction = {
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
  UPDATE_MOVIE: `UPDATE_MOVIE`,
  POPUP_CHANGE: `POPUP_CHANGE`,
  CARD_CHANGE: `CARD_CHANGE`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const ImageType = {
  POSTER: `posters`,
  ICON: `icons`,
  EMOJI: `emoji`
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const MovieContainer = {
  ALL: {
    elementClass: `films-list`,
    heading: `All movies. Upcoming`,
    visuallyHidden: true
  },
  TOP: {
    elementClass: `films-list--extra films-list--top`,
    heading: `Top rated`,
    visuallyHidden: false
  },
  COMMENTED: {
    elementClass: `films-list--extra films-list--commented`,
    heading: `Most commented`,
    visuallyHidden: false
  },
  EMPTY: {
    elementClass: `films-list`,
    heading: ``,
    visuallyHidden: true
  },
};

export const UserRank = {
  NO_RANK: {
    maximunMovies: 0,
    name: ``
  },
  NOVICE: {
    maximunMovies: 10,
    name: `novice`
  },
  FAN: {
    maximunMovies: 20,
    name: `fan`
  },
  MOVIE_BUFF: {
    name: `movie buff`
  }
};

export const SortType = {
  DEFAULT: `default`,
  RAITING: `raiting`,
  DATE: `date`
};
