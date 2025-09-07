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
    const nuevoClienteBtn = document.getElementById('nuevo-cliente-btn');
if (nuevoClienteBtn) {
    nuevoClienteBtn.addEventListener('click', () => {
        showClienteModal();
            // --- Manejo del formulario del modal (guardar nuevo o actualizar) ---
    const clienteForm = document.getElementById('cliente-form');
    const saveBtn = document.getElementById('cliente-save-btn');

    if (clienteForm) {
        clienteForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // tomamos token desde la variable que ya definiste arriba
            const tokenLocal = token || localStorage.getItem('token');

            // recogemos datos del formulario (ids en tu HTML: cliente-nombre, cliente-empresa, etc.)
            const clienteData = {
                nombre: document.getElementById('cliente-nombre').value.trim(),
                empresa: document.getElementById('cliente-empresa').value.trim(),
                nit: document.getElementById('cliente-nit').value.trim(),
                contacto: document.getElementById('cliente-contacto').value.trim()
            };

            // Determinar si es POST (nuevo) o PUT (editar) según dataset del botón guardar
            let url = '/api/clientes';
            let method = 'POST';
            if (saveBtn && saveBtn.dataset && saveBtn.dataset.id) {
                url = '/api/clientes/' + saveBtn.dataset.id;
                method = 'PUT';
            }

            try {
                const resp = await fetch(url, {
                    method: method,
                    headers: {
                        'Authorization': 'Bearer ' + tokenLocal,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clienteData)
                });

                const body = await resp.json().catch(() => null);

                if (!resp.ok) {
                    // manejo de validaciones 422 si existen
                    if (resp.status === 422 && body && body.errors) {
                        const mensajes = Object.values(body.errors).flat().join('\n');
                        alert('Errores de validación:\n' + mensajes);
                        return;
                    }
                    throw new Error(body && body.message ? body.message : 'Error al guardar cliente');
                }

                // Éxito: cerramos modal, limpiamos id y recargamos lista
                document.getElementById('cliente-modal').style.display = 'none';
                if (saveBtn) delete saveBtn.dataset.id;
                alert('Cliente guardado correctamente');
                // recargar la lista con el token
                loadClientes(tokenLocal);
            } catch (err) {
                console.error('Error al guardar cliente:', err);
                alert('No se pudo guardar el cliente. Revisa la consola (F12) y la pestaña Network.');
            }
        });
    }

    // Cerrar modal con botón Cancelar
    const cancelBtn = document.getElementById('cliente-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('cliente-modal').style.display = 'none';
            if (saveBtn) delete saveBtn.dataset.id;
        });
    }

    // Cerrar modal si el usuario clickea fuera del contenido
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cliente-modal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
            if (saveBtn) delete saveBtn.dataset.id;
        }
    });

    });
}

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
    fetch('http://127.0.0.1:8000/api/clientes', {  // 🔹 URL absoluta para evitar errores
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
        // Algunos backends devuelven { data: [...] }, otros devuelven directamente [...]
        const clientes = data.data || data;

        // Si no hay clientes
        if (!clientes || clientes.length === 0) {
            const tbody = document.querySelector('.table-container tbody');
            tbody.innerHTML = '<tr><td colspan="6">No hay clientes registrados</td></tr>';
            return;
        }

        // Renderizamos los clientes en tabla
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
    const tokenLocal = localStorage.getItem('token');
    fetch('/api/clientes/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokenLocal,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el cliente');
        return response.json();
    })
    .then(cliente => {
        // abrir modal con los datos cargados
        showClienteModal(cliente);
    })
    .catch(error => {
        console.error('Error al cargar cliente para edición:', error);
        alert('No se pudo cargar el cliente para editar.');
    });
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

function showClienteModal(cliente = null) {
    const modal = document.getElementById('cliente-modal');
    const modalTitle = document.getElementById('modal-title');
    const saveBtn = document.getElementById('cliente-save-btn');

    if (cliente) {
        // Editar cliente
        modalTitle.textContent = 'Editar Cliente';
        document.getElementById('cliente-nombre').value = cliente.nombre;
        document.getElementById('cliente-empresa').value = cliente.empresa;
        document.getElementById('cliente-nit').value = cliente.nit;
        document.getElementById('cliente-contacto').value = cliente.contacto;
        saveBtn.textContent = 'Actualizar';
        saveBtn.dataset.id = cliente.id; // guardamos el id
    } else {
        // Nuevo cliente
        modalTitle.textContent = 'Nuevo Cliente';
        document.getElementById('cliente-form').reset();
        saveBtn.textContent = 'Guardar';
        delete saveBtn.dataset.id; // limpiamos id
    }

    modal.style.display = 'block';
}




