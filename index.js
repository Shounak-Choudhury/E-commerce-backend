const express = require('express');
const mongoose= require('mongoose');
const app=express();
const dotenv = require('dotenv');
const userRoute=require('./routes/user');
const authRoute=require('./routes/auth');
const productRoute=require('./routes/Product');
const cartRoute=require('./routes/Cart');
const orderRoute=require('./routes/Order');
dotenv.config();
const stripeRoute=require('./routes/stripe');
const cors=require('cors');
app.use(cors());
try {
    mongoose.connect('mongodb+srv://Root:kgILypQu5AvRe3Ng@cluster0.acvn3t4.mongodb.net/').then(()=>console.log("mongoDB connected"));
} catch (error) {
    console.log(error);
}

app.use(express.json());


app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/order',orderRoute);
app.use('/api/bills',stripeRoute);



app.listen(process.env.PORT||3000,()=>{console.log("Listening on port 3000")});
