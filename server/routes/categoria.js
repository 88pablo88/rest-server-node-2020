const express = require('express');


let { verificaToken, verificaUser } = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });


});


app.put('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    let body = req.body;

    let decCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id , decCategoria, { new: true, runValidators: true }, (err, categoriaDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    } )
})


app.delete('/categoria/:id', [verificaToken, verificaUser], (req,res)=>{

   let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaDBborrada) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDBborrada) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: `categoria ${categoriaDBborrada} borrada`
        });

    })

})

app.get('/categoria', verificaToken, (req, res) =>{

    Categoria.find({})
             .sort('descripcion')  //ordena por el campo pasado como parametro
             .populate('usuario' , 'nombre email')  //populate trae datos de otras tablas desde los ObjectId
             .exec( (err, categorias) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } 
                res.json({
                    ok:true,
                    categorias
                })
             })
})


app.get('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
         
    })





module.exports = app

/*app.post('/categoria', verificaToken, (req, res)=>{

    let body = req.body

    let categoria = new Categoria({
        descripcion: body.categoria,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })

})*/