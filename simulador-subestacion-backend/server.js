const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para manejar solicitudes POST con JSON
app.use(bodyParser.json());

// Ruta para manejar el inicio de sesión (simulando con datos estáticos)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Aquí se valida al usuario con base de datos o almacenamiento adecuado
    if (email === 'usuario@example.com' && password === '123456') {
        // Enviar un correo de notificación cuando el usuario inicie sesión
        sendLoginNotification(email);
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
        return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }
});

// Función para enviar el correo de notificación
function sendLoginNotification(email) {
    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Para Gmail
        auth: {
            user: 'tu_correo@gmail.com', // Aquí va correo de Gmail
            pass: 'tu_contraseña_de_correo' // Aquí va la contraseña
        }
    });

    /* Para el correo institucional
    const transporter = nodemailer.createTransport({
        service: 'Outlook', // de Microsoft365
        auth: {
            user: 'tu_correo@institucion.com', // Aquí va el correo institucional
            pass: 'tu_contraseña_de_correo' // Aquí va la contraseña
        }
    });*/

    /* Configuracion SMTP de Outloook
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // TLS
        auth: {
            user: 'tu_correo@institucion.com', // Correo institucional
            pass: 'tu_contraseña_de_correo' // Contraseña
    }
});
*/

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo: ', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});