const params = new URLSearchParams(window.location.search);
const articleUrl = params.get("url");

if (!articleUrl) {
    document.body.innerHTML = "<p>No article URL provided.</p>";
} else {
    fetch(`http://127.0.0.1:5000/scrape?url=${encodeURIComponent(articleUrl)}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.text) {
                document.getElementById("article-title").innerText = "Article Content";
                document.getElementById("article-content").innerText = data.text;
            } else {
                document.body.innerHTML = "<p>Failed to retrieve article content.</p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching article content:", error);
            document.body.innerHTML = "<p>Error loading article content.</p>";
        });
}
