const express = require("express")
const axios = require("axios")

const app = express()

app.use(express.json())

const TOKEN = "SEU_TOKEN_MERCADOPAGO"
const MTA_SERVER = "http://SEU_IP_MTA:22005/coinpayment"

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
