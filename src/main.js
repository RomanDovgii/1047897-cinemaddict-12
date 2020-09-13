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
import Api from "./api.js";

const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic eogwas90dk19883a`;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let userStatisticsComponent = null;
let filter = null;
let content = null;

let oldMenuItem = MenuItem.CHANGE_FILTER;
let newMenuItem = MenuItem.CHANGE_FILTER;

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    filter = new FilterPresenter(main, moviesModel, filterModel, handleStatsButtonClick);
    content = new MovieList(main, moviesModel, filterModel, filter);

    filter.init();
    content.init();
  })
  .catch(() => {
    console.log(`recieved nothing`);
  });

api.getComments()
  .then((comments) => {
    console.log(comments);
  })
  .catch(() => {
    console.log(`recieved no comments`)
  });

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
      userStatisticsComponent = new StatisticsView(moviesModel);
      render(main, userStatisticsComponent, RenderPosition.BEFOREEND);
      userStatisticsComponent.getChart();
      userStatisticsComponent.setFormChange();
      break;
  }

  oldMenuItem = newMenuItem;
};

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


