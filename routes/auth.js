//rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesíon
//api/auth
router.post('/', 
    /* [
        check('email', 'Agrega un email valido').not().isEmpty(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ], */
    authController.autenticarUsuario
);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;