const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

exports.crearUsuario =  async (req, res) =>{

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty () ) {
        return res.status(400).json({errores: errores.array()})
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que el usauiro sea unico
        let usuario  = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({msg: 'El Usuario ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guarda el usuario
       await usuario.save()

       //crear y firmar el JWT
       const payload = {
            usuario: {
                id: usuario.id
            }
       };

       //firmar el JWT
       jwt.sign(payload, process.env.SECRETA, {
           expiresIn: 3600 //1 hora
       }, (error, token) => {
           if(error) throw error;
        
              //mensaje de confirmacion
              res.json({ token });
       });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo error');
    }
}