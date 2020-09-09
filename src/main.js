import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition, MenuItem} from "./utils/const.js";
import {render, remove} from "./utils/render.js";
import {mocks} from "./mocks/movie.js";
import MovieList from "./presenter/movie-list.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filters.js";
import StatisticsView from "./view/user-statistics.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let userStatisticsComponent = null;
let filter = null;
let content = null;

let oldMenuItem = MenuItem.CHANGE_FILTER;
let newMenuItem = MenuItem.CHANGE_FILTER;

const moviesModel = new MoviesModel();
moviesModel.setMovies(mocks);

const filterModel = new FilterModel();

const handleStatsButtonClick = (menuItem) => {
  newMenuItem = menuItem;

  if (oldMenuItem === newMenuItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.CHANGE_FILTER:
      content.destroy();

      content = new MovieList(main, moviesModel, filterModel, filter);

      filter.init();
      content.init();
      remove(userStatisticsComponent);
      break;
    case MenuItem.STATS:
      content.destroy();
      filter.init();
      userStatisticsComponent = new StatisticsView();
      render(main, userStatisticsComponent, RenderPosition.BEFOREEND);
      // content = null;
      break;
  }

  oldMenuItem = newMenuItem;
};

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

filter = new FilterPresenter(main, moviesModel, filterModel, handleStatsButtonClick);
content = new MovieList(main, moviesModel, filterModel, filter);

filter.init();
content.init();

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


