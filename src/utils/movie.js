export const isInList = (type) => {
  return Object.values(type).some(Boolean);
};

export const isInWatchlist = (watchlist) => {
  return Object.values(watchlist).some(Boolean);
};

export const isInHistory = (history) => {
  return Object.values(history).some(Boolean);
};

export const isInFavorites = (favorites) => {
  return Object.values(favorites).some(Boolean);
};
