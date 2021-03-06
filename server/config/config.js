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
    urlDB = process.env.MONGO_URI    //MONGO_URI es una variable declarada en heroku
}                                    //heroku config para ver las variables de configuracion que tenemos
                                     //para configurar una variable: heroku config:set NOMBRE_DE_LA_VARIABLE="valor de la variable"
process.env.urlDB = urlDB  // asignamos al objeto global process la propiedad urlDB



//Expiracion del token 60segs * 60min * 24hs * 30*

process.env.CADUCIDAD_TOKEN =  '48h'   //Expira en 30 dias


//Configuracion del SEED de autenticacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-produccion'  //MONGO_URI es una variable declarada en heroku 



//google client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '701702362007-at269bq38ac21bi5qna5mfv4kkj8gpr8.apps.googleusercontent.com'
 