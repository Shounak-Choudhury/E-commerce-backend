const router =require("express").Router();
const stripe = require("stripe")(process.env.stripetest_key);

router.post('/payment', (req,res)=>
    {
        stripe.charges.create(
            {
                source: req.body.tokenID,
                amount : req.body.amount,
                currency: "inr",
            }),
            (stripeErr,stripeRes)=>{
                if(stripeErr)
                 {res.status(500).json({message:stripeErr.message});}
                else
                 {res.status(200).json(stripeRes);}
            }
    })


module.exports= router;