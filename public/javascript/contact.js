document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Here you'd typically gather the form data and send it to your server
        // For demo purposes, we'll just log to the console
        const formData = new FormData(contactForm);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        alert('Thank you for your message. We will get back to you soon!');

        // Reset the form after submission
        contactForm.reset();
    });
});
