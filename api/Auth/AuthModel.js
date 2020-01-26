const db = require('../../data/config/db-config.js')




const addUser = (user)=>{

    return db('users')
    .insert(user, 'id')
    
}

module.exports={
    addUser
}