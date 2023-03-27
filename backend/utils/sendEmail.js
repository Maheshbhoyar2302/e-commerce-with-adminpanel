const nodeMailer = require('nodemailer')

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port: 465,
        service: "gmail",
        auth: {
            //give the gmail email id and password
            user:"",
            pass:""
        }
    })

    const mailOptions = {
        from:"",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail