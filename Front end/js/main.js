const API_KEY = '08b1ca0383a4440da82df7eea37f3691';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;

let genres = {};
let chosenViewId;

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

  setupEventListeners();
});

function appendGenres(genres) {
  const genresContainer = $('#genres-container');

  genres.forEach((genre) => {
    genresContainer.append(createGenreCheckbox(genre));
  });
}

function appendMovies(movies) {
  const moviesContainer = $('#movies-container');

  moviesContainer.empty();

  if (movies.length) {
    movies.forEach((movie) => {
      moviesContainer.append(createMovieCard(movie));
    });
  } else {
    moviesContainer.text('No movies have been found for the current filters.');
  }
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
    <div class="col-12 col-sm-6 col-lg-4 pb-4">
        <div class="card justify-content-center align-items-center h-100">
          <img src="${
            movie.poster_path
              ? 'https://image.tmdb.org/t/p/w200' + movie.poster_path
              : './images/no-cover.png'
          }" class="card-img-top" alt="no image found" />
          <div class="card-body w-100 h-100">
            <div class="d-flex justify-content-between badge-holder">
                <span class="badge badge-pill badge-warning">Raiting: ${
                  movie.vote_average
                }</span>
                <span class="badge badge-pill badge-warning">Date: ${
                  movie.release_date
                }</span>
            </div>
            <span class="badge badge-pill badge-primary d-none d-sm-inline-block">${movieGenres}</span>
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
    error: (err) => {
      alert(err.responseJSON.status_message);
    },
  });
}

function filterMovies() {
  // If there are multiple filters, leave the first key "with_genres" and replace
  // the &with_genres with just commas so that it is represented as a single key with multiple values
  // ex. with_genres=1&with_genres=2 => with_genres=1,2
  const filters = $('#filters-form')
    .serialize()
    .replaceAll(/&with_genres=/g, ',');

  getDataByUrl(moviesUrl + '&' + filters, (response) => {
    appendMovies(response.results);
    updateView(chosenViewId);
  });
}

function setupEventListeners() {
  $('#initial-view').on('click', () => {
    updateView('#initial-view');
  });

  $('#detail-view').on('click', () => {
    updateView('#detail-view');
  });

  $('#filters-submit').on('click', filterMovies);
}

function updateView(viewId) {
  chosenViewId = viewId;

  $(viewId).siblings('li').children('a').removeClass('active');
  $(viewId + ' a').addClass('nav-link active');

  if (viewId === '#initial-view') {
    $('.card').removeClass('flex-lg-row');
    $('.card-body').removeClass('mt-3 mt-lg-0');
    $('.detail-view').css({ display: 'none' });
    $('.badge-holder').css({ left: '0' });
    $('.card-img-top').css({ width: '100%', 'margin-left': '0' });
  } else {
    $('.card').addClass('flex-lg-row');
    $('.card-body').addClass('mt-3 mt-lg-0');
    $('.detail-view').css({ display: 'flex' });
    $('.badge-holder').css({ left: '-120px' });
    $('.card-img-top').css({ width: '100px', 'margin-left': '20px' });
  }
}
