document.querySelector('.signup-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Signup successful!");
            // Redirect to login page
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error signing up:", error);
        alert("An error occurred. Please try again.");
    }
});
