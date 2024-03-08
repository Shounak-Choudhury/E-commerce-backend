const router=require('express').Router();
const User=require('../models/user');
const cookieParser=require('cookie-parser');
const CryptoJS=require("crypto-js");
const jwt=require('jsonwebtoken');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifytoken");
router.use(cookieParser());

router.post('/register',async(req,res)=>
    {
        try {

            const newUser= await User.create({
                username:req.body.username,
                email: req.body.email,
                password: CryptoJS.AES.encrypt(req.body.password,"hgiufhrwoijcjvj").toString(),

            });
           
            res.status(200).json(newUser)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({message: error.message})
            
        }
        
    }
)

router.post("/login",async(req,res)=>
    {
        try {
            const user= await User.findOne({username: req.body.username});
            !user && res.status(401).json("Wrong credentials");

            const password1= req.body.password;
            
            
            const OriginalPassword = CryptoJS.AES.decrypt(user.password,"hgiufhrwoijcjvj").toString(CryptoJS.enc.Utf8);

            //console.log(password1+" / "+OriginalPassword);
            if(password1!== OriginalPassword)
             {res.status(401).json("Wrong credentials");}

            const accessToken = jwt.sign({
                id:user._id,//payloads 
                isAdmin:user.isAdmin,//payload
            },"uygferuiheio",{expiresIn:"3d"})

            res.cookie("login",accessToken,{
                expires:new Date(Date.now()+50000),
                httpOnly:true            
            })

            res.status(200).json({user, accessToken});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
)

router.get('/logout',verifyTokenAndAuthorization,async (req,res)=>
    {   
        res.cookie('login','',{maxAge:1});
        const accessToken = {expiresIn:"1s"};

        res.json({message:"User logged out"});
    }
)



module.exports=router;