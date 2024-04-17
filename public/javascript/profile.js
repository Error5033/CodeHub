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
    favoritesContainer.innerHTML = ''; // Clear the container

    articles.forEach(article => {
        const listItem = document.createElement('li');

        // Assuming that article title and url are available on the article object
        const title = article.title || 'Article';
        const url = article.url; // This should be a valid URL from your article_id

        listItem.innerHTML = `
            <div class="news-content">
                <h2>${title}</h2>
                <p><a href="${url}" target="_blank">Read more</a></p>
            </div>
        `;

        // Append the list item to the container
        favoritesContainer.appendChild(listItem);
    });
}

// Make sure this event listener is not duplicated
document.addEventListener('DOMContentLoaded', () => {
    fetchSavedArticles(); // This function should fetch articles from '/api/saved-articles' and then call displaySavedArticles with the result
});

// ...

// Make sure this event listener is not duplicated
document.addEventListener('DOMContentLoaded', () => {
    fetchSavedArticles(); // This function should fetch articles from '/api/saved-articles' and then call displaySavedArticles with the result
});


// Make sure this event listener is not duplicated
document.addEventListener('DOMContentLoaded', () => {
    fetchSavedArticles(); // This function should fetch articles from '/api/saved-articles' and then call displaySavedArticles with the result
});
