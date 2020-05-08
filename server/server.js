require('./config/config')
const express = require('express')
const mongoose = require('mongoose');

const app = express()


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