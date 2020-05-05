//configuramos el puerto

process.env.PORT = process.env.PORT || 3000


//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//Base de datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else{
    urlDB = 'mongodb+srv://Pablo:Wx3ON6uANP5ThksD@cluster0-q2ikz.mongodb.net/Cafe'
}

process.env.urlDB = urlDB  // asignamos al objeto global process la propiedad urlDB