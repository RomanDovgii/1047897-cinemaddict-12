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

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let userStatisticsComponent = null;
let filter = null;
let content = null;

let oldMenuItem = MenuItem.CHANGE_FILTER;
let newMenuItem = MenuItem.CHANGE_FILTER;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VERSION = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const userRank = new UserRank();

render(header, userRank.getElement(), RenderPosition.BEFOREEND);
const handleStatsButtonClick = (menuItem) => {
  newMenuItem = menuItem;

  if (oldMenuItem === newMenuItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.CHANGE_FILTER:
      content.destroy();

      content = new MovieList(main, moviesModel, filterModel, filter, api);

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

const footerStats = footer.querySelector(`.footer__statistics`);

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    filter = new FilterPresenter(main, moviesModel, filterModel, handleStatsButtonClick);
    content = new MovieList(main, moviesModel, filterModel, filter, apiWithProvider);
    render(footerStats, new Statistics(movies).getElement(), RenderPosition.BEFOREEND);

    filter.init();
    content.init();
  })
  .catch(() => {
    moviesModel.setMovies([]);
    filter = new FilterPresenter(main, moviesModel, filterModel, handleStatsButtonClick);
    content = new MovieList(main, moviesModel, filterModel, filter, apiWithProvider);
    render(footerStats, new Statistics(moviesModel.getMovies()).getElement(), RenderPosition.BEFOREEND);

    filter.init();
    content.init();
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
