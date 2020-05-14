const express = require('express')
const fs = require('fs')
const path = require('path')

const { verificaTokenImg } = require('../middlewares/autenticacion')

app = express()


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res)=>{

    let tipo = req.params.tipo
    let img = req.params.img

 
    let noImagePath = path.resolve(__dirname, '../assets/noimg.jpg')   //creamos el path absoluto para la imagen por default

    let ImagePath = path.resolve( __dirname ,`../../uploads/${tipo}/${img}`) //creamos el path absoluto para la imagen solicitada

    if( fs.existsSync(ImagePath) ){
        res.sendFile(ImagePath)
        return
    }   
   
    res.sendFile(noImagePath)

})

module.exports = app
