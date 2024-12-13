const params = new URLSearchParams(window.location.search);
const articleUrl = params.get("url");
const articleTitle = params.get("title");


const tempSettings = {};
let sentences = [];
let currentLineIndex = 0;
let lineByLineMode = false;
let isReading = false;
let readingSpeed = 1.0;

if (!articleUrl) {
    document.body.innerHTML = "<p>No article URL provided.</p>";
} else {
    document.getElementById("article-title").innerText = articleTitle || "Loading article title...";
    fetch(`http://127.0.0.1:5000/scrape?url=${encodeURIComponent(articleUrl)}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.text) {
                sentences = data.text.match(/[^.!?]+[.!?]+/g) || [data.text];
                renderArticleContent();
            } else {
                document.body.innerHTML = "<p>Failed to retrieve article content.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching article content:", error);
            document.body.innerHTML = "<p>Error loading article content.</p>";
        });
}

function renderArticleContent() {
    const contentDiv = document.getElementById("article-content");

    if (lineByLineMode) {
        contentDiv.innerHTML = sentences
            .map((sentence, index) =>
                `<p class="${index === currentLineIndex ? 'line-active' : 'line-blurred'}">${sentence}</p>`
            )
            .join("");
    } else {
        contentDiv.innerText = sentences.join(" ");
    }
}

// Function to trigger the speech synthesis
function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = readingSpeed;
    utterance.onend = () => {
        if (currentLineIndex < sentences.length - 1) {
            currentLineIndex++;
            renderArticleContent();
            if (isReading) {
                readAloud(sentences[currentLineIndex]);
            }
        }
    };
    window.speechSynthesis.speak(utterance);
}

// Stop Speech Function
function stopSpeech() {
    if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
    }
}

// Start Speech Function
function startSpeech() {
    if (!isReading && lineByLineMode && currentLineIndex < sentences.length) {
        isReading = true;
        readAloud(sentences[currentLineIndex]);
    }
}

// Update reading speed function
document.getElementById("reading-speed").addEventListener("input", (event) => {
    readingSpeed = parseFloat(event.target.value);
    document.getElementById("speed-label").textContent = `${readingSpeed}x`;
});

// Stop Speech Button Event Listener
document.getElementById("stop-speech").addEventListener("click", stopSpeech);

// Start Speech Button Event Listener
document.getElementById("start-speech").addEventListener("click", startSpeech);

// Font Size and Family
let fontSize = 16;

function updateFontSizeLabel() {
    document.getElementById("font-size-label").textContent = `${fontSize}px`;
    document.getElementById("article-content").style.fontSize = `${fontSize}px`;
}

document.getElementById("decrease-font-size").addEventListener("click", () => {
    if (fontSize > 12) {
        fontSize -= 2;
        updateFontSizeLabel();
    }
});

document.getElementById("increase-font-size").addEventListener("click", () => {
    if (fontSize < 36) {
        fontSize += 2;
        updateFontSizeLabel();
    }
});

updateFontSizeLabel();

// Line-by-Line Toggle
document.getElementById("toggle-line-by-line").addEventListener("click", () => {
    lineByLineMode = !lineByLineMode;
    document.getElementById("line-nav").classList.toggle("d-none", !lineByLineMode);
    document.getElementById("speech-button").classList.toggle("d-none", !lineByLineMode);
    renderArticleContent();
});

// Navigate Lines
document.getElementById("prev-line").addEventListener("click", () => {
    if (currentLineIndex > 0) {
        currentLineIndex--;
        renderArticleContent();
    }
});

document.getElementById("next-line").addEventListener("click", () => {
    if (currentLineIndex < sentences.length - 1) {
        currentLineIndex++;
        renderArticleContent();
    }
});

document.getElementById('font-family').addEventListener('change', (event) => {
    const selectedFont = event.target.value;
    document.body.style.fontFamily = selectedFont;
    tempSettings.fontFamily = selectedFont;
    console.log(tempSettings);
    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token);
    const userEmail = decodedToken.sub.email || 'guest';
    const userKey = `settings_${userEmail}`;

    const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
    Object.assign(userSettings, tempSettings); // Merge temporary settings into saved settings

    localStorage.setItem(userKey, JSON.stringify(userSettings));
});

function enableDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.header').classList.toggle('dark-mode');
    document.querySelectorAll('.nav ul li a').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.article').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.btn').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelector('.text-options').classList.toggle('dark-mode');
    document.getElementById('article-title').classList.toggle('dark-mode');
    document.getElementById('article-content').classList.toggle('dark-mode');
    tempSettings.darkMode = isDarkMode;
    if(isDarkMode) {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        document.getElementById('background-select').value = 'default';
    }
    console.log(tempSettings);
}

document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token);
    const userEmail = decodedToken.sub.email || 'guest';
    const userKey = `settings_${userEmail}`;
    const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
    enableDarkMode();
    Object.assign(userSettings, tempSettings);
    localStorage.setItem(userKey, JSON.stringify(userSettings));
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            const userEmail = decodedToken.sub.email || 'guest';
            const userKey = `settings_${userEmail}`;
            const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
            console.log(userSettings)
            if (userSettings.darkMode) {
                enableDarkMode();
            }
            // Load font family setting
            if (userSettings.fontFamily) {
                document.body.style.fontFamily = userSettings.fontFamily;
                document.getElementById('font-family').value = userSettings.fontFamily;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
});

// Background Color Selection
document.getElementById('background-select').addEventListener('change', (event) => {
    const value = event.target.value;
    document.body.style.color = '';
    document.body.style.backgroundColor = '';
    switch (value) {
        case 'default':
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#333';
            break;
        case 'cream':
            document.body.style.backgroundColor = '#fffdd0';
            document.body.style.color = '#333';
            break;
        case 'lightgray':
            document.body.style.backgroundColor = '#d3d3d3';
            document.body.style.color = '#333';
            break;
    }
});
