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
export const MAX_STRING_LENGTH = 139;
export const MINUTES_IN_HOUR = 60;

export const MAIN_IMAGES_PATH = `./images`;
export const JPG_EXTENSION = `.jpg`;
export const PNG_EXTENSION = `.png`;
export const POPEY_MEETS_SINDBAD_NAME = `popeye-meets-sinbad`;
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

export const ImageTypes = {
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

export const MovieContainers = {
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

export const SortType = {
  DEFAULT: `default`,
  RAITING: `raiting`,
  DATE: `date`
};

export const FISH_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const MOVIE_NAMES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The great Flamarion`,
  `Made for Each Other`
];

export const GENRES = [
  `Absurdic`,
  `Surreal`,
  `Whimiscal`,
  `Action`,
  `Adventure`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Fantasy`,
  `Historical`,
  `Historical fiction`,
  `Horror`,
  `Magical realism`,
  `Mystery`,
  `Paranoid fiction`,
  `Philosophical`,
  `Political`,
  `Romance`,
  `Saga`,
  `Satire`,
  `Science fiction`,
  `Social`,
  `Speculative`,
  `Thriller`,
  `Urban`,
  `Western`
];

export const USER_NAMES = [
  `Egor Dmitriev`,
  `Nicko Belick`,
  `Roman Belick`,
  `Dmitii Rogozin`,
  `Evgeniy Royzman`,
  `Evgenii Batkovich`
];

export const CONTENT_RAITING = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

export const COUNTRIES = [
  `USA`,
  `Canada`,
  `Mexico`,
  `Poland`,
  `Serbia`,
  `France`,
  `UK`,
  `USSR`,
  `Japan`,
  `Finland`,
  `Columbia`
];

export const EMOJI_DESCRIPTION = [
  `emoji-smile`,
  `emoji-sleeping`,
  `emoji-puke`,
  `emoji-angry`
];
