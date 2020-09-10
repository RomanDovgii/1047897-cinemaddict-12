import Abstract from "./abstract.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {createElement} from "../utils/main.js";
import moment from "moment";
import { replace } from "../utils/render.js";

const createCharts = (genresAndCount) => {
  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`);

  const genres = [];
  const count = [];

  genresAndCount.forEach(
      (element) => {
        genres.push(element.name);
        count.push(element.count);
      }
  );

  statisticCtx.height = BAR_HEIGHT * genresAndCount.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...genres],
      datasets: [{
        data: [...count],
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createUserFormTemplate = () => {
  return `
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>`;
};

const createUserStatisticsTemplate = (totalMovies, totalDuration, topGenre) => {
  const time = moment.utc().add({minutes: totalDuration});

  return `
  <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${totalMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${time.format(`h[<span class="statistic__item-description">h</span>] mm[<span class="statistic__item-description">m</span>]`)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    `;
};

const createUserChartTemplate = () => {
  return `
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  `;
};

const createUserStatisticsPageTemplate = (totalMovies, totalDuration, topGenre) => {
  return `
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    ${createUserFormTemplate()}
    ${createUserStatisticsTemplate(totalMovies, totalDuration, topGenre)}
    ${createUserChartTemplate()}

  </section>`;
};

export default class UserStatistics extends Abstract {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched);
    this._handleFormChange = this._handleFormChange.bind(this);
  }

  getTemplate() {
    this.filterMovies();
    return createUserStatisticsPageTemplate(this._moviesWatched, this._duration, this._topGenre);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getChart() {
    createCharts(this._genresAndCount);
  }

  filterMovies() {
    this._moviesWatched = this._movies.length;
    this._duration = this._movies.reduce((accumulator, element) => accumulator + element.runtime, 0);

    // console.log(this._duration);
    // problem with moment

    this._genresAll = [];
    this._genresAndCount = [];

    this._movies.map((element) => {
      element.genres.map(
          (genre) => {
            this._genresAll.push(genre);
          }
      );
    });

    this._genresAll.forEach(
        (element) => {
          if (this._genresAll.includes(element)) {
            const elementObject = {
              name: element,
              count: this._genresAll.slice().filter((genre) => genre === element).length
            };

            this._genresAndCount.push(elementObject);

            this._genresAll = this._genresAll.filter((genre) => genre !== element);
          }
        }
    );

    this._genresAndCount.sort((a, b) => b.count - a.count);
    this._topGenre = this._genresAndCount[0].name;
  }

  _handleFormChange() {
    const now = moment().startOf(`day`);
    const week = now.clone().subtract(7, `days`).startOf(`day`);
    const month = now.clone().subtract(1, `months`).startOf(`day`);
    const year = now.clone().subtract(1, `years`).startOf(`day`);

    console.log(now);
    console.log(week);
    console.log(month);
    console.log(year);

    Array.from(this.getElement().querySelectorAll(`.statistic__filters-input`)).forEach(
        (element) => {
          if (element.checked) {
            switch (element.id) {
              case `statistic-today`:
                this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched).sort((movie) => moment(movie.watchedDate).isAfter(now, `day`));
                break;
              case `statistic-week`:
                this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched).sort((movie) => moment(movie.watchedDate).isAfter(week, `week`));
                break;
              case `statistic-month`:
                this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched).sort((movie) => moment(movie.watchedDate).isAfter(month, `month`));
                break;
              case `statistic-year`:
                this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched).sort((movie) => moment(movie.watchedDate).isAfter(year, `year`));
                break;
              case `statistic-all-time`:
                this._movies = this._moviesModel.getMovies().filter((movie) => movie.isWatched);
                break;
              default:
                throw new Error(`Unknown filter type`);
            }
          }
        }
    );

    this.filterMovies();

    const oldStats = this.getElement().querySelector(`.statistic__text-list`);
    const newStats = createElement(createUserStatisticsTemplate(this._moviesWatched, this._duration, this._topGenre));

    const oldChart = this.getElement().querySelector(`.statistic__chart-wrap`);
    const newChart = createElement(createUserChartTemplate);

    replace(newStats, oldStats);
    replace(newChart, oldChart);
    this.getChart();
  }

  setFormChange(callback) {
    this._callback.statusButtonClick = callback;
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._handleFormChange);
  }
}
