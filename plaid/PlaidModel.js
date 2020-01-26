const db = require('../data/config/db-config.js');


const add_A_Token = (token, Userid)=>{

    return db('access')
    .returning('id')
    .insert({access_token:token, user_id:Userid})
    .then(ids=>{
        return ids[0]
    })
}

const add_An_Item = (Itemid, Userid)=>{
    return db ('item')
    .returning('id')
    .insert({item_id: Itemid, user_id:Userid})
    .then(ids=>{
        return ids[0]
    })
}

module.exports = {
    add_A_Token,
    add_An_Item
}