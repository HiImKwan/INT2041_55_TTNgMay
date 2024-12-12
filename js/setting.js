document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.header').classList.toggle('dark-mode');
    document.querySelectorAll('.nav ul li a').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.article').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.btn').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelector('.text-options').classList.toggle('dark-mode');
    
    // Apply dark mode to article title and content
    document.getElementById('article-title').classList.toggle('dark-mode');
    document.getElementById('article-content').classList.toggle('dark-mode');

    localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
});

// Load user preference
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelector('.header').classList.add('dark-mode');
    document.querySelectorAll('.nav ul li a').forEach(el => el.classList.add('dark-mode'));
    document.querySelectorAll('.article').forEach(el => el.classList.add('dark-mode'));
    document.querySelectorAll('.btn').forEach(el => el.classList.add('dark-mode'));
    document.querySelector('.text-options').classList.add('dark-mode');
    document.getElementById('article-title').classList.add('dark-mode');
    document.getElementById('article-content').classList.add('dark-mode');
}


