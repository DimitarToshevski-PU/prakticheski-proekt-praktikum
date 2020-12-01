const API_KEY = '08b1ca0383a4440da82df7eea37f3691';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const moviesUrl = `https://api.themoviedb.org/3/discover/movie?year=2019&api_key=${API_KEY}`;

$(document).ready(function () {
  getDataByUrl(genresUrl, (response) => {
    console.log(response.genres);
  });

  getDataByUrl(moviesUrl, (response) => {
    appendMovies(response.results);
  });
});

function appendMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');

    movieCard.classList.add(
      'col-12',
      'col-sm-6',
      'col-lg-4',
      'col-xl-3',
      'pb-4'
    );

    movieCard.innerHTML = createMovieCard(movie);

    moviesContainer.append(movieCard);
  });
}

function createMovieCard(movie) {
  return `
        <div class="card justify-content-center align-items-center">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" class="card-img-top" alt="..." />
          <div class="card-body">
            <span class="badge badge-pill badge-warning initial-view">Raiting: ${movie.vote_average}</span>
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text detail-view">
              ${movie.overview}
            </p>
          </div>
        </div>`;
}

function getDataByUrl(url, cb) {
  $.ajax({
    url: url,
    success: cb,
  });
}
