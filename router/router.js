const sgMail = require("@sendgrid/mail")
require("dotenv").config()
const express = require("express") 
const router = express.Router()
const fs = require("fs")
const multer = require("multer");
const multerS3 = require("multer-s3-v2");
const AWS = require("aws-sdk");
const hogan = require("hogan.js")
const template = fs.readFileSync("./email/email.html", "utf-8")
const compiled = hogan.compile(template)
const clientTemplate= fs.readFileSync('./email/contacthostemail.html', "utf-8")
const compileclient= hogan.compile(clientTemplate)

sgMail.setApiKey( 
   process.env.GRIDKEY 
) 
AWS.config.update({
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_ACCESS_KEY, 
  });
  
  const spacesEndpoint = new AWS.Endpoint("fra1.digitaloceanspaces.com/stories");
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint, 
  });
   
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "polvote",
      acl: "public-read",
      key: function (request, file, cb) {
        console.log(file);
        cb(null, new Date().toDateString() + file.originalname);
      },
    }),
  });

router.post("/contact", async(req, res)=>{
    try {
        const {fullname, email, phone, message} = req.body


        const msg={
            to:email,
            from :"VAB Solutions <info@polvote.com>",
            subject:"Thanks for Contacting us",
            html:compiled.render({fullname:fullname})
        }
    sgMail.send(msg).then(()=>{

    }).catch((err)=>{
        console.log(err)
    })
        if(msg){
            const msg={
                to:"dicksoneneh47@gmail.com",
                from :"VAB Solutions <info@polvote.com>",
                subject:"Booked contact",
                html:compileclient.render({fullname:fullname, email:email, message:message, phone:phone})
            } 
            sgMail.send(msg).then(()=>{

            }).catch((err)=>{
                console.log(err)
            })
        }
        res.status(200).json({
            message:"email sent"
        })
    } catch (error) {
        console.log(error.message)
    }
})

router.post("/join", upload.single("uploads"), async(req, res)=>{
    try {
        const {fullname, email, phone} = req.body
        const uploaded = req.file.location
        // const uploads = req.file.path 
    //   console.log(uploaded)
           
  const msg={   
    to:email, 
    from :"VAB Solutions <info@polvote.com>",
    subject:"Thanks for Contacting us",
    html:compiled.render({fullname:fullname})
} 
sgMail.send(msg).then(()=>{
 
}).catch((err)=>{ 
console.log(err)
})     
if(msg){       
    const msg={  
        to:"dicksoneneh47@gmail.com",
        from :"VAB Solutions <info@polvote.com>",
        subject:"Booked contact",
        html:`A user contacted us with the name${fullname}, :and we will also contact u via ur contact ${uploaded}` 
    } 
    sgMail.send(msg).then(()=>{

    }).catch((err)=>{
        console.log(err)
    }) 
} 
res.status(200).json({
    message:"email sent",
    
})
// console.log(uploads) 
    } catch (error) { 
        console.log(error)
    }
})  

module.exports=router  