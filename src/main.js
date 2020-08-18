import UserRank from "./view/user-rank.js";
import Statistics from "./view/statistics.js";
import {RenderPosition} from "./utils/const";
import {render} from "./utils/render.js";
import {mocks} from "./mocks/movie.js";
import MovieList from "./presenter/movie-list.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

const content = new MovieList(main);

content.init(mocks);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);


