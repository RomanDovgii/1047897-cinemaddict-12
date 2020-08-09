import {createFilters} from "../mocks/filter.js";
import {mocks} from "../mocks/movie.js";

const generateFilterMarkup = (filter, isChecked) => {
  const checked = isChecked ? `main-navigation__item--active` : ``;
  const count = filter.count !== 0 && filter.title !== `all` ? `<span class="main-navigation__item-count"> ${filter.count}</span></a>` : ``;
  const filterName = filter.title;
  let name = filterName === `all` ? `All movies` : `${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`;

  return `<a href="#${filterName}" class="main-navigation__item ${checked}">${name}${count}</a>`;
};

const generateFilterBlock = () => {
  const filters = createFilters(mocks);
  return filters.reduce((accumulator, filter) => accumulator + generateFilterMarkup(filter, filter.title === `all` ? true : false), ``);
};

export const generateMenu = () => {

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${generateFilterBlock()}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  `;
};
