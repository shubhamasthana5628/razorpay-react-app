const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.post('/order',(req,res)=>{
    const razorpay = new Razorpay({
        key_id: 'rzp_test_KoaifAEAFX9DHJ',
        key_secret: 'VwrEnkOQY1WPa8f9YwHXfung'
    })
    const payload = req.body;
    razorpay.orders.create(payload).then((order)=>{
        res.json(order)
    }).catch((err)=>{
        return res.status(500).send({"error": err });
    })
});

app.post('/order/validate',(req,res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    const sha = crypto.createHmac("sha256","VwrEnkOQY1WPa8f9YwHXfung");
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if(digest !== razorpay_signature) {
        return res.status(400).json({msg: "Transaction Failed!"})
    }
    res.json({
        message: "Payment done!",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id

    })
});
app.listen(port || 5000, ()=>{
    console.log("Server started in port:", port);
})