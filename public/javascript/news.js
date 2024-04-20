// This will hold the articles fetched from the API
let fetchedArticles = [];
document.addEventListener('DOMContentLoaded', () => {
    const newsFeedElement = document.querySelector('.news-feed');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentCategory = 'all';

    function fetchNews(category = 'all') {
        currentCategory = category;
        const apiKey = '5890ffdbb9434244b5e1dc95cdaf1a81'; // Replace with your actual API key
        const apiUrl = `https://newsapi.org/v2/everything?q=${category}&language=en&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                fetchedArticles = data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // Sort articles by newest first
                displayNews(fetchedArticles);
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsFeedElement.innerHTML = `<p class="error-message">Failed to load news. Please try again later.</p>`;
            });
    }

    function displayNews(articles) {
        newsFeedElement.innerHTML = ''; // Clear out the existing news

        articles.forEach((article, index) => {
            const newsItemElement = document.createElement('article');
            newsItemElement.className = 'news-item';
            newsItemElement.innerHTML = `
                <div class="news-content">
                    <h2>${article.title}</h2>
                    <p>By ${article.author || 'Unknown author'} | ${new Date(article.publishedAt).toLocaleDateString()} | Source: ${article.source.name}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                </div>
                <div class="article-actions">
                    <button onclick="likeArticle(${index})">👍 <span id="like-count-${index}">0</span></button>
                    <button onclick="dislikeArticle(${index})">👎 <span id="dislike-count-${index}">0</span></button>
                    <button onclick="saveArticle(${index})" id="save-btn-${index}">⭐</button>
                </div>
            `;
            newsFeedElement.appendChild(newsItemElement);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-filter');
            fetchNews(category);
        });
    });

    fetchNews(currentCategory); // Initial fetch for news
});

// Updated likeArticle function to increment like count
function likeArticle(index) {
    const likeCountElement = document.getElementById(`like-count-${index}`);
    let likeCount = parseInt(likeCountElement.innerText);
    likeCountElement.innerText = ++likeCount;

    if (!userLoggedIn()) {
        alert("You need to be logged in to like articles.");
        return;
    }



}

// Updated dislikeArticle function to increment dislike count
function dislikeArticle(index) {
    const dislikeCountElement = document.getElementById(`dislike-count-${index}`);
    let dislikeCount = parseInt(dislikeCountElement.innerText);
    dislikeCountElement.innerText = ++dislikeCount;


    if (!userLoggedIn()) {
        alert("You need to be logged in to like articles.");
        return;
    }
}

function saveArticle(index) {
    if (!userLoggedIn()) {
        alert("You need to be logged in to save articles.");
        return;
    }

    const article = fetchedArticles[index];
    const token = localStorage.getItem('userToken');
    const articleData = {
        title: article.title,
    
    };

    const payload = {
        article_id: article.url,
        article_data: articleData 
    };

    fetch('/api/save-article', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert('Article saved successfully.');
  
        } else {
            throw new Error('Error saving article.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving article. Please try again.');
    });
}
