// Replace with your deployed Apps Script web app URL (see deployment steps below)
const SCRIPT_URL = "YOUR_SHEET_URL";

const form = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-btn');
const statusMessage = document.getElementById('status-message');

form.addEventListener('submit', e => {
    e.preventDefault();
    submitButton.disabled = true;
    statusMessage.textContent = "Sending, please wait...";
    statusMessage.className = '';

    // Use form-encoded body to avoid CORS preflight
    const body = new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    }).toString();

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.result === "success") {
                statusMessage.textContent = "Message sent successfully!";
                statusMessage.className = "success";
                form.reset();
            } else {
                throw new Error(data && data.message ? data.message : "Unknown server response");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            statusMessage.textContent = `Error: ${err.message}`;
            statusMessage.className = "error";
        })
        .finally(() => submitButton.disabled = false);
});
