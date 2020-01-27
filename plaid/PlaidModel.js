const db = require('../data/config/db-config.js');

const data = require('./data.js');


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

const sortCategory=(TransactionItem)=>{

    var i;
    for(i=0;i<=(data.length-1); i++){

        let found = data[i].codes.find((code)=>{
            if(TransactionItem == code){
                return code
            }else{
                return null
            }
        })

        if(found){
            
            return data[i].id
        }
    }
}

const insert_transactions = (trans)=>{
    return db('budget_item')
    .returning('id')
    .insert({
        name:trans.name, 
        amount:trans.amount, 
        payment_date:trans.date,
        category_id:sortCategory(trans.category_id)})
}

const link_user_categories = (Categoryid,Userid)=>{

     return db('user_category')
        .insert({category_id:Categoryid, user_id:Userid})
}

module.exports = {
    add_A_Token,
    add_An_Item,
    insert_transactions,
    link_user_categories
}