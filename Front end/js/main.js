$(document).ready(function () {
  const moviesContainer = document.getElementById('movies-container');
  $.ajax({
    url:
      'https://api.themoviedb.org/3/discover/movie?year=2019&api_key=08b1ca0383a4440da82df7eea37f3691',
    success: function (result) {
      console.log(result.results);

      result.results.forEach((movie) => {
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
    },
  });
});

function createMovieCard(movie) {
  return `
        <div class="card justify-content-center align-items-center">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" class="card-img-top" alt="..." />
          <div class="card-body">
            <span class="badge badge-pill badge-warning">Raiting: ${movie.vote_average}</span>
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text detail-view">
              ${movie.overview}
            </p>
          </div>
        </div>`;
}
