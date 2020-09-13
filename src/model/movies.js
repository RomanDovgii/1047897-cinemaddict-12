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
          isWatched: movie.user_details.already_watched,
          isFavorite: movie.user_details.favorite,
          isWatchlist: movie.user_details.watchlist,
          watchedDate: movie.user_details.watching_date,
        }
    );

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          "film_info": {
            "actors": movie.actors,
            "age_rating": movie.rating,
            "alternative_title": movie.originalName,
            "description": movie.description,
            "director": movie.director,
            "genre": movie.genres,
            "poster": movie.path,
            "release": movie.release,
            "runtime": movie.runtime,
            "title": movie.name,
            "total_rating": movie.movieRating,
            "writers": movie.writers,
          },
          "user_details": {
            "already_watched": movie.isWatched,
            "favorite": movie.isFavorite,
            "watchlist": movie.isWatchlist,
            "watching_date": movie.watchedDate,
          },
          "id": movie.id,
          "comments": movie.comments.reduce((accumulator, element) => accumulator.push(element.id), []),
        }
    );

    delete adaptedMovie.actors;
    delete adaptedMovie.rating;
    delete adaptedMovie.originalName;
    delete adaptedMovie.description;
    delete adaptedMovie.director;
    delete adaptedMovie.genres;
    delete adaptedMovie.path;
    delete adaptedMovie.release;
    delete adaptedMovie.runtime;
    delete adaptedMovie.name;
    delete adaptedMovie.movieRating;
    delete adaptedMovie.writers;
    delete adaptedMovie.isWatched;
    delete adaptedMovie.isFavorite;
    delete adaptedMovie.isWatchlist;
    delete adaptedMovie.watchedDate;

    return adaptedMovie;
  }
}
