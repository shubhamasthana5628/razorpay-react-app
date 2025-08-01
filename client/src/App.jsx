import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const dummyData = [{title: 'Data1',price:500,description:'This is description for data1'},{title: 'Data2',price:1000,description:'This is description for data2'},{title: 'Data3',price:2000,description:'This is description for data3'},
    {title: 'Data4',price:3000,description:'This is description for data4'},{title: 'Data5',price:4000,description:'This is description for data5'}
  ]

  const handlePayment = async (cardData)=>{
    const response = await fetch("http://localhost:5000/order",{
      method: "POST",
      body: JSON.stringify({
        amount: cardData.price,
        currency: 'INR',
        receipt: 'qwsaq1'
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const order = await response.json();
    debugger;
    var options = {
      "key": "rzp_test_KoaifAEAFX9DHJ", // Enter the Key ID generated from the Dashboard
      "amount": cardData.price, // Amount is in currency subunits.
      "currency": "INR",
      "name": "Acme Corp", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": async function (response){
        const validateResponse = await fetch("http://localhost:5000/order/validate",{
          method: "POST",
          body: JSON.stringify(response),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const jsonRes = await validateResponse.json();
        console.log(jsonRes);
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          "name": "GUVU", //your customer's name
          "email": "GUVI-test-email", 
          "contact": "+911234567890"  //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "GUVI Corporate office"
      },
      "theme": {
          "color": "#3399cc"
      }
  };
  var rzp1 = new window.Razorpay(options);
  rzp1.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
  });
  rzp1.open();
  }

  return (
    <>
      <h1>Data View</h1>
      <section className='card-wrapper'>
        {
          dummyData.map((value, key)=>{
            return (
              <section className='card'>
                <div><b>Title:</b> {value.title}</div>
                <div><b>Description:</b>{value.description}</div>
                <div><b>Price:</b>{value.price}</div>
                <button onClick={()=>{handlePayment(value)}}>Buy Now</button>
              </section>
            )
          })
        }
      </section>
      
    </>
  )
}

export default App
