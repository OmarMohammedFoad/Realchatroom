const express = require("express") 
var app =express();
const dotenv = require ("dotenv")
dotenv.config()
const mongoose =  require("mongoose")
const path = require("path")
// The import.meta object contains context-specific metadata for the module, e.g. the module's URL.
const {fileURLToPath} = require ("url")
const  user = require ("..//realtimechat/model/user.js")
const bodyParser =require("body-parser");
const { Socket } = require("socket.io");
const http =  require("http").Server(app)
const io = require ("socket.io")(http,{cors:{origin:"*"}})
// create http using the app server

io.on('connection', (stream) => {
  console.log('someone connected!');
  console.log("user : ",stream.id);
}
     )








// we can start listening to the port 
 http.listen(3001,()=>
{
 connect();
console.log("connected to backend !!" );
}
);


const connect = async()=>
{    try {
        await mongoose.connect(process.env.mongo);
        console.log("the data base is connected");
      } catch (error) {
        console.log(error);
        throw error
      }
}



mongoose.connection.on("connection",()=>
{
    console.log("the DB is connected");
}
)

mongoose.set("strictQuery",true)

mongoose.connection.on("disconnection",()=>
{
    console.log("the DB is disconnected");
}
)
app.use(express.static(__dirname),);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



app.get('/messages', (req, res) => {
    user.find({},(err, messages)=> {
      res.send(messages);
    })
  })


  app.delete("/message",async (req,res)=>
{
    try 
    {
      await  user.deleteMany({})
        res.send(200);
    } catch (error) {
        res.status(500).json("error")
    }
} 
  )






app.post("/message" ,async (req,res)=>
{try 
    {
    const newmessage = await new user(req.body)
    const savemessage = await newmessage.save()
    var censored = await user.findOne({message:'badword'});
    if(censored)
      await user.remove({_id: censored.id})
    else
      io.emit('message', req.body);
    res.sendStatus(200);
    }
     
    catch (error){
      res.sendStatus(500);
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
}
)




  // catch (error){
  //   res.sendStatus(500);
  //   return console.log('error',error);
  // }
  // finally{
  //   console.log('Message Posted')
  // }


