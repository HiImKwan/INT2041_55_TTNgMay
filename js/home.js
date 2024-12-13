let currentQuery = ""
let currentPage = 1;
const fetchNews = async (page, q) => {
    console.log(`Fetching news for ${q}, Page number ${page}...`);

    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + q +
        '&language=en&' +
        'domains=cnn.com&' +
        'pageSize=12&' +
        'page=' + page +
        '&sortBy=popularity&' +
        '';

    var req = new Request(url);

    let a = await fetch(req)
    let response = await a.json()
    // console.log(JSON.stringify(response))

    let str = ""
    for (let item of response.articles) {
        str = str + `<div class="card my-4 mx-2" style="width: 18rem;">
                    <img src="${item.urlToImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <a id="read" href="/html/article.html?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}" target="_blank" class="btn btn-primary">Read</a>
                    </div>
                </div>`
    }
    document.querySelector(".content").innerHTML = str
}
fetchNews(1, currentQuery)

document.getElementById("search").addEventListener("click", (e) => {
    e.preventDefault();
    let query = document.getElementById("searchInput").value;
    currentQuery = query;
    fetchNews(1, query);
});

document.getElementById("previous").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        fetchNews(currentPage, currentQuery);
    }
});

document.getElementById("next").addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = currentPage + 1;
    fetchNews(currentPage, currentQuery);
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch user settings
    // fetch('/settings', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //     },
    // })
    //     .then(response => response.json())
    //     .then(settings => {
    //         // Apply settings like dark mode, font size, etc.
    //         if (settings.dark_mode) {
    //             enableDarkMode();
    //         }
    //         document.body.style.fontSize = `${settings.font_size}px`;
    //         document.body.style.lineHeight = settings.reading_speed;
    //     })
    //     .catch(error => console.error('Error fetching settings:', error));

    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            console.log(decodedToken);
            const userName = decodedToken.sub.name;
            const userEmail = decodedToken.sub.email || 'guest';
            const userKey = `settings_${userEmail}`;
            const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
            document.querySelector('.main h2').textContent = `Hi ${userName}, welcome to Dyslexi News`;
            if (userSettings.darkMode) {
                enableDarkMode();
                console.log(userSettings);
            }
            // Load font family setting
            if (userSettings.fontFamily) {
                document.body.style.fontFamily = userSettings.fontFamily;
            }

        } catch (error) {
            console.error('Error decoding token:', error);
            document.querySelector('.main h2').textContent = 'Hi Guest, welcome to Dyslexi News';
        }
    } else {
        document.querySelector('.main h2').textContent = 'Hi Guest, welcome to Dyslexi News';
    }
});

function enableDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.header').classList.toggle('dark-mode');
    document.querySelectorAll('.nav ul li a').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.article').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.btn').forEach(el => el.classList.toggle('dark-mode'));
}

// Initialize speech recognition
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const searchInput = document.getElementById("searchInput");

document.getElementById("voice-search").addEventListener("click", (e) => {
    e.preventDefault()
    recognition.start();
    console.log("Ready to receive a search command...");
});

// Handle the result of speech recognition
recognition.onresult = (event) => {
    const searchTerm = event.results[0][0].transcript;
    searchInput.value = searchTerm;
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    console.error("Speech recognition error: ", event.error);
};

// Handle when speech recognition ends (useful for debugging)
recognition.onend = () => {
    console.log("Speech recognition has ended.");
};


