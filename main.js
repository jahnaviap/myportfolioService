const express = require("express");
const app = express();
const PORT = process.env.PORT || 8321;
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendMail(name, email, message) {

    let info = await transporter.sendMail({
        from: '"Portfolio Connect" <portfolio@jahnavi.me>', // sender address
        to: process.env.RECEIVER_EMAIL,
        subject: "Your portfolio is gaining attention❗", // Subject line
        html: `<html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" type="text/css">
          <link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet' type="text/css">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap" rel="stylesheet" type="text/css">
        </head>
        
        <body>
          <div id="container">
            <div id="heading" style='font-size: 30px;
            text-align: center;
            font-family: "Open Sans";
            padding: 40px;
            background-color: white;
            border-bottom: 2px solid black;'>
              <strong>${name}</strong> has reached out to you!
            </div>
            <div id="message" style='font-family: "Lato"; font-size: 21px;
            padding: 20px;
            text-align: justify;'>
              ${message}
            </div>
            <div id="reply" style='text-align: center;
            font-family: "Lato"; font-size: 21px;
            padding: 40px;'>
              Reply back at : <span id="emailId" style='font-family: "Lato";
              font-weight: bold;
              cursor: pointer;' onclick='window.open("mailto:${email}?subject=Subject&body=Body%20goes%20here")'>
                ${email}
              </span>
            </div>
          </div>
        </body>
        
        </html>`,
        priority: "high"
    });

    console.log("Message sent: %s", info.messageId);
}

app.use(bodyParser.text())

app.post("/sendContactInfo", async function (req, res) {
    const contactDetails = JSON.parse(req.body);
    const name = contactDetails.name;
    const email = contactDetails.email;
    const message = contactDetails.message;

    await sendMail(name, email, message);

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
    res.sendStatus(200);

})

app.listen(PORT, function () {
    console.log("Application listening on port: ", PORT);
})

