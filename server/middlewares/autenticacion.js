const jwt = require('jsonwebtoken')



//verificar token

let verificaToken = (req, res, next)=>{   //este middleware recibe tres parametros, el ultimo 
                                            //es la funcion next() que permite continuar la ejecucion del codigo
                                             //desde donde fue llamado el middleware (app.get en este caso)


let token = req.get('authorization'); //obtenemos el token del header  

     
jwt.verify(token, process.env.SEED , (err, decode)=>{  //la func verify recibe como parametros el token, el seed de prodiccion, y un callback con el error y el payload decodificado

    if(err){
        return res.status(401).json({
            ok:false,
            err
        })
    }

    req.usuario = decode.usuario  //si la autenticacion es correcta se agrega al objeto req la propiedad usuario
                                   //que va a ser igual a la propiedad usuario de obejto decode 
})

next()

};


//verifica user type

let verificaUser = (req, res, next)=>{

    let usuario = req.usuario

    if(usuario.role !== 'ADMIN' ){
        return res.status(401).json({
            ok:false,
            err: "Usuario no autorizado"
        })
    }

    next()
}




module.exports = {
    verificaToken,
    verificaUser
}