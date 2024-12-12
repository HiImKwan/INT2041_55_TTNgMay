const params = new URLSearchParams(window.location.search);
const articleUrl = params.get("url");
const articleTitle = params.get("title");

let sentences = [];
let currentLineIndex = 0;
let lineByLineMode = false;

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

// Font Size and Family
// Default font size
let fontSize = 16;

// Update font size label and content style
function updateFontSizeLabel() {
    document.getElementById("font-size-label").textContent = `${fontSize}px`;
    document.getElementById("article-content").style.fontSize = `${fontSize}px`;
}

// Decrease font size
document.getElementById("decrease-font-size").addEventListener("click", () => {
    if (fontSize > 12) { // Minimum font size
        fontSize -= 2;
        updateFontSizeLabel();
    }
});

// Increase font size
document.getElementById("increase-font-size").addEventListener("click", () => {
    if (fontSize < 36) { // Maximum font size
        fontSize += 2;
        updateFontSizeLabel();
    }
});

// Initialize with default font size
updateFontSizeLabel();


document.getElementById("font-family").addEventListener("change", (event) => {
    document.getElementById("article-content").style.fontFamily = event.target.value;
});

// Dyslexia-Friendly Mode
document.getElementById("dyslexia-friendly").addEventListener("click", () => {
    document.getElementById("article-content").style.fontFamily = "OpenDyslexic, Arial, sans-serif";
    document.getElementById("article-content").style.fontSize = "18px";
});

// Line-by-Line Toggle
document.getElementById("toggle-line-by-line").addEventListener("click", () => {
    lineByLineMode = !lineByLineMode;
    document.getElementById("line-nav").classList.toggle("d-none", !lineByLineMode);
    renderArticleContent();
});

// Ensure line-by-line mode and active line tracking
let textOptionsDiv = document.querySelector('.text-options');

function updateControlsPosition() {
    if (lineByLineMode) {
        const activeLine = document.querySelector('.line-active');
        if (activeLine) {
            activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

// Update line rendering and ensure controls stay with the active line
function renderArticleContent() {
    const contentDiv = document.getElementById("article-content");

    if (lineByLineMode) {
        contentDiv.innerHTML = sentences
            .map((sentence, index) => 
                `<p class="${index === currentLineIndex ? 'line-active scroll-active' : 'line-blurred'}">${sentence}</p>`
            )
            .join("");

        updateControlsPosition(); // Ensure controls stay with the active line
    } else {
        contentDiv.innerText = sentences.join(" ");
    }
}

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

