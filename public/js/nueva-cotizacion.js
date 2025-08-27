document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) window.location.href = 'login.html';
    
    document.getElementById('user-name').textContent = user.name;
    document.querySelector('.user-avatar').textContent = user.name.charAt(0).toUpperCase();
    
    if(user.role === 'Administrador') {
        document.getElementById('admin-users-link').style.display = 'block';
    }
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Configurar fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-seguimiento').min = today;
    
    // Productos
    const lista = document.getElementById("lista-productos");
    const productos = [];
    
    document.getElementById("agregar-producto").addEventListener("click", () => {
        const nombre = document.getElementById("producto-select").value;
        const cantidad = parseInt(document.getElementById("cantidad").value);
        
        if (!nombre || isNaN(cantidad) || cantidad <= 0) {
            alert("Selecciona un producto válido y una cantidad.");
            return;
        }
        
        productos.push({ nombre, cantidad });
        actualizarLista();
        document.getElementById("producto-select").value = "";
        document.getElementById("cantidad").value = "1";
    });
    
    function actualizarLista() {
        lista.innerHTML = "";
        productos.forEach((p, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${p.nombre} – Cantidad: ${p.cantidad} 
                            <button onclick="eliminarProducto(${index})">✕</button>`;
            lista.appendChild(li);
        });
    }
    
    window.eliminarProducto = function(index) {
        productos.splice(index, 1);
        actualizarLista();
    }
    
    document.getElementById("cotizacion-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (productos.length === 0) {
            alert("Agrega al menos un producto.");
            return;
        }
        
        // Guardar en localStorage y redirigir
        const cotizacion = {
            id: '#' + Math.floor(1000 + Math.random() * 9000),
            cliente: document.getElementById('cliente').value,
            productos: productos,
            fecha: new Date().toLocaleDateString(),
            seguimiento: document.getElementById('fecha-seguimiento').value,
            notas: document.getElementById('notas').value,
            estado: 'Pendiente'
        };
        
        // Guardar en localStorage
        const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
        cotizaciones.push(cotizacion);
        localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));
        
        alert('Cotización creada con éxito');
        window.location.href = 'cotizaciones.html';
    });
});