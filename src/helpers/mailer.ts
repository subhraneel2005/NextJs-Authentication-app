import nodemailer from "nodemailer";

export const sendEmail = async({email,emailType, userId}: any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });

          const mailOpts = {
            from: "subhraneeljobs@gmail.com", // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>",
          }

          const mailResponse = await transporter.sendMail(mailOpts)
          return mailResponse;
    } catch (error:any) {
        throw new Error(error.message)
    }
}