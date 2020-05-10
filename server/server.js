require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const path = require('path') //paquete de node

const app = express()


//habilitar carpeta public 
app.use( express.static( path.resolve(__dirname , '../public' ) ) )


//referencia global de rutas
app.use( require('./routes/index') )

 
mongoose.connect(process.env.urlDB ,
                 {useNewUrlParser: true, useCreateIndex:true},   
                (err, res)=>{
    if(err){
        throw new Error(err)
    }
    else{
        console.log('base de datos ONLINE');
    }
})

app.listen(process.env.PORT, ()=>{console.log(`Escuchando el puerto ${process.env.PORT}`)})