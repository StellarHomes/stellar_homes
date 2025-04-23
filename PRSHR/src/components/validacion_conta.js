
document.querySelector('.login-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const password = document.getElementById('user-password').value;
    const passwordConfirm = document.getElementById('user-password-confirm').value;

   
    if (!password || !passwordConfirm) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, llene todos los campos.',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña corta',
            text: 'La contraseña debe tener al menos 8 caracteres.',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (password !== passwordConfirm) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseñas no coinciden',
            text: 'Las contraseñas no son iguales. Inténtelo nuevamente.',
            confirmButtonText: 'OK'
        });
        return;
    }
    Swal.fire({
        icon: 'success',
        title: 'Contraseña válida',
        text: '¡Contraseña cambiada con éxito!',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
    
            event.target.submit();
        }
    });
});
