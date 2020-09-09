import UserStatisticsView from "../view/user-statistics.js";
import {RenderPosition} from "../utils/const.js";
import {render, replace, remove} from "../utils/render.js";

export default class UserStatistics {
  constructor(userStatisticsContainer) {
    this._container = userStatisticsContainer;
  }

  init() {
    const oldUserStatisticsComponent = this._UserStatistics;
    this._userStatisticsComponent = new UserStatisticsView();

    if (!oldUserStatisticsComponent) {
      render(this._container, this._userStatisticsComponent.getElement(), RenderPosition.BEFOREEND);
      this.setStatsButtonClickHandler();
      return;
    }

    replace(this._userStatisticsComponent, oldUserStatisticsComponent);
    this.setStatsButtonClickHandler();
    remove(oldUserStatisticsComponent);
  }

  destroy() {
    this._container.querySelector(`.statistic`).remove();
  }

  _handleStatsButtonClick() {
  }

  setStatsButtonClickHandler() {
  }
}
