const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 



const {OAuth2Client} = require('google-auth-library') //npm install google-auth-library --save
const client = new OAuth2Client(process.env.CLIENT_ID)


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


//login con google sign-in


//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }

  }
 // verify().catch(console.error);


 app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            }

        } else {
            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
         
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });


            });

        }


    });


});
  

/*app.post('/google', async(req, res)=>{

    let token = req.body.idtoken

    let googleUser = await verify(token)
                            .catch(e =>{
                                return res.status(403).json({
                                    ok:false,
                                    err: e
                                })
                            })


    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{  //buscamos en la base de datos la existencia del usuario ingresado
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(usuarioDB){  //si existe algun usuario de base de datos con este mail
               if(usuarioDB.google === false){  //verificamos que usuario no haya sido creado por google sign in
                    return res.status(400).json({ //en caso de que no
                        ok:false,
                        err:{
                            message: "La autenticacion de este usuario no fue creada con perfil de google"
                        }
                    })
               }
               else{ //en caso de que si renovamos las credenciales del usuario
                let token = jwt.sign({
                    usuario: usuarioDB,                
                }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN})  //expira en 30 dias
        
              return  res.json({
                    ok:true,
                    usuarioDB,
                    token
                })
               } 
        }
        else{ //si no existen usuarios en la base de datos con este mail, primera autenticacion

            let usuario = new Usuario()

            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)'

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(400).json({
                            ok:false,
                            error
                        })
                    }
                let token = jwt.sign({
                    usuario: usuarioDB,                
                }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN})  //expira en 30 dias    

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token:token
                })    
            })

        }
    })

});*/






module.exports = app