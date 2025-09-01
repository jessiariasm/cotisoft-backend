document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;

    try {
        console.log('🔄 Enviando solicitud de login...');
        
        // URL CORREGIDA - usa el virtual host de Laragon
        const response = await fetch('http://cotisoft-backend.test/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        console.log('📥 Respuesta recibida. Status:', response.status);
        
        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Si no es JSON, leer como texto para debug
            const textResponse = await response.text();
            console.error('❌ Respuesta no es JSON:', textResponse);
            throw new TypeError('La respuesta del servidor no es JSON. Verifica Laravel.');
        }
        
        const data = await response.json();
        console.log('📊 Datos recibidos:', data);

        if (response.ok) {
            // Guardar token y datos de usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('✅ Login exitoso. Redirigiendo...');
            window.location.href = 'dashboard.html';
        } else {
            // Mostrar mensaje de error específico
            const errorMessage = data.error || data.message || 'Error desconocido';
            console.error('❌ Error del servidor:', errorMessage);
            alert('Error: ' + errorMessage);
        }
    } catch (error) {
        console.error('💥 Error de conexión:', error);
        alert('Error de conexión: ' + error.message + '\n\nVerifica que:\n1. Laragon esté ejecutándose\n2. El servidor Laravel esté corriendo (php artisan serve)\n3. La URL sea correcta');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});