const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let similarMovies = null;

// get movie info from ID
async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();

        const posterPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        const title = data.title;
        const description = data.overview;
        const rating = data.vote_average;
        const releaseDate = data.release_date;
        const castResponse = await getMovieCast(movieId);
        const cast = convertActorsToString(castResponse);

        return { posterPath, title, description, rating, releaseDate, cast };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

async function getMovieCast(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
        let data = await response.json();
        const cast = data.cast.map(actor => actor.name);
        return cast.slice(0, 10);
    } catch (error) {
        console.error('Error fetching cast:', error);
        return [];
    }
}

// Function to convert an array of actors to a comma-separated string
function convertActorsToString(actorsArray) {
    return actorsArray.join(', ');
}

// returns an array of similar movies to given id
async function getSimilarMovies(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const similarMovies = data.results.slice(0, 12);
            return similarMovies;
        } else {
            console.log('No similar movies found for the given movie ID.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
}

// Function to generate HTML for a single movie card
async function generateSimilarMovieCardHTML(movie) {
    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const movieRating = movie.vote_average;
    const movieId = movie.id;

    // Generate HTML for a single movie card
    const movieCardHTML = `
            <button class="movie-card select-movie" data-movie-id="${movieId}">
                <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
                <div class="movie-title">${movieTitle}</div>
                <p class="movie-info">
                    <span class="director">Rating: ${Math.round(movieRating * 10) / 10} / 10</span><br />
                    <span class="release-date">Release Date: ${formatDateToEnglish(releaseDate)}</span>
                </p>
            </button>
    `;
    return movieCardHTML;
}

// Function to display similar movies for a given movie ID
async function displaySimilarMovies(movieId) {
    const similarMoviesContainer = document.getElementById('related-movie-cards');

    try {
        const similarMovies = await getSimilarMovies(movieId);
        for (let i = 0; i < similarMovies.length; i++) {
            const movieCardHTML = await generateSimilarMovieCardHTML(similarMovies[i]);
            if (movieCardHTML !== '') {
                similarMoviesContainer.innerHTML += movieCardHTML;
            }
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}


async function generateSelectedMovie(movieId) {
        const movie = await getMovieDetails(movieId);

        const moviePosterUrl = movie.posterPath;
        const movieTitle = movie.title;
        const releaseDate = movie.releaseDate;
        const movieRating = movie.rating;
        const movieDescription = movie.description;
        const movieCast = movie.cast;

        // Generate HTML
        const selectedMovieHTML = `
        <div class="movie" data-movie-id="${movie.id}" data-movie-title="${movieTitle}" data-release-date="${releaseDate}">
            <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
            <div class="movie-info">
                <div id="movie-title">${movieTitle}</div>
                <p>
                    <span class="director">Rating: ${Math.round(movieRating * 10) / 10} / 10<br /></span>
                   <span class="release-date">Release Date: ${formatDateToEnglish(releaseDate)}</span>
                </p>
                <div id="description">Description:</div>
                <p class="description">
                   ${movieDescription}
                </p>
                <div class="cast">Cast:</div>
                <p id="cast">
                    ${movieCast}
                </p>
                <a href="#" id="watch-link">Watch Now</a>
            </div>
        </div>
        `;

        return selectedMovieHTML;
}

function formatDateToEnglish(inputDate) {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1];
    const day = parseInt(dateParts[2], 10);
  
    let daySuffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    }
    const formattedDate = `${month} ${day}${daySuffix}, ${year}`;
    return formattedDate;
}


async function scrapeDopebox(movieTitle, movieDate) {
    const movieName = movieTitle.toLowerCase().replace(/\s+/g, '-');
    const url = `https://dopebox.to/search/${movieName}`;
    const year = movieDate.split('-')[0];
    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
  
    /* 
    try {
      const response = await axios.get(corsAnywhereUrl + url);
      const $ = cheerio.load(response.data);
  
      for (let index = 0; index < $('.flw-item').length; index++) {
        const $flwItem = $('.flw-item').eq(index);
  
        const $filmDetail = $flwItem.find('.film-detail .fd-infor .fdi-item');
  
        if ($filmDetail.eq(0).text() === year) {
          const playButtonLink = $flwItem.find('.fd-btn a').attr('href');
          return playButtonLink;
        }
      }
  
      console.log('Movie not found for the specified date.');
      return null;
    } catch (error) {
      console.error('Error fetching the webpage:', error.message);
      return null;
    }
    */

    return url;
  }
          
async function displaySelectedMovie(movieId) {
    const selectedMovie = document.getElementById('selected-movie-container');
    const selectedMovieHTML = await generateSelectedMovie(movieId);
    selectedMovie.innerHTML = selectedMovieHTML;
}

async function movieInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('query'); // get id from url
    await displaySelectedMovie(movieId);
    await displaySimilarMovies(movieId);
    watchNow();
    attachEventListeners();
}

function attachEventListeners() {
    const movieCards = document.querySelectorAll('.select-movie');
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-movie-id');
            handleMovieSelection(movieId);
        });
    });
}

function watchNow() {
    const watchNowLink = document.getElementById('watch-link');
    watchNowLink.addEventListener('click', async () => {
    const selectedMovie = document.querySelector('.movie');
    const movieTitle = selectedMovie.getAttribute('data-movie-title');
    const releaseDate = selectedMovie.getAttribute('data-release-date');
    
    const playButtonLink = await scrapeDopebox(movieTitle, releaseDate);
    console.log(playButtonLink);
    if (playButtonLink) {
        window.location.href = playButtonLink;
    } else {
        console.log('Error fetching play button link.');
    }
    });
}
        

movieInit();