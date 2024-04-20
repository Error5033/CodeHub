document.addEventListener('DOMContentLoaded', () => {
    // Check if user is signed in
    if (!isUserSignedIn()) {
        window.location.href = 'index.html'; // Redirect to home page if not signed in
        return; // Stop further execution
    }

    fetchUserInfo();
    fetchSavedArticles();
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.addEventListener('click', signOut);
});

function isUserSignedIn() {
    const token = localStorage.getItem('userToken');
    return Boolean(token); // Returns true if token exists, false otherwise
}

function signOut() {
    localStorage.removeItem('userToken');
    window.location.href = 'index.html';
}

function fetchUserInfo() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.error('No token found, redirect to login');
        window.location.href = 'login.html';
        return;
    }

    fetch('/api/user-info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching user information');
        }
        return response.json();
    })
    .then(data => {
        displayUserInfo(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayUserInfo(userData) {
    document.getElementById('userName').textContent = userData.first_name + ' ' + userData.last_name;
    document.getElementById('userEmail').textContent = userData.email;
}

function fetchSavedArticles() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.error('No token found, redirect to login');
        window.location.href = 'login.html';
        return;
    }

    fetch('/api/saved-articles', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching saved articles');
        }
        return response.json();
    })
    .then(articles => {
        displaySavedArticles(articles);
    })
    .catch(error => {
        console.error('Error fetching saved articles:', error);
    });
}



function displaySavedArticles(articles) {
    const favoritesContainer = document.getElementById('favoriteArticles');
    favoritesContainer.innerHTML = ''; // Clear any existing content

    console.log('Saved Articles:', articles); // Log the raw article data

    articles.forEach(article => {
        console.log('Raw Article Data:', article.article_data); // Log raw data


        let articleDetails = {};
        if (article.article_data) {
            try {
                articleDetails = JSON.parse(article.article_data);
                console.log('Parsed Article Details:', articleDetails); // Log parsed details
            } catch (error) {
                console.error('Error parsing article data:', error);
                // If parsing fails, provide default details
                articleDetails = {
                    title: 'Article Title Not Found', // Provide a default title
                };
            }
        }

        // Use the title from articleDetails, if available
        const title = articleDetails.title || 'No Title'; // Default to 'No Title' if title is not provided

        // Create list item and set its innerHTML to include the title and a "Read more" link
        const listItem = document.createElement('li');
        listItem.innerHTML = `${title} - <a href="${article.url}" target="_blank">Read more</a>`;
        favoritesContainer.appendChild(listItem);
    });
}



document.addEventListener('DOMContentLoaded', fetchSavedArticles);



