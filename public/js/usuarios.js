document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'admin') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    // Cargar usuarios reales
    loadUsuarios(token);
    
    // Configurar eventos
    document.getElementById('btn-nuevo-usuario').addEventListener('click', abrirModalNuevo);
    document.getElementById('btn-guardar-usuario').addEventListener('click', guardarUsuario);
    document.getElementById('btn-cancelar-usuario').addEventListener('click', cerrarModal);
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function loadUsuarios(token) {
    fetch('/api/usuarios', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }
        return response.json();
    })
    .then(data => {
        const usuarios = data.data || data;
        renderUsuarios(usuarios);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los usuarios');
    });
}

function renderUsuarios(usuarios) {
    const container = document.getElementById('users-container');
    container.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-header">
                <div class="user-avatar big">${usuario.name.charAt(0)}</div>
                <div class="user-info">
                    <h3>${usuario.name}</h3>
                    <p>${usuario.email}</p>
                </div>
                <span class="role ${usuario.role}">${usuario.role}</span>
            </div>
            <div class="user-details">
                <p><strong>Estado:</strong> <span class="status ${usuario.activo ? 'activo' : 'inactivo'}">${usuario.activo ? 'Activo' : 'Inactivo'}</span></p>
                <div class="user-actions">
                    <button class="btn-action edit" data-id="${usuario.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-action toggle-status" data-id="${usuario.id}">
                        ${usuario.activo ? '<i class="fas fa-ban"></i> Desactivar' : '<i class="fas fa-check"></i> Activar'}
                    </button>
                    <button class="btn-action delete" data-id="${usuario.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        container.appendChild(userCard);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('.btn-action.edit').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEditar(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-action.toggle-status').forEach(btn => {
        btn.addEventListener('click', () => toggleEstadoUsuario(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
        btn.addEventListener('click', () => eliminarUsuario(parseInt(btn.dataset.id)));
    });
}

function abrirModalNuevo() {
    document.getElementById('modal-titulo').textContent = 'Nuevo Usuario';
    document.getElementById('usuario-form').reset();
    document.getElementById('usuario-id').value = '';
    document.getElementById('usuario-activo').checked = true;
    document.getElementById('modal-usuario').style.display = 'flex';
}

function abrirModalEditar(id) {
    const token = localStorage.getItem('token');
    
    fetch('/api/usuarios/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar usuario');
        }
        return response.json();
    })
    .then(usuario => {
        document.getElementById('modal-titulo').textContent = 'Editar Usuario';
        document.getElementById('usuario-id').value = usuario.id;
        document.getElementById('usuario-nombre').value = usuario.name;
        document.getElementById('usuario-email').value = usuario.email;
        document.getElementById('usuario-rol').value = usuario.role;
        document.getElementById('usuario-activo').checked = usuario.activo;
        
        document.getElementById('modal-usuario').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el usuario');
    });
}

function guardarUsuario() {
    const token = localStorage.getItem('token');
    const id = document.getElementById('usuario-id').value;
    const nombre = document.getElementById('usuario-nombre').value;
    const email = document.getElementById('usuario-email').value;
    const rol = document.getElementById('usuario-rol').value;
    const activo = document.getElementById('usuario-activo').checked;
    
    if (!nombre || !email || !rol) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    const usuarioData = {
        name: nombre,
        email: email,
        role: rol,
        activo: activo
    };
    
    const url = id ? '/api/usuarios/' + id : '/api/usuarios';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar usuario');
        }
        return response.json();
    })
    .then(data => {
        alert(`Usuario ${id ? 'actualizado' : 'creado'} con éxito`);
        cerrarModal();
        loadUsuarios(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el usuario');
    });
}

function toggleEstadoUsuario(id) {
    const token = localStorage.getItem('token');
    
    fetch('/api/usuarios/' + id + '/toggle-status', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cambiar estado');
        }
        return response.json();
    })
    .then(data => {
        alert(`Usuario ${data.activo ? 'activado' : 'desactivado'} correctamente`);
        loadUsuarios(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cambiar el estado del usuario');
    });
}

function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch('/api/usuarios/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }
        return response.json();
    })
    .then(data => {
        alert('Usuario eliminado correctamente');
        loadUsuarios(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    });
}

function cerrarModal() {
    document.getElementById('modal-usuario').style.display = 'none';
}