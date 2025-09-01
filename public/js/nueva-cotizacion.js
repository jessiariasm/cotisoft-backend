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
    
    // Configurar fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-seguimiento').min = today;
    
    // Cargar clientes y productos desde API
    loadClientes(token);
    loadProductos(token);
    
    // Array para productos seleccionados
    let productosSeleccionados = [];
    
    document.getElementById("agregar-producto").addEventListener("click", () => {
        const productoSelect = document.getElementById("producto-select");
        const productoId = productoSelect.value;
        const cantidad = parseInt(document.getElementById("cantidad").value);
        
        if (!productoId || isNaN(cantidad) || cantidad <= 0) {
            alert("Selecciona un producto válido y una cantidad.");
            return;
        }
        
        // Buscar el producto seleccionado
        const producto = productosData.find(p => p.id == productoId);
        
        if (producto) {
            productosSeleccionados.push({
                producto_id: producto.id,
                nombre: producto.nombre,
                cantidad: cantidad,
                precio_unitario: producto.precio
            });
            
            actualizarListaProductos();
            document.getElementById("producto-select").value = "";
            document.getElementById("cantidad").value = "1";
        }
    });
    
    function actualizarListaProductos() {
        const lista = document.getElementById("lista-productos");
        lista.innerHTML = "";
        
        productosSeleccionados.forEach((producto, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio_unitario}
                <button onclick="eliminarProducto(${index})">✕</button>
            `;
            lista.appendChild(li);
        });
    }
    
    window.eliminarProducto = function(index) {
        productosSeleccionados.splice(index, 1);
        actualizarListaProductos();
    }
    
    document.getElementById("cotizacion-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (productosSeleccionados.length === 0) {
            alert("Agrega al menos un producto.");
            return;
        }
        
        const clienteId = document.getElementById('cliente').value;
        const fechaSeguimiento = document.getElementById('fecha-seguimiento').value;
        const notas = document.getElementById('notas').value;
        
        // Preparar datos para enviar
        const cotizacionData = {
            cliente_id: clienteId,
            fecha_seguimiento: fechaSeguimiento,
            notas: notas,
            productos: productosSeleccionados.map(p => ({
                producto_id: p.producto_id,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario
            }))
        };
        
        // Enviar a la API
        fetch('/api/cotizaciones', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(cotizacionData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la cotización');
            }
            return response.json();
        })
        .then(data => {
            alert('Cotización creada con éxito');
            window.location.href = 'cotizaciones.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al crear la cotización: ' + error.message);
        });
    });
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

let clientesData = [];
let productosData = [];

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
        clientesData = data.data || data;
        const select = document.getElementById('cliente');
        select.innerHTML = '<option value="">Seleccionar cliente</option>';
        
        clientesData.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los clientes');
    });
}

function loadProductos(token) {
    fetch('/api/productos', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        return response.json();
    })
    .then(data => {
        productosData = data.data || data;
        const select = document.getElementById('producto-select');
        select.innerHTML = '<option value="">Seleccionar producto</option>';
        
        productosData.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} - $${producto.precio}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los productos');
    });
}