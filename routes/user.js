const router=require('express').Router();
const user = require('../models/user');
const User=require('../models/user');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifytoken");


router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,  // Exclude _id field
                    month: "$_id",  // Rename _id to month
                    total: 1
                }
            },
            {
                $sort: {
                    month: 1  // Sort by month in ascending order
                }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>
    { if(req.body.password)
        {req.body.password=CryptoJS.AES.encrypt(req.body.password,"hgiufhrwoijcjvj").toString()
    }
        try {
            const id= req.params.id;
            console.log(id);
            console.log(req.body);
            const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>
    { 
        try {
            
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"User has been deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/:id",verifyTokenAndAdmin, async (req,res)=>
    { 
        try {
            
            const user=await User.findById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/",verifyTokenAndAdmin, async (req,res)=>
    {   const query= req.query.new 
        try {
            //query? await User.find().sort({_id:-1}).limit(1):
            const users= query? await User.find().sort({_id:-1}).limit(5): await User.find() ;
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

module.exports=router;

