require('dotenv').config();
const express = require('express');
const plaid = require('plaid');
const qs = require('./PlaidModel.js');

const router = express.Router();

const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Plaid Quickstart'}
)

router.post('/token_exchange', async (req,res)=>{

    const {publicToken} = req.body;
    const {userid} = req.body;

    try{

        const {access_token} = await client.exchangePublicToken(publicToken)

        const Accessid = await qs.add_A_Token(access_token, userid)

        const {item} = await client.getItem(access_token)

        const Itemid = await qs.add_An_Item(item.item_id, userid)
        
        res.status(201).json({
            AccessidMade:Accessid,
            ItemidMade:Itemid,
            theToken:access_token,
            ThePlaidItemid: item.item_id})
        
    }
    catch(err){
        console.log("access",err)
    }
})

module.exports = router;