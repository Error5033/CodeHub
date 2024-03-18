document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'translateY(-3px)';
            input.style.transition = 'transform 0.3s';
        });
        input.addEventListener('blur', () => {
            input.style.transform = 'translateY(0)';
        });
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simulating form submission here
        console.log('Form Submitted!');

        const formWrapper = document.querySelector('.contact-form-section');
        formWrapper.innerHTML = `<h2>Thanks for contacting us!</h2><p>Your message has been sent successfully.</p>`;
        formWrapper.style.display = 'flex';
        formWrapper.style.flexDirection = 'column';
        formWrapper.style.alignItems = 'center';
        formWrapper.style.justifyContent = 'center';
        formWrapper.style.height = '300px';

        // Optionally, add more animations or redirect the user
    });
});



