function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}



function showSuccessModal(message) {
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');

    successMessage.innerText = message;
    successModal.style.display = 'block';

    setTimeout(function() {
    successModal.style.display = "none";
   }, 3000);
}


document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.querySelector('form');

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                gender: document.getElementById('gender').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
            };

            const response = await fetch('/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // Success
                showSuccessModal(data.message);
            } else {
                // Validation error or other error
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Internal Server Error');
        }
    });
});

