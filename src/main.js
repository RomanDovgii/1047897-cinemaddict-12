import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition} from "./utils/const";
import {render} from "./utils/render.js";
import {mocks} from "./mocks/movie.js";
import MovieList from "./presenter/movie-list.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filters.js";
import UserStatisticsPresenter from "./presenter/user-statistics.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(mocks);

const filterModel = new FilterModel();

let userStatsOpen = false;
let UserStatistics;
let content;

const test = () =>{
  console.log(`test`);
};

const handleStatsButtonClick = () => {
  switch (userStatsOpen) {
    case true:
      UserStatistics.destroy();
      UserStatistics = null;
      content = new MovieList(main, moviesModel, filterModel, filter);
      content.init();
      userStatsOpen = false;
      break;
    case false:
      UserStatistics = new UserStatisticsPresenter(main);
      UserStatistics.init();
      content.destroy();
      content = null;
      userStatsOpen = true;
      break;
    default:
      break;
  }
};

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

<<<<<<< HEAD

const filter = new FilterPresenter(main, filterModel, moviesModel);
content = new MovieList(main, moviesModel, filterModel, filter);

filter.init();
=======
const content = new MovieList(main, moviesModel, filterModel);

>>>>>>> parent of 6adbca1... User statistics added
content.init();

filter.setStatsButtonClick(handleStatsButtonClick);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


