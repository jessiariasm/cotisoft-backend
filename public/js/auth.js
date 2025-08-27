document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulación de autenticación
    if(email && password) {
        // Guardar datos de usuario en localStorage
        const user = {
            id: 1,
            name: "Juan Pérez",
            role: "Vendedor",
            email: email
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'fake-jwt-token');
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Por favor ingrese credenciales válidas');
    }
});