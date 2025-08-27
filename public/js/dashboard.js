document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de usuario
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    // Mostrar enlace de usuarios solo para administradores
    if(user.role === 'Administrador') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    // Evento de logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});