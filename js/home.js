let currentQuery = ""
let currentPage = 1;
const fetchNews = async (page, q)=> {
console.log(`Fetching news for ${q}, Page number ${page}...`);

var url = 'https://newsapi.org/v2/everything?' +
    'q=' + q +
    '&language=en&' +
    'domains=cnn.com&' +
    'pageSize=10&' +
    'page=' + page + 
    '&sortBy=popularity&' +
    'apiKey=367f7e09faef4bcd9cb9eab69cf5cad8';

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
search.addEventListener("click", (e)=>{
    e.preventDefault()
    let query = searchInput.value;
    currentQuery = query
    fetchNews(1, query) 
})
// console.log(JSON.stringify(response))


previous.addEventListener("click", (e)=>{
    e.preventDefault()
    if(currentPage > 1){
        currentPage = currentPage - 1;
        fetchNews(currentPage, currentQuery)
    }
})
next.addEventListener("click", (e)=>{
    e.preventDefault()
    currentPage = currentPage + 1;
    fetchNews(currentPage, currentQuery) 
})

document.addEventListener("click", (e) => {
    if (e.target.id === "read") {
        // e.preventDefault();

        const articleUrl = e.target.href;
        console.log("Navigating to article:", articleUrl);

        // window.open(`article.html?url=${encodeURIComponent(articleUrl)}`, "_blank");
    }
});


