const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()


const Producto = require('../models/productos')





app.get('/producto', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde)
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta)

    Producto.find({disponible:true})
            .skip(desde)
            .limit(hasta)
            .populate( 'usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    productos
                })
            })

})


app.get('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                if(!productoDB){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message:'el id no existe'
                        }
                    })
                }

                res.json({
                    ok:true,
                    producto:productoDB
                })
                
            })
    
})

//buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino

    let regex = new RegExp(termino)

    Producto.find({nombre:regex})
            .populate('categoria', 'nombre')
            .exec((err, productoDB)=>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    producto: productoDB
                })
            })
})



//Crear productos

app.post('/producto', verificaToken, (req, res)=>{

    let body = req.body

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        disponible : body.disponible,
        categoria: body.categoria
    })

    
    producto.save((err, productoDB) =>{
        if(err){
        return res.status(500).json({
                ok:false,
                err
            })
        }

        res.status(201).json({
            ok:true,
            productoDB
        })
    })    


})




app.put('/producto/:id', verificaToken, (req, res)=>{

    let id = req.params.id

    let body = req.body

    let descProducto = {
        descripcion: body.descripcion,
        nombre: body.nombre
    }

    Producto.findByIdAndUpdate(id, descProducto,  { new: true, runValidators: true }, (err, productoDB) =>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'no existen productos para el id ingresado'
                }
        })

        }
        
        res.json({
            ok:true,
            producto: productoDB
        })
    })

})

app.delete('/producto/:id', verificaToken, (req, res)=>{

    let id = req.params.id

    Producto.findById(id, (err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'el id no existe'
                }
            })
        }

        productoDB.disponible = false

        productoDB.save((err, productoBorrado)=>{
            if(err){
              return res.status(500),json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                producto:productoBorrado,
                mensaje: `${productoBorrado.nombre} borrado`
            })

        })



    })
})


module.exports = app

// nombre: { type: String, required: [true, 'El nombre es necesario'] },
// precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
// descripcion: { type: String, required: false },
// disponible: { type: Boolean, required: true, default: true },
// categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
// usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }