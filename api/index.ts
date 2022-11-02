
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { Stripe } from 'stripe'
 
const stripe = new Stripe('#Your Secret Key',  {
    apiVersion: '2022-08-01',
    typescript: true
  })
 
 const app = express()
 app.use(cors())
 app.use(express.json())
  
interface Product {
    description: string,
    amount: number
}

app.get('/pay', async (req: Request, res: Response,) => {
    
  
    console.log("========= payment initiate ==============")


     try {
         const customer = await stripe.customers.create();
         const ephemeralKey = await stripe.ephemeralKeys.create(
          {customer: customer.id},
          {apiVersion: '2022-08-01'}
        );

         console.log('Customer Created.....')
        //  console.log(customer)
         
         const paymentIntent = await stripe.paymentIntents.create({
             amount:100 * 100,
             currency: 'USD',
             customer: customer.id,
             automatic_payment_methods: {
              enabled: true,
            },
          })

         console.log("charge response")
        //  console.log(paymentIntent)
           
         
      
         res.json({
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
        });         
     } catch (err) {
         console.log("=========================================== error ==========================")
        console.log(err)
        res.json(err)
     }
  
})

app.listen(8000, () => {
    
    console.log('Listening to port 8000')
})
