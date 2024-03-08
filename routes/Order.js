const router=require('express').Router();

const Product=require('../models/Product');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifytoken");
const Order = require('../models/Order');

router.post("/neworder",verifyTokenAndAuthorization,async(req,res)=>
    {  try{
        const newOrder = await Order.create({
            userId:req.body.userId,
            amount:req.body.amount,
            products:req.body.products,
            address:req.body.address,
            status:req.body.status,
        })
            res.status(200).json(newOrder);
            console.log("New Order created!!");
            }
             catch (error) {
            console.log(error.message)
            res.status(500).json({message: error.message})
            
        }
    }
        )





router.get("/income", verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth= new Date(new Date().setMonth(lastMonth.getMonth()-1));


    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte:previousMonth}}},
            {$project:{month:{$month:"$createdAt"},sales:"$amount"}},
            {$group:{_id:"$month",total:{$sum:"$sales"}}}
        ])
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({message:error.message});
    }}
);

router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>
    { 
        try {
            const id= req.params.id;
            console.log(id);
            console.log(req.body);
            const updatedOrder= await Order.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

router.delete("/:id",verifyTokenAndAdmin, async (req,res)=>
    { 
        try {
            
            await Order.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Product has been deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/specify/:id", async (req,res)=>
    { 
        try {
            
            const order=await Order.findById(req.params.id);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/",verifyTokenAndAdmin ,async (req,res)=>
    {   
        try {
            const orders=await Order.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
    )

module.exports=router;