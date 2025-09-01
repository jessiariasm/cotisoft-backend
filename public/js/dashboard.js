document.addEventListener('DOMContentLoaded', function() {
    // Verificar si usuario está logueado
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Mostrar información de usuario
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    // Mostrar enlace de administración solo para admins
    if (user.role === 'admin') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    // Cargar datos reales del dashboard
    loadDashboardData(token);
    
    // Configurar logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

// Función para cargar datos reales del dashboard
function loadDashboardData(token) {
    fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar estadísticas');
        }
        return response.json();
    })
    .then(data => {
        // Actualizar los contadores con datos reales
        document.getElementById('pending-count').textContent = data.pendientes || 0;
        document.getElementById('won-count').textContent = data.ganadas || 0;
        document.getElementById('clients-count').textContent = data.clientes || 0;
    })
    .catch(error => {
        console.error('Error:', error);
        // Mostrar valores por defecto en caso de error
        document.getElementById('pending-count').textContent = '0';
        document.getElementById('won-count').textContent = '0';
        document.getElementById('clients-count').textContent = '0';
    });
}