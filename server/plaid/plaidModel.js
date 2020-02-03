const db = require("../data/db-config.js");

const data = require("./data.js");

const add_A_Token = (token, Userid) => {
  return db("users_accessToken")
    .returning("id")
    .insert({ access_token: token, user_id: Userid })
    .then(ids => {
      return ids[0];
    });
};

const add_An_Item = (Itemid, Userid) => {
  return db("item")
    .returning("id")
    .insert({ item_id: Itemid, user_id: Userid })
    .then(ids => {
      return ids[0];
    });
};

const sortCategory = TransactionItem => {
  var i;
  for (i = 0; i <= data.length - 1; i++) {
    let found = data[i].codes.find(code => {
      if (TransactionItem == code) {
        return code;
      } else {
        return null;
      }
    });

    if (found) {
      return data[i].id;
    }
  }
};

const insert_transactions = (trans, Userid) => {
  return db("budget_item")
    .returning("id")
    .insert({
      name: trans.name,
      amount: trans.amount,
      payment_date: trans.date,
      category_id: sortCategory(trans.category_id),
      user_id:Userid
    });
};

const link_user_categories = (Categoryid, Userid) => {
  return db("user_category")
  .insert({category_id: Categoryid,user_id: Userid
  });
};

//reserved for PLAID middleware
const getAccessToken = (Userid)=>{

  return db('db')
  .select('access_token')
  .from('users_accessToken')
  .where({user_id:Userid})
  .first()

}

const WEB_get_pg_itemid = (plaidItemId)=>{

  return db('db')
  .select('id')
  .from('item')
  .where('item_id', plaidItemId)
  .first()
}

const WEB_get_userID = (plaidItemId)=>{
  return db('db')
  .select('users.id')
  .from('item')
  .join('users', 'item.user_id', 'users.id')
  .where('item.item_id',plaidItemId)
  .first()
}

const WEB_track_insertion=(pgItemId,status)=>{
  return db('item_insertions')
  .returning('id')
  .insert({pg_item_id:pgItemId, status:status})
  .then(ids=>{
    return ids[0]
  })
}

const WEB_get_accessToken = (plaidItemId)=>{
  return db('db')
  .select("at.access_token")
  .from('item')
  .join('users as u','item.user_id', 'u.id')
  .join('users_accessToken as at', 'u.id', 'at.user_id' )
  .where("item.item_id", plaidItemId)
  .first()
}

const WEB_insert_transactions = async(list,Userid)=>{

  return Promise.all(list.map(async(trans)=>{
    const yeet = await insert_transactions(trans,Userid)
    return{...trans, yeet:'done'}
  }))

}

const INFO_get_status = (Userid)=>{

  return db('db')
  .select('*')
  .from('users')
  .join('item as i', 'users.id', 'i.user_id' )
  .join('item_insertions as II', 'i.id', 'II.pg_item_id')
  .where('users.id', Userid)
  .orderBy('II.id', 'desc')
  .first()
}

const INFO_get_categories = (Userid)=>{
  return db('db')
  .select('c.id', 'c.name', 'users.email')
  .from('users')
  .join('user_category as uc', 'users.id', 'uc.user_id')
  .join('category as c', 'uc.category_id', 'c.id')
  .where('users.id', Userid)
} 



module.exports = {
  add_A_Token,
  add_An_Item,
  insert_transactions,
  link_user_categories,
  getAccessToken,
  WEB_get_pg_itemid,
  WEB_get_userID,
  WEB_track_insertion,
  WEB_get_accessToken,
  WEB_insert_transactions,
  INFO_get_status,
  INFO_get_categories
};
