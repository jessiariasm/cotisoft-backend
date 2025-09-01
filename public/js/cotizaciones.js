document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    if (user.role === 'admin') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    // Cargar cotizaciones reales
    loadCotizaciones(token);
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function loadCotizaciones(token) {
    fetch('/api/cotizaciones', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar cotizaciones');
        }
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector('.table-container tbody');
        tbody.innerHTML = ''; // Limpiar tabla
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No hay cotizaciones</td></tr>';
            return;
        }
        
        // Llenar tabla con datos reales
        data.forEach(cotizacion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cotizacion.codigo}</td>
                <td>${cotizacion.cliente.nombre}</td>
                <td>${new Date(cotizacion.fecha).toLocaleDateString()}</td>
                <td>$${cotizacion.total}</td>
                <td><span class="status ${cotizacion.estado}">${cotizacion.estado}</span></td>
                <td>
                    <button class="btn-action" onclick="viewCotizacion(${cotizacion.id})">Ver</button>
                    <button class="btn-action" onclick="editCotizacion(${cotizacion.id})">Editar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar las cotizaciones');
    });
}

// Funciones para ver y editar (necesitarás implementarlas)
function viewCotizacion(id) {
    alert('Ver cotización ' + id);
}

function editCotizacion(id) {
    alert('Editar cotización ' + id);
}