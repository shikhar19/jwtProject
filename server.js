const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin : "http:localhost:8081"
};

app.use(cors(corsOptions));

//parse requests of content type - application/json
app.use(express.json());

//parse requests of content type - application/www.urlencoded
app.use(express.urlencoded( {
    extended :  true
}));

const db = require("./models");
const dbConfig = require('./config/db.config');

//simple route
app.get('/', (req, res)=>{
    res.json("Welcome to Shikhar World");
});

const Role = db.role;
db.mongoose.connect(dbConfig.url, {
    useNewUrlParser : true,
    useUnifiedTopology  :true
}).then(()=>{
    console.log("Successfully connected to Mongo Db database");
    initial();
}).catch(err => {
    console.error("connection error", err);
    process.exit();
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

  // routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

//set ports and listen for requests
const PORT = process.env.port || 8080;
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
})