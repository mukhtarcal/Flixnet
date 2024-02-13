const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let popularMovies = null;
let genreId = 28;


// returns the top 13 most trending movies as a list
async function getTopTrendingMovies() {
    try {
        const response = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const topMovies = data.results.slice(0, 13); // Get the top 6 trending movies
            return topMovies;
        } else {
            console.log('No trending movies found for today.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

// returns the top 13 movies from a specific genre
async function getMoviesFromGenre(genreId) {
    try {
        const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}?include_adult=false`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const moviesFromGenre = data.results.slice(0, 13); // Get the top 6 trending movies
            return moviesFromGenre;
        } else {
            console.log('No movies from this genre found for today.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching genre movies:', error);
        return [];
    }
}



// Gets all the popular movies
// Function to generate HTML for the movie card with fetched data for the 2nd to 7th most popular movies
async function generateMovieCardHTML(movie) {

    const movieId = movie.id;
    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const movieRating = movie.vote_average;

    // Generate HTML for a single movie card
    const movieCardHTML = `
            <button class="movie-card  select-movie" data-movie-id="${movieId}">
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

// Function to display the 2nd to 7th most popular movies with individual links
async function displayPopularMovies() {
    const popularMoviesContainer = document.getElementById('popular-movies-container');

    // Loop to generate and append HTML for each movie card
    for (let i = 1; i <= popularMovies.length - 1; i++) {
        const movieCardHTML = await generateMovieCardHTML(popularMovies[i]);
        if (movieCardHTML !== '') {
            popularMoviesContainer.innerHTML += movieCardHTML;
        }
    }
}

// Function to display the 2nd to 7th most popular movies with individual links
async function displayGenreMovies() {
    const genreMoviesContainer = document.getElementById('genre-movies-container');
    // genreMoviesContainer.scrollTop = 0; 
    genreMoviesContainer.classList.add('fade-in');
    genreMoviesContainer.innerHTML = "";
    genre = await getMoviesFromGenre(genreId);
    // Loop to generate and append HTML for each movie card
    for (let i = 1; i <= genre.length - 1; i++) {
        const movieCardHTML = await generateMovieCardHTML(genre[i]);
        if (movieCardHTML !== '') {
            genreMoviesContainer.innerHTML += movieCardHTML;
        }
    }
    attachEventListeners();
    genreMoviesContainer.style.opacity = 1;
}

// Call the function to display the 2nd to 7th most popular movies with individual links


// Function to generate HTML for the Movie of the Day section with fetched data
async function generateMovieOfTheDayHTML() {
    if (popularMovies.length > 0) {
        const mostPopularMovie =  popularMovies[0]; // Assuming the first movie in the list is the most popular
        
        const moviePosterUrl = mostPopularMovie.poster_path;
        const movieTitle = mostPopularMovie.title;
        const releaseDate = mostPopularMovie.release_date;
        const movieRating = mostPopularMovie.vote_average;
        const movieId = mostPopularMovie.id;

        // Generate HTML
        const movieOfTheDayHTML = `
                <button class="movie-of-the-day select-movie" data-movie-id="${movieId}">
                    <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
                    <div class="movie-info">
                        <div id="movie-of-the-day">Movie of the Day:</div>
                        <div id="movie-title">${movieTitle}</div>
                        <p>
                            <span class="director">Rating: ${Math.round(movieRating * 10) / 10} / 10</span><br />
                            <span class="release-date">Release Date: ${formatDateToEnglish(releaseDate)}</span>
                        </p>
                    </div>
                </button>
        `;
        return movieOfTheDayHTML;
    }
    return '';
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


// Get the generated HTML and append it to a specific element on your page
async function displayMovieOfTheDay() {
    const movieOfTheDayContainer = document.getElementById('movie-of-the-day-container');
    const movieOfTheDayHTML = await generateMovieOfTheDayHTML();
    movieOfTheDayContainer.innerHTML = movieOfTheDayHTML;
}

// Call the function to display Movie of the Day

async function init_homePage() {
    popularMovies = await getTopTrendingMovies();
    await displayGenreMovies();
    await displayPopularMovies();
    await displayMovieOfTheDay();
    attachEventListeners();
}

document.getElementById("action").addEventListener('click', async () => {
    genreId = 28;
    await displayGenreMovies();
})
document.getElementById("comedy").addEventListener('click', async () => {
    genreId = 35;
    await displayGenreMovies();
})
document.getElementById("drama").addEventListener('click', async () => {
    genreId = 18;
    await displayGenreMovies();
})
document.getElementById("romance").addEventListener('click', async () => {
    genreId = 10749;
    await displayGenreMovies();
})
document.getElementById("adventure").addEventListener('click', async () => {
    genreId = 12;
    await displayGenreMovies();
})
document.getElementById("mystery").addEventListener('click', async () => {
    genreId = 9648;
    await displayGenreMovies();
})


// everything to do with the genre bar animation
document.addEventListener("DOMContentLoaded", function () {
    // Get all genre buttons and the animation element
    const genreButtons = document.querySelectorAll(".genre-bar button");
    const animation = document.querySelector(".animation");
  
    // Add click event listener to each genre button
    genreButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove the "active" class from all buttons
        genreButtons.forEach((btn) => btn.classList.remove("active"));
  
        // Add the "active" class to the clicked button
        button.classList.add("active");
  
        // Get the index of the clicked button and calculate the left position for the animation
        const index = Array.from(genreButtons).indexOf(button);
        const leftPosition = index * (100 / genreButtons.length);
  
        // Apply the width and left position to the animation
        animation.style.width = "16.66%";
        animation.style.left = leftPosition + "%";
      });
  
      // Add hover event listener to each genre button
      button.addEventListener("mouseenter", function () {
        // Get the index of the hovered button and calculate the left position for the animation
        const index = Array.from(genreButtons).indexOf(button);
        const leftPosition = index * (100 / genreButtons.length);
  
        // Apply the width and left position to the animation on hover
        animation.style.width = "16.66%";
        animation.style.left = leftPosition + "%";
      });

      button.addEventListener("mouseleave", function () {
        // Check if there is an active button
        const activeButton = document.querySelector(".genre-bar button.active");
      
        if (activeButton) {
          // Update the animation based on the active button
          const index = Array.from(genreButtons).indexOf(activeButton);
          const leftPosition = index * (100 / genreButtons.length);
          animation.style.width = "16.66%";
          animation.style.left = leftPosition + "%";
        } else {
            // If there is no active button, return the animation to the first button
            animation.style.width = "16.66%";
            animation.style.left = "0";
        }
      });
    });
  });

function attachEventListeners() {
    const movieCards = document.querySelectorAll('.select-movie');
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-movie-id');
            handleMovieSelection(movieId);
        });
    });
}

init_homePage();