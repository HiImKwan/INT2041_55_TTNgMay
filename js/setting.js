// async function saveSettings() {
//     const token = localStorage.getItem('token');
//     const settings = {
//         font_size: document.getElementById('font-size').value,
//         dark_mode: document.getElementById('dark-mode').checked,
//         reading_speed: document.getElementById('reading-speed').value
//     };

//     const response = await fetch('http://localhost:5000/settings', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(settings)
//     });

//     const data = await response.json();
//     alert(data.message);
// }

// document.getElementById('save-settings').addEventListener('click', saveSettings);
function logout() {
    // Clear all localStorage data
    localStorage.clear();
    // Redirect to login page or home page
    window.location.href = '/html/login.html';
}

document.getElementById('logout-button').addEventListener('click', logout);
