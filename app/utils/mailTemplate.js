const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:3000';

// Modified from a template by Litmus (@litmusapp)
const shortEmail = (title, appName, url, preheader, headline, heroUrl, body, buttonText, footerText) => {
  return `<!DOCTYPE html>
    <html>
    <head>
    <title>${title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link href="https://fonts.googleapis.com/css?family=Titillium+Web:200,400,700" rel="stylesheet">
    <style type="text/css">
        /* CLIENT-SPECIFIC STYLES */
        body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;} /* Prevent WebKit and Windows mobile changing default text sizes */
        table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;} /* Remove spacing between tables in Outlook 2007 and up */
        img{-ms-interpolation-mode: bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */

        /* RESET STYLES */
        img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}
        table{border-collapse: collapse !important;}
        body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width: 525px) {

            /* ALLOWS FOR FLUID TABLES */
            .wrapper {
              width: 100% !important;
                max-width: 100% !important;
            }

            /* ADJUSTS LAYOUT OF LOGO IMAGE */
            .logo img {
              margin: 0 auto !important;
            }

            /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */
            .mobile-hide {
              display: none !important;
            }

            .img-max {
              max-width: 100% !important;
              width: 100% !important;
              height: auto !important;
            }

            /* FULL-WIDTH TABLES */
            .responsive-table {
              width: 100% !important;
            }

            /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
            .padding {
              padding: 10px 5% 15px 5% !important;
            }

            .padding-meta {
              padding: 30px 5% 0px 5% !important;
              text-align: center;
            }

            .padding-copy {
              padding: 10px 5% 10px 5% !important;
              text-align: center;
            }

            .no-padding {
              padding: 0 !important;
            }

            .section-padding {
              padding: 50px 15px 50px 15px !important;
            }

            /* ADJUST BUTTONS ON MOBILE */
            .mobile-button-container {
                margin: 0 auto;
                width: 100% !important;
            }

            .mobile-button {
                padding: 15px !important;
                border: 0 !important;
                font-size: 16px !important;
                display: block !important;
            }

            /* BUTTON GRADIENT */
            .btn-gradient,
            .hover {
                color: white;
                border-radius: 4px;
                -webkit-transition: all 300ms ease-in-out;
                -o-transition: all 300ms ease-in-out;
                transition: all 300ms ease-in-out;
                background: #833ab4;
                background-image: -webkit-linear-gradient(-45deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%);
                background-image: -webkit-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%);
                background-image: -o-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%);
                background-image: linear-gradient(135deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%);
                background-size: 200% 200%;
                background-position: 0 0;
                -webkit-transition: background-position 500ms ease-in-out;
                -o-transition: background-position 500ms ease-in-out;
                transition: background-position 500ms ease-in-out;
                position: relative;
                overflow: hidden;
                cursor: pointer;
              }
            .btn-gradient:hover,
            .btn-gradient:focus,
            .hover:hover,
            .hover:focus {
              background-position: 100% 100% !important;
              box-shadow: 0 5px 10px rgba(131,58,180, 0.4) !important;
              transition: all 500ms ease-in-out !important;
            }

        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
    </head>
    <body style="margin: 0 !important; padding: 0 !important;">

    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${preheader}
    </div>

    <!-- HEADER -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#ffffff" align="center">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
                <tr>
                <td align="center" valign="top" width="500">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="wrapper">
                    <tr style="max-height: 180px;">
                        <td align="center" valign="top" style="padding: 15px 0 0 0; display: flex; justify-content: center;" class="logo">
                            <a href=${CLIENT_URL} target="_blank" style="padding: 0; width: 100%; text-align: center;">
                                <img alt="pollbuilder" src="https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder.png" style="display: block; margin: auto; width:100%; max-width: 500px; height: auto; max-height: 180px;" border="0">
                            </a>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0 15px;" class="section-padding">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
                <tr>
                <td align="center" valign="top" width="500">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">
                    <tr>
                        <td>
                            <!-- HERO IMAGE -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                      <td class="padding" align="center">
                                        <a href={CLIENT_URL} target="_blank"><img src=${heroUrl} width="500" height="180" border="0" alt=${headline} style="display: block; padding: 0; color: #666666; text-decoration: none; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; font-size: 16px;" class="img-max"></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <!-- COPY -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="font-size: 25px; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; color: #833ab4; padding-top: 30px;" class="padding">${headline}</td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; color: #666666;" class="padding">${body}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <!-- BULLETPROOF BUTTON -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="padding-top: 25px;" class="padding">
                                                    <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                                        <tr>
                                                            <td align="center" bgcolor="#833ab4" class="btn-gradient" style="border-radius: 4px; -webkit-transition: all 300ms ease-in-out; -o-transition: all 300ms ease-in-out; transition: all 300ms ease-in-out; background: #833ab4; background-image: -webkit-linear-gradient(-45deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: -webkit-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: -o-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: linear-gradient(135deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-size: 200% 200%; background-position: 0 0; -webkit-transition: background-position 500ms ease-in-out; -o-transition: background-position 500ms ease-in-out; transition: background-position 500ms ease-in-out; position: relative; overflow: hidden; cursor: pointer;"><a href=${url} target="_blank" style="font-size: 16px; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 15px 25px; border: 1px solid transparent; display: inline-block; border-radius: 4px; -webkit-transition: all 300ms ease-in-out; -o-transition: all 300ms ease-in-out; transition: all 300ms ease-in-out; background: #833ab4; background-image: -webkit-linear-gradient(-45deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: -webkit-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: -o-linear-gradient(315deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-image: linear-gradient(135deg, #833ab4 0px, #833ab4 50px, #fd1d1d, #fcb045 100%); background-size: 200% 200%; background-position: 0 0; -webkit-transition: background-position 500ms ease-in-out; -o-transition: background-position 500ms ease-in-out; transition: background-position 500ms ease-in-out; position: relative; overflow: hidden; cursor: pointer;" class="mobile-button hover">${buttonText} &rarr;</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 20px 0px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
                <tr>
                <td align="center" valign="top" width="500">
                <![endif]-->
                <!-- UNSUBSCRIBE COPY -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 500px;" class="responsive-table">
                    <tr>
                        <td align="center" style="font-size: 12px; line-height: 18px; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; color:#666666;">
                            ${footerText}
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>

    </body>
    </html>`
  };

exports.pwResetTemplate = (url) => {
     return shortEmail(
      'Reset Password', // title
      'pollbuilder', // appName
      url, // url
      'Click here to reset your password', // preheader
      'Forgot your password?', // headline
      'https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/email-banner.png', // heroUrl
      'No problem! Click below to reset it!', // body
      'Reset Password', // buttonText
      'pollbuilder | rifkegribenes.io' // footerText
      );
 };

exports.pwResetConfirmation = () => {
     return shortEmail(
      'Your password was reset', // title
      'pollbuilder', // appName
      CLIENT_URL, // url
      'Your password was reset successfully', // preheader
      'You changed your password', // headline
      'https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/src/img/checkbox_500x180.png', // heroUrl
      'Or somebody did...\nIf it wasn\'t you, please contact us right away and get that fixed!', // body
      'My Account', // buttonText
      'pollbuilder | rifkegribenes.io' // footerText
      );
 };

exports.verificationTemplate = (url) => {
  return shortEmail(
    'Please verify your email', // title
    'pollbuilder', // appName
    url, // url
    'Click here to verify your email', // preheader
    'Welcome!', // headline
    'https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/email-banner.png', // heroUrl
    'Click below to verify your email:', // body
    'Verify Email', // buttonText
    'pollbuilder | rifkegribenes.io' // footerText
    );
};