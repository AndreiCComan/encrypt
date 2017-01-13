var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
var SHA1 = require("crypto-js/sha1");


/** Set the body-parser to the Node.js app
 *	This has to be done in order to read the requests' body
 */
app.use(bodyParser.urlencoded({
    extended: false
}));

/** Bind to the Node.js app a port variable that has to be used subsequently
 *	We firstly check if the environmental variable PORT has previously been set.
 * 	If it is not the case we set the port value to 5000
 */
app.set('port', (process.env.PORT || 5000));

/** Set the port at which the Node.js app will listen
 */
app.listen(app.get('port'), function () {
    console.log("Server running at port " + this.address().port);
});

/** Handle static files in the current directory. 
 *  This has to be done in order to retrieve all files like images, stylesheets and scripts
 */
app.use(express.static(__dirname + "/"));


app.post("/encryptSHA1", function (req, res) {
    text = req.body.text;
    console.log("Received = " + text);
    result = SHA1(text).toString();
    res.send(result);
});

app.post("/encryptAES", function (req, res) {
    text = req.body.text;
    passphrase = req.body.passphrase;
    result = AES.encrypt(text, passphrase).toString();
    res.send(result);
});

app.post("/decryptAES", function (req, res) {
    text = req.body.text;
    passphrase = req.body.passphrase;
    console.log("Text = " + text);
    console.log("Passphrase = " + passphrase);
    result = "Nothing found";
    try {
        bytes = AES.decrypt(text, passphrase);
        if(bytes != "")
            result = bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        result = "Nothing found";    
    }
    res.send(result);
});
