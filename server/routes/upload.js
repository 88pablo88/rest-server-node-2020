const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs')  //importo file system (propio de node)
const path = require('path') //importo el paquete path (propio de node)


const Usuario = require('../models/usuario') 
const Producto = require('../models/productos')

app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
                  .json({
                      ok:false,
                      message:'No files were uploaded.'});
      }
   
  //validar tipos    
    
   let tiposValidos = ['productos', 'usuarios']
   
   if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
        err:{
            message: 'las tipos permitidos son: ' + tiposValidos.join(', '),

        }
    })
   }


    
    
  // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.')

    let extension = nombreCortado[nombreCortado.length - 1]

  //extensiones permitidas

  const extensionesValidas = ['jpg', 'png', 'gift', 'jpeg']

  if( extensionesValidas.indexOf(extension) < 0){
      return res.status(400).json({
          err:{
              message: 'las extenciones permitidas son: ' + extensionesValidas.join(', '),
              ext: extension
              
          }
      })
  }

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err)=> {
    if (err){
      return res.status(500).json({
          ok:false,
          err});}

   //aqui la imagen ya se cargo   

   if(tipo === 'usuarios'  ){  //['productos', 'usuarios']
        imagenUsuario(id, res, nombreArchivo)
    }

    if(tipo === 'productos'){
        imagenProducto(id, res, nombreArchivo )
    }

    //res.json({ok:true, message:'File uploaded!'});
  });

})

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB)=>{

        if(err){
            if(err){
                borraImagen(`${nombreArchivo}`, 'usuarios')  
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
        }

        if(!productoDB){
            borraImagen(`${nombreArchivo}`, 'usuarios')     
             return res.status(400).json({
                 ok:false,
                 err:{
                     message:'el producto no existe'
                 }
             })
         }

         borraImagen(`${productoDB.img}`, 'productos')

         
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado)=>{

            res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })


    })

}


function imagenUsuario(id, res, nombreArchivo){


    Usuario.findById(id, (err, usuarioDB)=>{

        if(err){
            borraImagen(`${nombreArchivo}`, 'usuarios')  
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
           borraImagen(`${nombreArchivo}`, 'usuarios')     
            return res.status(400).json({
                ok:false,
                err:{
                    message:'el usuario no existe'
                }
            })
        }

       // let pathImagen = path.resolve( __dirname ,`../../uploads/usuarios/${usuarioDB.img}.${extension}`)  //almacenamos el path de la imagen 

         
      //  if( fs.existsSync(pathImagen) ){ //retorna true si existe el archivo en el path pasado como argumento

                  
           // fs.unlinkSync(pathImagen)  //borra el archivo del path pasado como argumento

      //  }

    
        borraImagen(`${usuarioDB.img}`, 'usuarios')


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado)=>{

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })
}



function borraImagen(nombreImagen, tipo){

    let pathImagen = path.resolve( __dirname ,`../../uploads/${tipo}/${nombreImagen}`)

    if( fs.existsSync(pathImagen) ){
    
        fs.unlinkSync(pathImagen)
    
    }    
}



module.exports = app