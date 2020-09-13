import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();

    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update non-existent movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          actors: movie.film_info.actors,
          rating: movie.film_info.age_rating,
          originalName: movie.film_info.alternative_title,
          description: movie.film_info.description,
          director: movie.film_info.director,
          genres: movie.film_info.genre,
          path: movie.film_info.poster,
          release: movie.film_info.release,
          runtime: movie.film_info.runtime,
          name: movie.film_info.title,
          movieRating: movie.film_info.total_rating,
          writers: movie.film_info.writers,
          id: movie.id,
          isWatched: movie.user_details.already_watched,
          isFavorite: movie.user_details.favorite,
          isWatchlist: movie.user_details.watchlist,
          watchedDate: movie.user_details.watching_date,
          comments: movie.comments
        }
    );

    return adaptedMovie;
  }
}
