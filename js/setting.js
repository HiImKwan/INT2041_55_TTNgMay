const tempSettings = {};

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            const userEmail = decodedToken.sub.email || 'guest';
            const userKey = `settings_${userEmail}`;
            const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
            console.log(decodedToken);
            document.getElementById('username').textContent = `User Name: ${decodedToken.sub.name || 'Guest'}`;
            document.getElementById('email').textContent = `Email: ${userEmail}`;

            // Load dark mode
            if (userSettings.darkMode) {
                enableDarkMode();
            }

            // Load font family
            if (userSettings.fontFamily) {
                document.body.style.fontFamily = userSettings.fontFamily;
                document.getElementById('font-family').value = userSettings.fontFamily;
            }

        } catch (error) {
            console.error('Error decoding token:', error);
            document.getElementById('username').textContent = 'User Name: Guest';
            document.getElementById('email').textContent = 'Email: Not Provided';
        }
    } else {
        document.getElementById('username').textContent = 'User Name: Guest';
        document.getElementById('email').textContent = 'Email: Not Provided';
    }
});

function enableDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.header').classList.toggle('dark-mode');
    document.querySelectorAll('.nav ul li a').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.article').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('.btn').forEach(el => el.classList.toggle('dark-mode'));
    tempSettings.darkMode = isDarkMode;
    console.log(tempSettings);
}

document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    enableDarkMode();
});
// Update font family
document.getElementById('font-family').addEventListener('change', (event) => {
    const selectedFont = event.target.value;
    document.body.style.fontFamily = selectedFont;
    tempSettings.fontFamily = selectedFont;
    console.log(tempSettings);
});

// Save settings button
document.getElementById('save-settings').addEventListener('click', () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token);
    const userEmail = decodedToken.sub.email || 'guest';
    const userKey = `settings_${userEmail}`;

    const userSettings = JSON.parse(localStorage.getItem(userKey)) || {};
    Object.assign(userSettings, tempSettings); // Merge temporary settings into saved settings

    localStorage.setItem(userKey, JSON.stringify(userSettings));

    // Send updated settings to the server
    const updatedSettings = {
        dark_mode: tempSettings.darkMode,
        font_size: tempSettings.fontSize,
        reading_speed: tempSettings.readingSpeed,
    };

    alert('Settings saved!');

});

// Logout button
document.getElementById('logout-button').addEventListener('click', () => {
    window.location.href = '/html/login.html';
});

