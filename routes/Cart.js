const router=require('express').Router();
const User = require('../models/user');
const Product=require('../models/Product');
const Cart=require("../models/Cart");
const mongoose=require('mongoose');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifytoken");

router.post("/newcart",verifyToken,async(req,res)=>
    {  try{
        const newCart = await Cart.create({
            userId :req.body.userId,
            products: req.body.products
        })
            res.status(200).json(newCart);
            console.log("New Cart created!!");
            } 
             catch (error) {
            console.log(error.message)
            res.status(500).json({message: error.message})
            
        }
    }
        )


router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>
    { 
        try {
            const id= req.params.id;
            console.log(id);
            console.log(req.body);
            const updatedCart= await Cart.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

router.delete("/:id",verifyTokenAndAdmin, async (req,res)=>
    { 
        try {
            
            await Cart.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Product has been deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/getcart/:id",verifyTokenAndAuthorization, async (req,res)=>
    { 
        try {
            
            const Cart=await Cart.findOne({userId:req.params.userId});
            res.status(200).json(Cart);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/", verifyTokenAndAdmin,async (req,res)=>
    { 
        try {
            const carts=await Cart.find();
            res.status(200).json(carts);
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }  
    )

module.exports=router;