const express = require("express")
const port = 3333

const cors = require("cors")
const bodyParser = require("body-parser")


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
// app.use(express.urlencoded({extended:true}))  
app.use("/api/vabsolutions", (require("./router/router")))
app.listen(port,()=>{
    console.log("listening to port", port)
}) 