const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// To render the static file to localhost We need to make a folder public 
// and inside that folder every file & folder is axcessable by localhost
app.use(express.static("public"));

// Send the signup.html to "/" route.
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
}) 


app.post("/", function(req, res){

    // Getting data from signup.html by Body Parser
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName + " " + lastName + " " + email);

// Making a JSON Object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                  }
            }
        ]
    };

    const jsonData = JSON.stringify(data);


    //Making a http request to post the data to Mailchimp server
    const url = "https://us14.api.mailchimp.com/3.0/lists/92d78b5630";

    const options = {
        method: "POST",
        auth: "prabhakar1:b01404e11463f6a02e0d539deb8d5f28-us14"
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data) {
            console.log(JSON.parse(data));
            console.log(response.statusCode);

            // Checking If data Signed-Up Successfully or Not
            // DO remember that statusCode data me ni aayega wo to Data ka details hai jo either 
            // - hum server pe vej rhe hai ya Hum get kar rhe hai.
            // http request success huaa ya nhi eska details https.response(, function(response)) -> response ke paas hai
            if (response.statusCode === 200)
              res.sendFile(__dirname + "/success.html");

            else 
            res.sendFile(__dirname + "/failure.html");


        })
    })

    //Data is being sent to Mailchimp Server
    request.write(jsonData);

    //Request Ends
    request.end();



    // res.send("SUCCESSFULLY SUBSCRIBED !!!");
})


app.post("/failure", function(req, res) {
    res.redirect("/");  //It will redirect to home route

    // res.sendFile(__dirname + "/success.html");
    // res.send("Fail ke bad ");
    
    
})


app.listen(process.env.PORT || 3000, function(){
    console.log("SERVER IS RUNNING ON PORT 3000 ---");
})

// API Key
// b01404e11463f6a02e0d539deb8d5f28-us14

// List Id
// 92d78b5630