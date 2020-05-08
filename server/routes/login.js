const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
const Usuario = require('../models/usuario')
const bodyParser = require('body-parser') 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))



app.post('/login', (req, res)=>{

    let body = req.body

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                mensaje: '(usuario) o contrasena incorrecto'
            })
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){  //la funcion compareSync compara los encriptados 
            return res.status(400).json({
                ok:false,
                mensaje: 'usuario o (contrasena) incorrecto'
            }) 
        }

        let token = jwt.sign({
            usuario: usuarioDB,                
        }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN})  //expira en 30 dias

        res.json({
            ok:true,
            usuarioDB,
            token
        })

    })

})

















module.exports = app