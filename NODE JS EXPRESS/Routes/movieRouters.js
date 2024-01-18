const express = require('express');
const movieController = require('./../Controllers/movieController');
const router = express.Router();

router.route('/highest-rated').get(movieController.getHighestRated, movieController.getAllMovies)
router.route('/highest-price').get(movieController.getHighestPrice, movieController.getAllMovies)
router.route('/movie-stats').get(movieController.getMovieStats);
router.route('/movies-by-genre/:genre').get(movieController.getMovieByGenre);
router.route('/')
.get(movieController.getAllMovies)
.post(movieController.createMovie)

router.route('/:id')
.get(movieController.getMovie)
.patch(movieController.updateMovie)
.delete(movieController.deleteMovie)

module.exports = router;