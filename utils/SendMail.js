const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

async function sendMail(to, url, template) {
  const {
    
    MAIL_HOST,
    MAIL_USER,
    MAIL_PASS,
    MAIL_PORT,
  } = process.env;

  /* ---------- using SMTP service ---------- */
  let transporter = nodemailer.createTransport({
    port: Number(MAIL_PORT),
    host: MAIL_HOST,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  /* using handlebars to replace values in html template */
  const data = handlebars.compile(template);
  const replacements = {

    URL: url,
    
  };
  const html = DOMPurify.sanitize(data(replacements));

  /* Verify Connection Congif */
  await new Promise((resolve, reject) => {
    //verifies if we can connect to the SMTP server
    transporter.verify((error, success) => {
      if (error) {
        console.log("Error connecting to the SMTP server : ", error);
        reject(error);
      } else {
        console.log("SMTP server is listening...");
        resolve(success);
      }
    });
  });

  /* ---------- Send Mail ---------- */
  const options = {
    from: MAIL_USER,
    to,
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error("Error sending email : ", err);
        reject(err);
      } else {
        console.log("Email sent successfully : ", info);
        resolve(info);
      }
    });
  });
}


module.exports = {
  sendMail
};