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

    // Cargar clientes reales
    loadClientes(token);

    // Configurar evento para nuevo cliente
    document.querySelector('.btn-primary').addEventListener('click', () => {
        showClienteModal(); // Función para mostrar modal de nuevo cliente
    });

    // Configurar búsqueda
    document.querySelector('.search-filter input').addEventListener('input', function() {
        filterClientes(this.value);
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function loadClientes(token) {
    fetch('/api/clientes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar clientes');
        }
        return response.json();
    })
    .then(data => {
        const clientes = data.data || data;
        renderClientes(clientes);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los clientes');
    });
}

function renderClientes(clientes) {
    const tbody = document.querySelector('.table-container tbody');
    tbody.innerHTML = '';
    
    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay clientes registrados</td></tr>';
        return;
    }
    
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.empresa}</td>
            <td>${cliente.nit}</td>
            <td>${cliente.contacto}</td>
            <td>${cliente.cotizaciones_count || 0}</td>
            <td>
                <button class="btn-action" onclick="viewCliente(${cliente.id})">Ver</button>
                <button class="btn-action" onclick="editCliente(${cliente.id})">Editar</button>
                <button class="btn-action" onclick="deleteCliente(${cliente.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterClientes(termino) {
    const token = localStorage.getItem('token');
    
    fetch('/api/clientes?search=' + encodeURIComponent(termino), {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al buscar clientes');
        }
        return response.json();
    })
    .then(data => {
        const clientes = data.data || data;
        renderClientes(clientes);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function viewCliente(id) {
    const token = localStorage.getItem('token');
    
    fetch('/api/clientes/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar cliente');
        }
        return response.json();
    })
    .then(cliente => {
        alert(`Cliente: ${cliente.nombre}\nEmpresa: ${cliente.empresa}\nNIT: ${cliente.nit}\nContacto: ${cliente.contacto}`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el cliente');
    });
}

function editCliente(id) {
    // Implementar edición de cliente
    alert('Editar cliente ' + id);
}

function deleteCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch('/api/clientes/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar cliente');
        }
        return response.json();
    })
    .then(data => {
        alert('Cliente eliminado correctamente');
        loadClientes(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el cliente');
    });
}

function showClienteModal() {
    // Implementar modal para crear/editar cliente
    alert('Aquí iría el modal para crear/editar cliente');
}