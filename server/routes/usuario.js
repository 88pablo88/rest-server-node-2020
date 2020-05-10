const express = require('express')
const app = express()
const bodyParser = require('body-parser') //paquete para obtener la info del cuerpo del postman? 
const bcrypt = require('bcrypt')  //paquete para encriptar contrasenas
const _ = require('underscore')  //la libreria underscoreJS nos va a ayudar a seleccionar solos los elementos de un objeto que queremo modificar
const Usuario = require('../models/usuario')
const {verificaToken, verificaUser} = require('../middlewares/autenticacion')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 

// parse application/json
app.use(bodyParser.json())   //app.use son midlewares


app.get('/usuario', verificaToken, (req, res)=>{

    
    let desde = req.query.desde || 0;   //extrae el parametro pasado via query en la url "usuarios?desde=5"
    desde = Number(desde)
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta)

    const condiciones = {
        estado:true
    }

    Usuario.find(condiciones, 'nombre email role estado google img')  //en el primer parametro puedo pasar el valor de una propiedad por ejemplo filtrar los que sean estado:true, el segundo parametro es un string que va a filtrar las los campos devueltos de cada registro, no filtra registros, solo sus campos
           .skip(desde)  //salta los primeros "desde" (numero entero pasado como parametro) resultados
           .limit(hasta) //limita las busquedas al numero pasado como parametro
           .exec((err, usuarios)=>{             
               if(err){
                   return res.status(400).json({
                       ok:false,
                       err
                   })
               }

               Usuario.count(condiciones, (err, conteo)=>{   //conteo cuenta los registros que cumplen con la condicion del filtro
                res.json({
                    ok:true,
                    usuarios,
                    usuariosActivos: conteo
                })
               })
               
           })
  })

  
app.post('/usuario', [verificaToken, verificaUser], (req, res)=> {
  
   let body = req.body

   let usuario = new Usuario({  //creamos una instancia de nuestro modelo de usuario para grabarla en la base de datos
       nombre: body.nombre,
       edad: body.edad,
       email: body.email,
       role: body.role,
       password:  bcrypt.hashSync(body.password, 10)   
   })

   usuario.save( (error, usuarioDB) =>{  //la funcion save (de mongoose), recibira como parametro un callback con dos parametros, un error si existe, o el usuario a grabar en la base de datos

        if(error){
        return res.status(400).json({
                ok:false,
                error
            })
        }

    res.json({      //el status no se envia porque esta implicito
        ok: true,                   //las propiedades del objeto json son configurables, aca se asignaron la prop 'ok' y 'usuario'
        usuario: usuarioDB
    })



   }
   )     
  
     })
  

     app.put('/usuario/:id',  function(req, res) {

        let id = req.params.id;
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
    
    
            res.json({
                ok: true,
                usuario: usuarioDB
            });
    
        })
    
    });
    
  
/*app.put('/usuario/:id',  (req, res)=>{  //put actualiza datos

  
      let id = req.params.id
      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])  //la funcion pick de underscore filtra solo las propiedades elegidas en el array del objeto

      Usuario.findByIdAndUpdate(id,     //findByIdAndUpdate es un metodo de mongoose los parametros que recibe son
                                body,   //el id a buscar, el objeto a modificar, 
                                {new:true, runValidators:true}, //un objeto con opciones (aca usamos la opcion new, para que se imprima el objeto actualizado, y runvalidators ers para que se ejecuten las validaciones del configuradas en el modelo)
                                (error, usuarioDB)=>{   // y un callback   
                                    
            console.log(id);
                    
            console.log(body);
            
                    
            console.log(usuarioDB);

           
            if(error){
                return res.status(400).json({
                    ok:false,
                    error
                })
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            })
      })
      

    })*/
  
  
app.delete('/usuario/:id',  [verificaToken, verificaUser],function (req, res) {  //put actualiza datos
      
    let body = req.body
    let id = req.params.id

    const cambiaEstado = {
        estado:false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, usuarioAnulado)=>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            })
        }

        if(!usuarioAnulado){
            res.status(400).json({
                ok:false,
                err: "el usuario no existe"
            })
        }

        res.json({
            ok:true,
            usuarioAnulado
        })
    })


    /***Eliminar el usuarui de la base de datos***/

   /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if(err){
            return res.status(400).json(
                {ok:false,
                err}
            )
        }

        if(!usuarioBorrado){
            return res.status(400).json(
                {ok:false,
                err: 'usuario no encontrado'}
            )
        }

        res.json({
            ok:true,
            usuarioBorrado
        })

    })*/

  })  



module.exports = app