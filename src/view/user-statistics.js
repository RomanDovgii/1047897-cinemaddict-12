import Abstract from "./abstract.js";
// import Chart from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import {createElement} from "../utils/main.js";
import moment from "moment";

// const BAR_HEIGHT = 50;
// const statisticCtx = document.querySelector(`.statistic__chart`);

// Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
// statisticCtx.height = BAR_HEIGHT * 5;

// const myChart = new Chart(statisticCtx, {
//   plugins: [ChartDataLabels],
//   type: `horizontalBar`,
//   data: {
//     labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
//     datasets: [{
//       data: [11, 8, 7, 4, 3],
//       backgroundColor: `#ffe800`,
//       hoverBackgroundColor: `#ffe800`,
//       anchor: `start`
//     }]
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 20
//         },
//         color: `#ffffff`,
//         anchor: `start`,
//         align: `start`,
//         offset: 40,
//       }
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: `#ffffff`,
//           padding: 100,
//           fontSize: 20
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         barThickness: 24
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//       }],
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: false
//     }
//   }
// });

const createUserStatisticsTemplate = (totalMovies, totalDuration, topGenre) => {
  const time = moment.utc().startOf(`day`).add({minutes: totalDuration});

  return `
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

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
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${totalMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${time.format(`H[<span class="statistic__item-description">h</span>] M[<span class="statistic__item-description">m</span>]`)}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class UserStatistics extends Abstract {
  constructor(moviesModel) {
    super();
    this._movies = moviesModel.getMovies();
  }
  getTemplate() {
    this.filterMovies();
    return createUserStatisticsTemplate(this._moviesWatched, this._duration, this._topGenre);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  filterMovies() {
    this._movies = this._movies.filter((movie) => movie.isWatched);
    this._moviesWatched = this._movies.length;
    this._duration = this._movies.reduce((accumulator, element) => accumulator + element.runtime, 0);

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
}
