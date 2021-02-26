"use strict";
const nodemailer = require("nodemailer");
const path = require('path');

module.exports.sendResetMail = async function (userMail, userId) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'brandeldev@gmail.com',
                pass: process.env.mailPass,
            },
        });

        let info = await transporter.sendMail({
            from: {
                name: 'Todoz',
                address: 'brandeldev@gmail.com'
            },
            to: `${userMail}`,
            subject: `[Todoz] Reset your account password`,
            text: "Reset your account password",
            html: `
                   <body style="color: white; margin: 0 auto; width: 50%; background-color: black; padding:50px">
                    <h1>Reset Password</h1>
                    <div style="color:rgb(18, 102, 95); background-color: white; 
                                    padding: 60px; border-radius: 5px; border: rgb(69, 85, 83) 2px solid;">
                        <h3>To confirm your new password, click the link below </h3>
                        <div>
                         <a none;" href="https://todozz.herokuapp.com/api/user/resetPassword/${userId}">
                         <button style="height: 30px; background-color: #44c1c1c7; 
                         border: none; border-radius: 5%; margin: 10px; cursor: pointer;"> Confirm your password</button><br>
                         </a>
                        </div>
                        <img style="margin: 20px auto; cursor:default; width:20vw;" src="cid:myImage" alt="Todoz">
                    </div>
                   </body>`,
            attachments: [{
                filename: '5.png',
                path: path.join(__dirname + '/5.png'),
                cid: 'myImage'
            }]
        });

        console.log("Message sent: %s", info);
    }
    catch (err) {
        console.log(err.message)
    }
}