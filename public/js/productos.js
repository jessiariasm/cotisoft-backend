document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    if (user.role === 'admin') {
        document.getElementById('admin-users-link').style.display = 'block';
    }

    // Cargar productos reales
    loadProductos(token);
    
    // Configurar eventos
    document.getElementById('btn-nuevo-producto').addEventListener('click', abrirModalNuevo);
    document.getElementById('btn-guardar').addEventListener('click', guardarProducto);
    document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    
    document.getElementById('buscar-producto').addEventListener('input', filtrarProductos);
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProductos);
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

function loadProductos(token, searchTerm = '', category = '') {
    let url = '/api/productos';
    const params = [];
    
    if (searchTerm) params.push('search=' + encodeURIComponent(searchTerm));
    if (category) params.push('categoria=' + encodeURIComponent(category));
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    fetch(url, {
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
        const productos = data.data || data;
        renderProductos(productos);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los productos');
    });
}

function renderProductos(productos) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (productos.length === 0) {
        container.innerHTML = '<div class="no-products">No se encontraron productos</div>';
        return;
    }
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${producto.imagen ? 
                    `<img src="${producto.imagen}" alt="${producto.nombre}">` : 
                    `<div class="default-image"><i class="fas fa-box-open"></i></div>`
                }
            </div>
            <div class="product-info">
                <div class="product-header">
                    <div>
                        <div class="product-name">${producto.nombre}</div>
                        <div class="product-ref">Ref: ${producto.referencia}</div>
                    </div>
                    <div class="product-category">${producto.categoria}</div>
                </div>
                <div class="product-price">$${producto.precio.toFixed(2)}</div>
                <div class="product-description">${producto.descripcion}</div>
                <div class="product-actions">
                    <button class="btn-action btn-edit" data-id="${producto.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-action btn-delete" data-id="${producto.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEditar(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => eliminarProducto(parseInt(btn.dataset.id)));
    });
}

function filtrarProductos() {
    const token = localStorage.getItem('token');
    const searchTerm = document.getElementById('buscar-producto').value;
    const category = document.getElementById('filtro-categoria').value;
    
    loadProductos(token, searchTerm, category);
}

function abrirModalNuevo() {
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    document.getElementById('form-producto').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('modal-producto').style.display = 'flex';
}

function abrirModalEditar(id) {
    const token = localStorage.getItem('token');
    
    fetch('/api/productos/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar producto');
        }
        return response.json();
    })
    .then(producto => {
        document.getElementById('modal-titulo').textContent = 'Editar Producto';
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('referencia').value = producto.referencia;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('imagen').value = producto.imagen || '';
        
        document.getElementById('modal-producto').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el producto');
    });
}

function guardarProducto() {
    const token = localStorage.getItem('token');
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre').value;
    const referencia = document.getElementById('referencia').value;
    const categoria = document.getElementById('categoria').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').value;
    
    if (!nombre || !referencia || !categoria || isNaN(precio)) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    const productoData = {
        nombre: nombre,
        referencia: referencia,
        categoria: categoria,
        precio: precio,
        descripcion: descripcion,
        imagen: imagen
    };
    
    const url = id ? '/api/productos/' + id : '/api/productos';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(productoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar producto');
        }
        return response.json();
    })
    .then(data => {
        alert(`Producto ${id ? 'actualizado' : 'creado'} con éxito`);
        cerrarModal();
        loadProductos(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el producto');
    });
}

function eliminarProducto(id) {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch('/api/productos/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }
        return response.json();
    })
    .then(data => {
        alert('Producto eliminado correctamente');
        loadProductos(token);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    });
}

function cerrarModal() {
    document.getElementById('modal-producto').style.display = 'none';
}