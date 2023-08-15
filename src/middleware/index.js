import movies from '../movies.json' assert { type: 'json' };

export const idNotFound = (req, res, next) => {
  const { id } = req.params;
  const searchId = movies.some(({ id: movieId }) => movieId === id);

  if (searchId) {
    next();
    return;
  }

  res.status(404).json({ message: `There is no movie with id '${id}'` });
};
