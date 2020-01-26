const express = require('express')
const router = express.Router()

const qs = require('./AuthModel.js');

router.post('/register', (req,res)=>{
    const body = req.body;

    qs.addUser(body)
    .then(id=>{
        res.status(200).json({id})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err})
    })

})

module.exports = router