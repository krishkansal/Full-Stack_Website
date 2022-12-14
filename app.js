const express=require("express")
const bodyParser = require("body-parser")
const bcrypt=require("bcrypt");
require("./DB/conn");
const data=require("./model/signup")
const app=express()
const port=process.env.PORT || 3000


app.use(express.json());
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get('/',(req,res)=>{
    
    return res.redirect("Main Page.html");

})


app.get('/login',(req,res)=>{
    
    return res.redirect("login.html");

})


app.post('/login',async (req,res)=>{
    try{

        const Email=req.body.email;
        const Password=req.body.password;

       // console.log(`${Email} and password is ${Password}`);

       const useremail = await data.findOne({email:Email});

       //Password Hashing (Match Password)

       const matchpassword = await bcrypt.compare(Password,useremail.password);


        if(matchpassword){
            res.status(201).redirect("Main Page.html");
        }else{
            res.send("Invalid Login Details");
        }
       
    }catch(error){
        res.status(400).send("Record not found")
    }
    
})





app.get('/signup',(req,res)=>{
    
    return res.redirect("signup.html");

})


// app.post('/signup',async (req,res)=>{
//     try{
//         const password=req.body.password;
//         const cpassword=req.body.cpassword;

//         if(password===cpassword){

//             const signupdata=new data({
//                 name:req.body.name,
//                 phone:req.body.phone,
//                 email:req.body.email,
//                 password:req.body.password,
//                 cpassword:req.body.cpassword

//             })

//             const registered =await signupdata.save();
//             res.status(201).redirect("Main Page.html")

//         }else{
//             res.send("password are not matching")
//         }

//     }catch(error){
//         res.status(400).send(error);
//     }
// })



app.post("/signup",(req,res)=>{
    console.log(req.body.name);
    console.log(req.body.phone);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.cpassword);

    const password=req.body.password;
    const cpassword=req.body.cpassword;


    data.find({email:req.body.email})
    .then(result=>{
        if(result.length!==0){
              // Email already exist
              res.send({message:'Email already exist,try again with different email'})
        }else if(password===cpassword){
            const users=new data({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword
            })
            
             //Password Hashing

            users.save()
            .then(()=>{ res.status(201).redirect("Main Page.html");})
            .catch((e) => {res.status(400).json(e);})

        }else{
            res.send("password are not matching")
        }
    })
     .catch(err => res.status(500).json( {message: 'Server Encountered an Error', error: err} ))  

    })




app.listen(port,()=>{
    console.log("connection setup");
})