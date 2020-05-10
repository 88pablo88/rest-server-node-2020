const mongoose = require('mongoose')    //
const uniqueValidator = require('mongoose-unique-validator')  //paquete para validar que los valores ingresados sean unicos


let Schema = mongoose.Schema;

const rolesValidos = {
    values: ['USER', 'ADMIN', 'USER_ROL'],                //la propiedad values debe llevar ese nombre
    message: '{VALUE} no es un rol valido'  //la propieda message debe llevar ese nombre, y {VALUE} inyecta el valor ingresado por el usuario den el mesaje de error
}

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,     //este campo se asegura que no existan dos usuarios con el mismo valor en el campo email  
        required: [true, 'El email es necesario']
    },
    password:{
        type: String,
        required: [true, 'El pass es necesario']
    },
     img:{
         type: String,
         require: false,
     }, 
     role:{
         type:String,
         default: 'USER_ROL',
         enum: rolesValidos    //la propiedad enum permite enumerar valores permitidos para este campo
     },
     estado: {
         type: Boolean,
         default: true
     }, 
     google:{
         default:false,
         type: Boolean},

})

//Borramos la contrasena de la impresion de pantalla
usuarioSchema.methods.toJSON = function(){    //el metodo toJSON siempre se llamam antes de una impresion en pantalla, podemos modificarlo
    let user = this;                          //para que antede de mandar dicha impresion borre la contrasena 
    let objectUser = user.toObject();
    delete objectUser.password

    return objectUser
}


usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe ser unico'} )  //la funcion plugin pertenece a mongoose
                                                                             //uniqueValidator es la instancia creada
                                                                             //{PATH} es la forma en que identifica de donde viene la duplicacion (el email en este ejemplo)           

module.exports = mongoose.model('Usuario', usuarioSchema)