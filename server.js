const express = require("express")
const axios = require("axios")

const app = express()

app.use(express.json())

const TOKEN = "APP_USR-7636085536418940-031716-2a3ba784355f46cc7ce1c98dbc4d65e0-3050749506"
const MTA_SERVER = "http://10.0.0.103:22003/coinpayment"

app.post("/webhook", async (req,res)=>{

const paymentId = req.body?.data?.id

if(!paymentId){
return res.sendStatus(200)
}

try{

const response = await axios.get(
`https://api.mercadopago.com/v1/payments/${paymentId}`,
{
headers:{
Authorization:`Bearer ${TOKEN}`
}
}
)

const payment = response.data

if(payment.status === "approved"){

const ref = payment.external_reference

const [serial,coins] = ref.split(":")

await axios.get(`${MTA_SERVER}?serial=${serial}&coins=${coins}`)

console.log("Pagamento aprovado")

}

}catch(e){

console.log(e)

}

res.sendStatus(200)

})

app.listen(3000,()=>{
console.log("Webhook rodando")
})
