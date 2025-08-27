// Datos de ejemplo para productos (simulando base de datos)
let productos = JSON.parse(localStorage.getItem('productos')) || [
    {
        id: 1,
        nombre: "Tablero Eléctrico 220V",
        referencia: "TAB-220",
        categoria: "Tableros",
        precio: 1200.50,
        descripcion: "Tablero principal para instalaciones industriales con capacidad para 32 circuitos",
        imagen: "https://via.placeholder.com/300"
    },
    {
        id: 2,
        nombre: "Interruptor Termomagnético 63A",
        referencia: "IT-63",
        categoria: "Componentes",
        precio: 45.75,
        descripcion: "Interruptor de seguridad para circuitos eléctricos de alta potencia",
        imagen: "https://via.placeholder.com/300"
    },
    {
        id: 3,
        nombre: "Caja Térmica 3 Polos",
        referencia: "CT-3P",
        categoria: "Componentes",
        precio: 28.90,
        descripcion: "Caja de protección térmica para sistemas trifásicos",
        imagen: ""
    },
    {
        id: 4,
        nombre: "Centro de Control de Motores",
        referencia: "CCM-100",
        categoria: "Tableros",
        precio: 3250.00,
        descripcion: "Sistema completo para control y protección de motores industriales",
        imagen: "https://via.placeholder.com/300"
    },
    {
        id: 5,
        nombre: "Transformador 10KVA",
        referencia: "TRA-10K",
        categoria: "Componentes",
        precio: 850.00,
        descripcion: "Transformador de aislamiento para aplicaciones industriales",
        imagen: "https://via.placeholder.com/300"
    },
    {
        id: 6,
        nombre: "Kit de Herramientas Eléctricas",
        referencia: "KH-ELEC",
        categoria: "Accesorios",
        precio: 120.00,
        descripcion: "Set completo de herramientas para instalaciones eléctricas",
        imagen: ""
    }
];

// Función para guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para renderizar productos
function renderizarProductos(products = productos) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">No se encontraron productos</div>';
        return;
    }
    
    products.forEach(producto => {
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

// Función para abrir modal de nuevo producto
function abrirModalNuevo() {
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    document.getElementById('form-producto').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('modal-producto').style.display = 'flex';
}

// Función para abrir modal de edición
function abrirModalEditar(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('modal-titulo').textContent = 'Editar Producto';
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('referencia').value = producto.referencia;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('imagen').value = producto.imagen;
        document.getElementById('modal-producto').style.display = 'flex';
    }
}

// Función para guardar producto (nuevo o editado)
function guardarProducto() {
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
    
    if (id) {
        // Editar producto existente
        const index = productos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            productos[index] = {
                ...productos[index],
                nombre,
                referencia,
                categoria,
                precio,
                descripcion,
                imagen
            };
        }
    } else {
        // Nuevo producto
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({
            id: nuevoId,
            nombre,
            referencia,
            categoria,
            precio,
            descripcion,
            imagen
        });
    }
    
    guardarProductos();
    renderizarProductos();
    cerrarModal();
    alert(`Producto ${id ? 'actualizado' : 'creado'} con éxito`);
}

// Función para eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
        const index = productos.findIndex(p => p.id === id);
        if (index !== -1) {
            productos.splice(index, 1);
            guardarProductos();
            renderizarProductos();
            alert('Producto eliminado correctamente');
        }
    }
}

// Función para cerrar modal
function cerrarModal() {
    document.getElementById('modal-producto').style.display = 'none';
}

// Función para filtrar productos
function filtrarProductos() {
    const termino = document.getElementById('buscar-producto').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value;
    
    const resultados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(termino);
        const coincideRef = producto.referencia.toLowerCase().includes(termino);
        const coincideCategoria = categoria ? producto.categoria === categoria : true;
        
        return (coincideNombre || coincideRef) && coincideCategoria;
    });
    
    renderizarProductos(resultados);
}

// Función para alternar la barra lateral en móviles
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.toggle('expanded');
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos de usuario
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    // Mostrar enlace de usuarios solo para administradores
    if (user.role === 'Administrador') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    // Renderizar productos
    renderizarProductos();
    
    // Eventos para el modal
    document.getElementById('btn-nuevo-producto').addEventListener('click', abrirModalNuevo);
    document.getElementById('btn-guardar').addEventListener('click', guardarProducto);
    document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    
    // Evento para cerrar modal haciendo clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-producto')) {
            cerrarModal();
        }
    });
    
    // Eventos para filtros
    document.getElementById('buscar-producto').addEventListener('input', filtrarProductos);
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProductos);
    
    // Evento para logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});