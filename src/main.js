import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition} from "./utils/const";
import {render} from "./utils/render.js";
import {mocks} from "./mocks/movie.js";
import MovieList from "./presenter/movie-list.js";
import MoviesModel from "./model/movies.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(mocks);

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

const content = new MovieList(main, moviesModel);

content.init();

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


