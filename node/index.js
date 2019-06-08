var express = require("express");
var app = express();

let port = 3004;
console.log("Let's start using express...");

// middleware
//public is the folder name in the structure
app.use(express.static("public"));





app.get("/json", function(req,res) {
    res.send({name: "Jon Doe", address: "RGB"});
});


app.listen(port, () => {
    console.log("listening on port ${port}!");
})


