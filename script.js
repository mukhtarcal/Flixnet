// everything for search

async function search() {
    const searchText = document.getElementById('search-text').value.trim();

    if (searchText !== '') {
        // Constructing the URL with search query parameters
        const paramsString = `?query=${encodeURIComponent(searchText)}`;
        const newUrl = `/search/index.html${paramsString}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    } else {
        // Handle empty search text or provide a default behavior
    }
}

// Event listener for search button click
document.getElementById('search-icon').addEventListener('click', () => {
    search();
})

// works for the keypress enter
document.getElementById('search-text').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        search();        
    }
});


// everything for clicking the movie

async function handleMovieSelection(movieId) {
    if (movieId) {
        const paramsString = `?query=${movieId}`;
        const newUrl = `/movie/index.html${paramsString}`;
        window.location.href = newUrl;
    }
}