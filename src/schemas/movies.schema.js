import z from 'zod';

const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string.',
    required_error: 'Title is required.',
  }),
  year: z.number().int().min(1900).max(2023),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'Poster must be a valid URL.',
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Drama',
      'Biography',
      'Fantasy',
      'Romance',
      'Sci-Fi',
      'Animation',
      'Crime',
    ])
  ),
  rate: z.number().min(0).max(10).default(0),
});

export const validateMovies = (obj) => moviesSchema.safeParse(obj);

export const validatePartialMovies = (obj) =>
  moviesSchema.partial().safeParse(obj);
