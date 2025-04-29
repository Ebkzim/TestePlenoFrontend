document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('img').src = type === 'password' 
                ? 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/eye.svg'
                : 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/eye-slash.svg';
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const passwordInput = this.querySelector('input[type="password"]');
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (email && password) {
                const userData = localStorage.getItem(email);
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.password === password) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        window.location.href = 'dashboard.html';
                        return;
                    }
                }
                showNotification('Email ou senha incorretos', 'error');
            } else {
                showNotification('Preencha todos os campos', 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                password: this.querySelectorAll('input[type="password"]')[0].value,
                confirmPassword: this.querySelectorAll('input[type="password"]')[1].value,
                bio: this.querySelector('input[placeholder="Fale sobre você"]').value,
                contact: this.querySelector('input[placeholder="Opção de contato"]').value,
                role: this.querySelector('select').value
            };

            if (formData.password !== formData.confirmPassword) {
                showNotification('As senhas não coincidem', 'error');
                return;
            }

            localStorage.setItem(formData.email, JSON.stringify(formData));
            showNotification('Conta criada com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    const signupButton = document.querySelector('.signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboard();
    }
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const onDashboard = window.location.pathname.includes('dashboard.html');
    
    if (!currentUser && onDashboard) {
        window.location.href = 'index.html';
    } else if (currentUser && !onDashboard && !window.location.pathname.includes('register.html')) {
        window.location.href = 'dashboard.html';
    }
}

function updateDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
