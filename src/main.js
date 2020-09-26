import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition, MenuItem, END_POINT, AUTHORIZATION} from "./utils/const.js";
import {render, remove} from "./utils/render.js";
import MovieList from "./presenter/movie-list.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filters.js";
import StatisticsView from "./view/user-statistics.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_COMMENTS_PREFIX = `cinemaddict-localstorage-comments`;
const STORE_VERSION = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;
const STORE_NAME_COMMENTS = `${STORE_COMMENTS_PREFIX}-${STORE_VERSION}`;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const api = new Api(END_POINT, AUTHORIZATION);
const moviesStore = new Store(STORE_NAME, window.localStorage);
const commentsStore = new Store(STORE_NAME_COMMENTS, window.localStorage);
const apiWithProvider = new Provider(api, moviesStore, commentsStore);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const userRank = new UserRank();

let userStatisticsComponent = null;
let filter = null;
let content = null;
let firstLoad = true;

let oldMenuItem = MenuItem.CHANGE_FILTER;
let newMenuItem = MenuItem.CHANGE_FILTER;

const handleStatsButtonClick = (menuItem) => {
  newMenuItem = menuItem;

  if (oldMenuItem === newMenuItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.CHANGE_FILTER:
      content.destroy();

      content = new MovieList(main, moviesModel, filterModel, filter, apiWithProvider, moviesStore, commentsStore);

      filter.init();
      content.init();
      remove(userStatisticsComponent);
      break;
    case MenuItem.STATS:
      content.destroy();
      filter.init();
      userStatisticsComponent = new StatisticsView(moviesModel);
      render(main, userStatisticsComponent, RenderPosition.BEFOREEND);
      userStatisticsComponent.getChart();
      userStatisticsComponent.setFormChange();
      break;
  }

  oldMenuItem = newMenuItem;
};

render(header, userRank.getElement(), RenderPosition.BEFOREEND);
filter = new FilterPresenter(main, moviesModel, filterModel, handleStatsButtonClick);
content = new MovieList(main, moviesModel, filterModel, filter, apiWithProvider, moviesStore, commentsStore, firstLoad);
filter.init();
content.init();

const footerStats = footer.querySelector(`.footer__statistics`);

let moviesLocal = [];

apiWithProvider.getMovies()
  .then((movies) => {
    moviesLocal = movies;

    return movies;
  })
  .then(() => {
    const commentsLocal = {};

    const moviesLocalForStore = moviesLocal.slice().map(MoviesModel.adaptToServer);

    moviesLocalForStore.map((movie) => {
      api.getComments(movie.id).then((comments) => {
        commentsLocal[movie.id] = comments;
        return commentsLocal;
      }).then((comments) => {
        commentsStore.setItems(comments);
      });
    });

    moviesStore.setItems(moviesLocalForStore);
    moviesModel.setMovies(moviesLocal);
    render(footerStats, new Statistics(moviesLocal).getElement(), RenderPosition.BEFOREEND);

    content.init();
    content.removeLoadingFilms();
  })
  .catch(() => {
    moviesModel.setMovies([]);
    render(footerStats, new Statistics(moviesModel.getMovies()).getElement(), RenderPosition.BEFOREEND);

    filter.init();
    content.init();
    content.removeLoadingFilms();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {
    }).catch(() => {
      throw new Error(`service worker doesn't work`);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
