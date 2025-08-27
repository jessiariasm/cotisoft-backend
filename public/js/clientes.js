document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Configurar UI
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    if (user.role === 'Administrador') {
        document.getElementById('admin-users-link').style.display = 'block';
    }

    // Datos iniciales de clientes
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [
        {
            id: 1,
            nombre: "Cliente A",
            empresa: "Industrias ABC",
            nit: "123456-7",
            contacto: "contacto@clientea.com",
            cotizaciones: 5
        },
        {
            id: 2,
            nombre: "Cliente B",
            empresa: "Empresa XYZ",
            nit: "765432-1",
            contacto: "info@clienteb.com",
            cotizaciones: 12
        }
    ];

    // Guardar clientes en localStorage
    function guardarClientes() {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    // Renderizar tabla de clientes
    function renderizarClientes() {
        const tbody = document.querySelector('.table-container tbody');
        tbody.innerHTML = '';
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.empresa}</td>
                <td>${cliente.nit}</td>
                <td>${cliente.contacto}</td>
                <td>${cliente.cotizaciones}</td>
                <td>
                    <button class="btn-action ver" data-id="${cliente.id}">Ver</button>
                    <button class="btn-action editar" data-id="${cliente.id}">Editar</button>
                    <button class="btn-action eliminar" data-id="${cliente.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar eventos
        document.querySelectorAll('.btn-action.ver').forEach(btn => {
            btn.addEventListener('click', () => verCliente(parseInt(btn.dataset.id)));
        });
        
        document.querySelectorAll('.btn-action.editar').forEach(btn => {
            btn.addEventListener('click', () => editarCliente(parseInt(btn.dataset.id)));
        });
        
        document.querySelectorAll('.btn-action.eliminar').forEach(btn => {
            btn.addEventListener('click', () => eliminarCliente(parseInt(btn.dataset.id)));
        });
    }

    // Ver detalles de cliente
    function verCliente(id) {
        const cliente = clientes.find(c => c.id === id);
        if (cliente) {
            alert(`Detalles del cliente:\n\nNombre: ${cliente.nombre}\nEmpresa: ${cliente.empresa}\nNIT: ${cliente.nit}\nContacto: ${cliente.contacto}\nCotizaciones: ${cliente.cotizaciones}`);
        }
    }

    // Editar cliente
    function editarCliente(id) {
        const cliente = clientes.find(c => c.id === id);
        if (cliente) {
            const nombre = prompt("Nombre:", cliente.nombre);
            const empresa = prompt("Empresa:", cliente.empresa);
            const nit = prompt("NIT:", cliente.nit);
            const contacto = prompt("Contacto:", cliente.contacto);
            
            if (nombre && empresa && nit && contacto) {
                cliente.nombre = nombre;
                cliente.empresa = empresa;
                cliente.nit = nit;
                cliente.contacto = contacto;
                guardarClientes();
                renderizarClientes();
                alert("Cliente actualizado correctamente");
            }
        }
    }

    // Eliminar cliente
    function eliminarCliente(id) {
        if (confirm("¿Está seguro de eliminar este cliente?")) {
            clientes = clientes.filter(c => c.id !== id);
            guardarClientes();
            renderizarClientes();
            alert("Cliente eliminado correctamente");
        }
    }

    // Nuevo cliente
    document.querySelector('.btn-primary').addEventListener('click', () => {
        const nombre = prompt("Nombre completo:");
        const empresa = prompt("Empresa:");
        const nit = prompt("NIT:");
        const contacto = prompt("Email de contacto:");
        
        if (nombre && empresa && nit && contacto) {
            const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
            clientes.push({
                id: nuevoId,
                nombre,
                empresa,
                nit,
                contacto,
                cotizaciones: 0
            });
            guardarClientes();
            renderizarClientes();
            alert("Cliente creado correctamente");
        }
    });

    // Búsqueda de clientes
    document.querySelector('.search-filter input').addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const filas = document.querySelectorAll('.table-container tbody tr');
        
        filas.forEach(fila => {
            const textoFila = fila.textContent.toLowerCase();
            fila.style.display = textoFila.includes(termino) ? '' : 'none';
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Inicializar
    renderizarClientes();
});