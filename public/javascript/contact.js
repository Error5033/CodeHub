document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');

    // Add subtle animation to form inputs on focus
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'translateY(-3px)';
            input.style.transition = 'transform 0.3s';
        });
        input.addEventListener('blur', () => {
            input.style.transform = 'translateY(0)';
        });
    });

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Collect form data
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        // Log the collected form data to the console before sending
        console.log("Sending data to server:", JSON.stringify(formData));

        // Use Fetch API to send the form data to the server asynchronously
        fetch('/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert the JavaScript object to a JSON string
        })
        .then(response => {
            console.log("Response received from server. Status:", response.status); // Log response status code
            return response.text(); // Parse the response text (or use .json() if expecting JSON)
        })
        .then(data => {
            // Log the server's response to the console
            console.log('Success:', data);

            // Update the UI to inform the user that the message was sent successfully
            const formWrapper = document.querySelector('.contact-form-section');
            formWrapper.innerHTML = `<h2>Thanks for contacting us!</h2><p>Your message has been sent successfully.</p>`;
            formWrapper.style.display = 'flex';
            formWrapper.style.flexDirection = 'column';
            formWrapper.style.alignItems = 'center';
            formWrapper.style.justifyContent = 'center';
            formWrapper.style.height = '300px';
        })
        .catch((error) => {
            // Log any error during the fetch operation to the console
            console.error('Error:', error);
        });

        // Note: Additional UI feedback for error handling can be added here to inform the user
    });
});
