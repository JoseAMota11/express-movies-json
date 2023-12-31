import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import movies from './movies.json' assert { type: 'json' };
import { idNotFound } from './middleware/index.js';
import {
  validateMovies,
  validatePartialMovies,
} from './schemas/movies.schema.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.disable('x-powered-by');
app.get('/movies/:id', idNotFound);

app.get('/movies', (req, res) => {
  const { genre } = req.query;
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  if (genre) {
    const filteredMovies = movies.filter(({ genre: movieGenre }) =>
      movieGenre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );

    res.json(filteredMovies);
    return;
  }

  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const foundedMovie = movies.find(({ id: movieId }) => movieId === id);
  res.json(foundedMovie);
});

app.post('/movies', (req, res) => {
  const result = validateMovies(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;
  const resultValidation = validatePartialMovies(req.body);
  const movieIndex = movies.findIndex(({ id: movieId }) => movieId === id);

  if (resultValidation.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const newMovie = {
    ...movies[movieIndex],
    ...resultValidation.data,
  };

  movies[movieIndex] = newMovie;
  res.status(201).json(newMovie);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
