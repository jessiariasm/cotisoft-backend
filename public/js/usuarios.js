// Datos de usuarios (simulando base de datos)
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
    {
        id: 1,
        nombre: "Vendedor Ejemplo",
        email: "vendedor@cotisoft.com",
        rol: "Vendedor",
        activo: true,
        password: "Vendedor123" // En un caso real, esto estaría encriptado
    },
    {
        id: 2,
        nombre: "Administrador Sistema",
        email: "admin@cotisoft.com",
        rol: "Administrador",
        activo: true,
        password: "Admin123"
    },
    {
        id: 3,
        nombre: "Gerente General",
        email: "gerente@cotisoft.com",
        rol: "Gerente",
        activo: true,
        password: "Gerente123"
    }
];

// Función para guardar usuarios en localStorage
function guardarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Función para renderizar usuarios
function renderizarUsuarios() {
    const container = document.getElementById('users-container');
    container.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-header">
                <div class="user-avatar big">${usuario.nombre.charAt(0)}</div>
                <div class="user-info">
                    <h3>${usuario.nombre}</h3>
                    <p>${usuario.email}</p>
                </div>
                <span class="role ${usuario.rol.toLowerCase()}">${usuario.rol}</span>
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

// Función para abrir modal de nuevo usuario
function abrirModalNuevo() {
    document.getElementById('modal-titulo').textContent = 'Nuevo Usuario';
    document.getElementById('usuario-form').reset();
    document.getElementById('usuario-id').value = '';
    document.getElementById('usuario-activo').checked = true;
    document.getElementById('modal-usuario').style.display = 'flex';
}

// Función para abrir modal de edición
function abrirModalEditar(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        document.getElementById('modal-titulo').textContent = 'Editar Usuario';
        document.getElementById('usuario-id').value = usuario.id;
        document.getElementById('usuario-nombre').value = usuario.nombre;
        document.getElementById('usuario-email').value = usuario.email;
        document.getElementById('usuario-rol').value = usuario.rol;
        document.getElementById('usuario-activo').checked = usuario.activo;
        document.getElementById('modal-usuario').style.display = 'flex';
    }
}

// Función para guardar usuario (nuevo o editado)
function guardarUsuario() {
    const id = document.getElementById('usuario-id').value;
    const nombre = document.getElementById('usuario-nombre').value;
    const email = document.getElementById('usuario-email').value;
    const rol = document.getElementById('usuario-rol').value;
    const activo = document.getElementById('usuario-activo').checked;
    
    if (!nombre || !email || !rol) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingrese un email válido');
        return;
    }
    
    if (id) {
        // Editar usuario existente
        const index = usuarios.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            usuarios[index] = {
                ...usuarios[index],
                nombre,
                email,
                rol,
                activo
            };
        }
    } else {
        // Nuevo usuario - generar contraseña temporal
        const tempPassword = generarPassword();
        
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        usuarios.push({
            id: nuevoId,
            nombre,
            email,
            rol,
            activo: true,
            password: tempPassword
        });
        
        alert(`Usuario creado. Contraseña temporal: ${tempPassword}`);
    }
    
    guardarUsuarios();
    renderizarUsuarios();
    cerrarModal();
}

// Generar contraseña temporal
function generarPassword() {
    const length = 8;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Cambiar estado activo/inactivo
function toggleEstadoUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.activo = !usuario.activo;
        guardarUsuarios();
        renderizarUsuarios();
        alert(`Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente`);
    }
}

// Eliminar usuario
function eliminarUsuario(id) {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        const index = usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios.splice(index, 1);
            guardarUsuarios();
            renderizarUsuarios();
            alert('Usuario eliminado correctamente');
        }
    }
}

// Función para cerrar modal
function cerrarModal() {
    document.getElementById('modal-usuario').style.display = 'none';
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión y rol
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'Administrador') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Configurar información de usuario
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    // Renderizar usuarios
    renderizarUsuarios();
    
    // Eventos para el modal
    document.getElementById('btn-nuevo-usuario').addEventListener('click', abrirModalNuevo);
    document.getElementById('btn-guardar-usuario').addEventListener('click', guardarUsuario);
    document.getElementById('btn-cancelar-usuario').addEventListener('click', cerrarModal);
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    
    // Evento para cerrar modal haciendo clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-usuario')) {
            cerrarModal();
        }
    });
    
    // Evento para logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});