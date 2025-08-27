document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) window.location.href = 'login.html';
    
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    if(user.role === 'Administrador') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});