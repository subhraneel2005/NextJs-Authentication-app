import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptJs from "bcryptjs";

export const sendEmail = async({email,emailType, userId}: any) => {
    try {

      const hashedVerifyToken = await bcryptJs.hash(userId.toString(), 10);

      if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedVerifyToken,
          verifyTokenExpiry: Date.now() + 3600000
        })
      }
      else if(emailType === "RESET"){
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedVerifyToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000
        })
      }

      
      var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d62e16746d559c",
          pass: "c578f245fda346"
        }
      });

          const mailOpts = {
            from: "subhraneeljobs@gmail.com", // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: `<p>Click <a href ="${process.env.DOMAIN}/verifyemail?token=${hashedVerifyToken}">here</a> to ${ emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
            <br>${process.env.DOMAIN}/verifyemail?token=${hashedVerifyToken}
            </p>`,
          }

          const mailResponse = await transporter.sendMail(mailOpts)
          return mailResponse;
    } catch (error:any) {
        throw new Error(error.message)
    }
}