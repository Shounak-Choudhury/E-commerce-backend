const router=require('express').Router();
const User = require('../models/user');
const Product=require('../models/Product');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifytoken");

router.post("/newproduct",verifyTokenAndAdmin,async(req,res)=>
    {
        try {

            const newProduct= await Product.create({
                title:req.body.title,
	            desc:req.body.desc,
	            img:req.body.img,
	            categories:req.body.categories,
	            size:req.body.size,
	            colour:req.body.colour,
	            price:req.body.price
            } )
            res.status(200).json(newProduct)
            console.log("New product created!!"+req.body);
            }
             catch (error) {
            console.log(error.message)
            res.status(500).json({message: error.message})
            
        }
    }
)





router.get("/productstats", verifyTokenAndAdmin, async (req, res) => {
    try {
        const data = await Product.aggregate([
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
    { 
        try {
            const id= req.params.id;
            console.log(id);
            console.log(req.body);
            const updatedProduct= await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

router.delete("/:id",verifyTokenAndAdmin, async (req,res)=>
    { 
        try {
            
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Product has been deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/find/:id", async (req,res)=>
    { 
        try {
            
            const product=await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

    router.get("/", async (req,res)=>
    {   const qNew= req.query.new ;
        //const query=req.query.new;
        const qCategory=req.query.category;
        try {
            let products;
            //query? await User.find().sort({_id:-1}).limit(1):
            //const products= query? await Product.find().sort({price:-1}).limit(5): await Product.find() ;
            if(qNew)
            {products= await Product.find().sort({createdAt: -1}).limit(5);}
            else if(qCategory)
            {products=await Product.find({categories:{$in:[qCategory]}})}
            else
            {products = await Product.find();}
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({message: error.message});
            
        }
    }
    )

module.exports=router;