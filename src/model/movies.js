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
    const filmInfo = movie.film_info;
    const userDetails = movie.user_details;

    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          actors: filmInfo.actors,
          rating: filmInfo.age_rating,
          originalName: filmInfo.alternative_title,
          description: filmInfo.description,
          director: filmInfo.director,
          genres: filmInfo.genre,
          path: filmInfo.poster,
          release: filmInfo.release.date,
          country: filmInfo.release.release_country,
          runtime: filmInfo.runtime,
          name: filmInfo.title,
          movieRating: filmInfo.total_rating,
          writers: filmInfo.writers,
          isWatched: userDetails.already_watched,
          isFavorite: userDetails.favorite,
          isWatchlist: userDetails.watchlist,
          watchedDate: userDetails.watching_date,
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

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
            "runtime": movie.runtime,
            "title": movie.name,
            "total_rating": movie.movieRating,
            "writers": movie.writers,
            "release": {
              "date": movie.release,
              "release_country": movie.country
            }
          },
          "user_details": {
            "already_watched": movie.isWatched,
            "favorite": movie.isFavorite,
            "watchlist": movie.isWatchlist,
            "watching_date": movie.watchedDate,
          },
          "id": movie.id,
          "comments": movie.comments.reduce((accumulator, element) => {
            accumulator.push(element);
            return accumulator;
          }, []),
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
    delete adaptedMovie.release;
    delete adaptedMovie.country;

    return adaptedMovie;
  }
}
