window.addEventListener('beforeunload', function (e) {
    // Define el mensaje de advertencia
    var confirmationMessage = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';

    // Establece la propiedad returnValue del evento para que el navegador muestre un aviso
    e.preventDefault(); // Para los navegadores que no muestran el mensaje
    e.returnValue = confirmationMessage; // Para los navegadores que lo muestran

    // Devuelve el mensaje de advertencia
    return confirmationMessage;
});
