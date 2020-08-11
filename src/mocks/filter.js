const mocksToFilter = {
  all: (movies) => movies.length,
  watchlist: (movies) => movies
    .filter((movie) => movie.isWatchlist).length,
  history: (movies) => movies
    .filter((movie) => movie.isWatched).length,
  favorites: (movies) => movies
    .filter((movie) => movie.isFavorite).length
};


export const createFilters = (movies) => {
  return Object.entries(mocksToFilter).map(([filterName, countTasks]) => {
    return {
      title: filterName,
      count: countTasks(movies),
    };
  });
};


