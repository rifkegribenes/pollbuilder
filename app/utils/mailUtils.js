/* ================================= SETUP ================================= */

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_ACTIVE_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }
}
const transport = mailgunTransport(mailgunOptions);
const emailClient = nodemailer.createTransport(transport);

const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3001';

/* =============================== UTILITIES =============================== */

/* Generate random signup key
 *
 * @params    [none]
 * @returns   [object]    [signup key]
*/
function makeSignupKey() {
    const buf     = crypto.randomBytes(24);
    const created = Date.now();

    return {
        key : buf.toString('hex'),
        ts  : created,            // created time (in millisecond)
        exp : created + 86400000  // expires in 1 day (86400000 ms)
    };
}


/* Generate registration email verification url w/custom key
 * Makes sure key is unique & saves to DB
 *
 * @params    [string]   key       [custom validation key]
 * @returns   [string]             [custom validation URL]
*/
function makeVerificationUrl(key) {
    const baseUrl = `${CLIENT_URL}/verify`;

    return `${baseUrl}/${key}`;
}

/* Send transactional email using mailgunTransport (nodemailer)
 *
 * @params    [string]   to        [email address of recipient]
 * @params    [string]   subject   [subject line]
 * @params    [string]   html      [html version of message]
 * @params    [string]   text      [text of message]
 *
*/
function sendMail(to, subject, html, text) {
  return new Promise((resolve, reject) => {
    emailClient.sendMail({
      from: 'rifkegribenes <hello@rifkegribenes.io>',
      to,
      subject,
      html,
      text,
    }, (err, info) => {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}


/* ============================== EXPORT API =============================== */

module.exports = { makeSignupKey, makeVerificationUrl, sendMail };
