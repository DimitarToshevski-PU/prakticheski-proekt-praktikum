const API_KEY = '08b1ca0383a4440da82df7eea37f3691';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
let genres = {};

$(document).ready(function () {
  getDataByUrl(genresUrl, (response) => {
    response.genres.forEach((genre) => {
      genres[genre.id] = genre.name;
    });

    appendGenres(response.genres);

    getDataByUrl(moviesUrl, (response) => {
      appendMovies(response.results);
    });
  });

  $('#initial-view').on('click', () => {
    updateView('#initial-view');
  });

  $('#detail-view').on('click', () => {
    updateView('#detail-view');
  });

  $('#filters-submit').on('click', () => {
    filterMovies();
  });
});

function appendMovies(movies) {
  const moviesContainer = $('#movies-container');
  moviesContainer.empty();

  movies.forEach((movie) => {
    moviesContainer.append(createMovieCard(movie));
  });
}

function appendGenres(genres) {
  const genresContainer = $('#genres-container');

  genres.forEach((genre) => {
    genresContainer.append(createGenreCheckbox(genre));
  });
}

function createGenreCheckbox(genre) {
  return `
        <div class="checkbox">
          <label>
            <input type="checkbox" name="with_genres" value="${genre.id}" />
            <span class="ml-1">${genre.name}</span>
          </label>
        </div>
    `;
}

function createMovieCard(movie) {
  const movieGenres = movie.genre_ids.map((id) => genres[id]);

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 pb-4">
        <div class="card justify-content-center align-items-center">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" class="card-img-top" alt="..." />
          <div class="card-body">
            <div class="d-flex justify-content-between">
                <span class="badge badge-pill badge-warning initial-view">Raiting: ${movie.vote_average}</span>
                <span class="badge badge-pill badge-warning initial-view">Date: ${movie.release_date}</span>
            </div>
            <div>
                <span class="badge badge-pill badge-primary initial-view">${movieGenres}</span>
            </div>
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text detail-view">
              ${movie.overview}
            </p>
          </div>
        </div>
    </div>`;
}

function getDataByUrl(url, cb) {
  $.ajax({
    url: url,
    success: cb,
  });
}

function filterMovies() {
  const filters = $('#filters-form').serialize();
  getDataByUrl(moviesUrl + '&' + filters, (response) => {
    appendMovies(response.results);
  });
}

function updateView(viewId) {
  $(viewId).siblings('li').children('a').removeClass('active');
  $(viewId + ' a').addClass('nav-link active');
}
