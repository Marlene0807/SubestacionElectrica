
/*Se añade un evento que espera a que todo el contenido del documento
en el cual se asignara dependiendo del evento variables inmutables(const) o mutables(let)
para el correcto funcionaiento de la interaccion de los botones y las imagenes utilizadas */ 
document.addEventListener('DOMContentLoaded', function () {
    const lienzoElementos = document.querySelector('.imagenes-container');

    const canvas = document.getElementById('simulador-canvas');
    const ctx = canvas.getContext('2d');//Definir el contexto del dibujo en el lienzo
    const objectDropdown = document.getElementById('object-dropdown');//Menu desplegable para seleccionar objetos
    const deleteButton = document.getElementById('delete-button');//Boton que borrara el objeto previamente seleccionado
    const deleteAllButton = document.getElementById('delete-all-button');//Boton que borrara todos los elementos de la pizarra
    const saveDropdown = document.getElementById('save-dropdown');//Menu desplegable de guardados
    const saveButton = document.getElementById('save-button');//Generar un guardado de la pizarra actual
    const loadButton = document.getElementById('load-button');//Cargar un guardado previo

    let images = [];
    let draggingImage = null;
    let offsetX, offsetY;
    let firstClickedImage = null;
    let lines = [];
    let selectedImage = null;
    let selectedLine = null;
    let imageCount = 0;
    let lineCount = 0;
    let saveCount = 0;
    const saveData = {};
/*Duplicacion de la imagen seleccionada apartir del click en la seccion de los componentes mediante
la espera de un evento*/ 
//podria quitarse esta parte para depender solo del dobleclick, por que en cambio se generan 3
    lienzoElementos.addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            duplicateImage(event.target);
        }
    });
/*Duplicacion de la imagen seleccionada apartir del click en la seccion de los componentes*/ 
    lienzoElementos.addEventListener('dblclick', function (event) {
        if (event.target.tagName === 'IMG') {
            duplicateImage(event.target);
        }
    });
/*Funcion de la duplicacion de elementos en la cual se generaran en un punto especifico del canvas(pizarron 
generado como nuestra area de trabajo), tomando como parametros la imagen a duplicar*/ 
    function duplicateImage(imageElement) {
        const img = new Image();
        img.src = imageElement.src;
/*Generacion del objeto imagen con la asignacion de la imagen seleccionada,
una posicion predefinida y un tamaño predefinido */       
        img.onload = () => {
            const newImage = {
                img: img,
                x: canvas.width / 2 - 25,
                y: canvas.height / 2 - 25,
                width: 50,
                height: 50,
                id: `image-${imageCount++}`,//Identificador para cada imagen para el tener un control de lo ya generado
                selected: false
            };
            images.push(newImage);
            updateDropdown();
            drawCanvas();
        };
    }
/*Creacion inicial de la interfaz en el menu del simulador y se ejecutara en cada momento que se añada 
un elemento y/o camino, al eliminar un elemento y al cargar un guardado*/ 
    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);//Metodo en el cual se genera un espacio para la pizarra

        lines.forEach((line, index) => {//Encargado de generar cada camino(conexion) entre componente
            ctx.beginPath();
            ctx.moveTo(line.startImage.x + line.startImage.width / 2, line.startImage.y + line.startImage.height / 2);
            ctx.lineTo(line.endImage.x + line.endImage.width / 2, line.endImage.y + line.endImage.height / 2);
            ctx.strokeStyle = (selectedLine === index) ? 'yellow' : 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        images.forEach(image => {//Encargado de generar cada camino(conexion) entre componente
            ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
            if (image === selectedImage) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.strokeRect(image.x, image.y, image.width, image.height);
            }
        });
    }

    function updateDropdown() {
        objectDropdown.innerHTML = '<option value="" disabled selected>Seleccionar objeto</option>';
        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image.id;
            option.textContent = `Objeto Duplicado ${image.id.split('-')[1]}`;
            objectDropdown.appendChild(option);
        });
        lines.forEach((line, index) => {
            const option = document.createElement('option');
            option.value = `line-${index}`;
            option.textContent = `Línea ${index + 1}`;
            objectDropdown.appendChild(option);
        });
    }
//Al generar un nuevo guardado
    function updateSaveDropdown() {
        saveDropdown.innerHTML = '<option value="" disabled selected>Seleccionar guardado</option>';
        Object.keys(saveData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            saveDropdown.appendChild(option);
        });
    }
// La imagen seleccionada del menu de objetos creados sera eliminado
    function removeSelectedObject() {
        if (selectedImage) {
            images = images.filter(image => image !== selectedImage);
            selectedImage = null;
        } else if (selectedLine !== null) {
            lines.splice(selectedLine, 1);
            selectedLine = null;
        }
        updateDropdown();//Actualizar el menu de objetos creados
        drawCanvas();
    }
//
    function removeAllObjects() {
        images = [];
        lines = [];
        selectedImage = null;
        selectedLine = null;
        updateDropdown();
        drawCanvas();
    }

    function saveCurrentState() {
        const stateKey = `Guardado ${++saveCount}`;
        saveData[stateKey] = {
            images: JSON.parse(JSON.stringify(images)),
            lines: JSON.parse(JSON.stringify(lines))
        };
        updateSaveDropdown();
        // Alerta de estado guardado
        alert(`El estado actual se ha guardado como "${stateKey}".`);
    }

    function loadSavedState() {
        const selectedKey = saveDropdown.value;
        if (saveData[selectedKey]) {
            images = JSON.parse(JSON.stringify(saveData[selectedKey].images));
            lines = JSON.parse(JSON.stringify(saveData[selectedKey].lines));
            selectedImage = null;
            selectedLine = null;
            updateDropdown();
            drawCanvas();
        }
    }
//Funcion en la que al mantener el click sobre una imagen se podra arrastras y soltar dentro de la pizarra
    canvas.addEventListener('mousedown', function (event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        draggingImage = images.find(image =>
            mouseX >= image.x && mouseX <= image.x + image.width &&
            mouseY >= image.y && mouseY <= image.y + image.height
        );

        if (draggingImage) {
            offsetX = mouseX - draggingImage.x;
            offsetY = mouseY - draggingImage.y;
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
        }
    });

    function onMouseMove(event) {
        if (draggingImage) {
            draggingImage.x = event.offsetX - offsetX;
            draggingImage.y = event.offsetY - offsetY;
            constrainImage(draggingImage);
            drawCanvas();
        }
    }

    function onMouseUp() {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
    }
/*Funcion para que las imagenes no salgan del lienzo*/
    function constrainImage(image) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        if (image.x < 0) image.x = 0;
        if (image.y < 0) image.y = 0;
        if (image.x + image.width > canvasWidth) image.x = canvasWidth - image.width;
        if (image.y + image.height > canvasHeight) image.y = canvasHeight - image.height;
    }

    canvas.addEventListener('dblclick', function (event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const clickedImage = images.find(image =>
            mouseX >= image.x && mouseX <= image.x + image.width &&
            mouseY >= image.y && mouseY <= image.y + image.height
        );

        if (clickedImage) {
            if (firstClickedImage) {
                const line = {
                    startImage: firstClickedImage,
                    endImage: clickedImage
                };
                lines.push(line);
                updateDropdown();
                drawCanvas();
                firstClickedImage = null;
            } else {
                firstClickedImage = clickedImage;
            }
        }
    });
//Selector de un objeto al ser seleccionado mediante el despliegue de la lista
    objectDropdown.addEventListener('change', function () {
        const selectedId = objectDropdown.value;
        if (selectedId.startsWith('line-')) {
            selectedLine = parseInt(selectedId.split('-')[1]);
            selectedImage = null;
        } else {
            selectedImage = images.find(image => image.id === selectedId);
            selectedLine = null;
        }
        drawCanvas();
    });
    /*Seccion de los botones acctivados por medio de un click, para proceder con su respectivo evento*/
    deleteButton.addEventListener('click', removeSelectedObject);
    deleteAllButton.addEventListener('click', removeAllObjects);
    saveButton.addEventListener('click', saveCurrentState);
    loadButton.addEventListener('click', loadSavedState);

    // Llamado a la funcion initial drawing
    drawCanvas();
});
