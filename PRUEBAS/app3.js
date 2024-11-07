// Obtener el elemento canvas y el contexto de dibujo
var canvas = document.getElementById('miCanvas');
var ctx = canvas.getContext('2d');

// Lista para almacenar los cuadrados
var cuadrados = [];
var arrastrando = false;
var cuadradoSeleccionado = null;
var offsetX, offsetY;

// Función para dibujar un cuadrado
function dibujarCuadrado(x, y, size = 50) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, size, size);
}

// Función para detectar si el clic está dentro de un cuadrado
function estaDentroDelCuadrado(x, y, cuadrado) {
    return x > cuadrado.x && x < cuadrado.x + cuadrado.size &&
        y > cuadrado.y && y < cuadrado.y + cuadrado.size;
}

// Evento de clic en el canvas
canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // Verificar si el clic está dentro de algún cuadrado existente
    for (var i = 0; i < cuadrados.length; i++) {
        if (estaDentroDelCuadrado(x, y, cuadrados[i])) {
            // Iniciar el arrastre del cuadrado seleccionado
            arrastrando = true;
            cuadradoSeleccionado = cuadrados[i];
            offsetX = x - cuadradoSeleccionado.x;
            offsetY = y - cuadradoSeleccionado.y;
            return;
        }
    }

    // Si no se hizo clic en un cuadrado existente, crear uno nuevo
    var nuevoCuadrado = { x: x - 25, y: y - 25, size: 50, original: true };
    cuadrados.push(nuevoCuadrado);
    dibujarTodosLosCuadrados();
});

// Evento de movimiento del ratón en el canvas
canvas.addEventListener('mousemove', function (event) {
    if (arrastrando && cuadradoSeleccionado) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        // Mover el cuadrado seleccionado
        cuadradoSeleccionado.x = x - offsetX;
        cuadradoSeleccionado.y = y - offsetY;
        dibujarTodosLosCuadrados();
    }
});

// Evento de liberación del ratón en el canvas
canvas.addEventListener('mouseup', function (event) {
    arrastrando = false;
    cuadradoSeleccionado = null;
});

// Evento de doble clic en el canvas para duplicar el cuadrado
canvas.addEventListener('dblclick', function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // Verificar si el doble clic está dentro de algún cuadrado existente
    for (var i = 0; i < cuadrados.length; i++) {
        if (estaDentroDelCuadrado(x, y, cuadrados[i])) {
            // Duplicar el cuadrado seleccionado
            var cuadradoOriginal = cuadrados[i];
            var nuevoCuadrado = {
                x: cuadradoOriginal.x + 60,
                y: cuadradoOriginal.y + 60,
                size: cuadradoOriginal.size,
                original: false // Marcar como duplicado
            };
            cuadrados.push(nuevoCuadrado);
            dibujarTodosLosCuadrados();
            return;
        }
    }
});

// Evento de clic en el botón para eliminar duplicados
document.getElementById('eliminarDuplicados').addEventListener('click', function () {
    cuadrados = cuadrados.filter(cuadrado => cuadrado.original);
    dibujarTodosLosCuadrados();
});

// Función para dibujar todos los cuadrados
function dibujarTodosLosCuadrados() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < cuadrados.length; i++) {
        dibujarCuadrado(cuadrados[i].x, cuadrados[i].y, cuadrados[i].size);
    }
}

// Dibujar el primer cuadrado
dibujarCuadrado(100, 100);
cuadrados.push({ x: 100, y: 100, size: 50, original: true });

