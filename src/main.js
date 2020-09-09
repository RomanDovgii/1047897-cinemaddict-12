import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition} from "./utils/const";
import {render} from "./utils/render.js";
import {mocks} from "./mocks/movie.js";
import MovieList from "./presenter/movie-list.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filters.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let userStatisticsComponent = null;

const moviesModel = new MoviesModel();
moviesModel.setMovies(mocks);

const filterModel = new FilterModel();

// const handleStatsButtonClick = (menuItem) => {
//   switch (menuItem){
//     case statsButton:
//       break;
//     default:
//   }
// };

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

const filter = new FilterPresenter(main, moviesModel, filterModel);
const content = new MovieList(main, moviesModel, filterModel, filter);

filter.init();
content.init();

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


