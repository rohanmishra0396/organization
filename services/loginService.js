const { User } = require('../db/sequalize');
const jwt = require('jsonwebtoken');
const authConfig = require('../constants/configValueConstants').authCheck;
const crypto = require('crypto-js');

/**
 * method to get user logged in
 * @param {Object} req 
 */

const login = (req) => {

  return new Promise(async (resolve, reject) => {

    try {
      // Grab user input       
      const { email, password } = req.body
      console.log("Email " + JSON.stringify(email));

      const user = await User.findOne({

        where: {
          email: email
        }
      });
      console.log("user record found is " + JSON.stringify(user));

      // Check to see if user is in db
      if (!user) {
        return resolve({
          status: 403,
          error: 'the login information was incorrect / Not Found'
        })
      }

      // Check to see if password is valid
      const isPasswordValid = await user.validPassword(password, user.password);

      if (!isPasswordValid) {
        return resolve({
          status: 403,
          error: 'the login information was incorrect / Not Found'
        })
      }
      // return user using toJSON()
      const userJson = user.toJSON()

      //encrypt the email before creating a token
      let encryptedKey = crypto.AES.encrypt(email, authConfig.secretKey).toString();

      const expiresIn = authConfig.expiresIn;
      const SECRET_KEY = authConfig.passportKey;
      const accessToken = jwt.sign({ id: encryptedKey }, SECRET_KEY, {
        expiresIn: expiresIn
      });

      delete userJson.userId;
      delete userJson.password;
      delete userJson.updatedAt;

      resolve({
        user: userJson,
        token: 'Bearer '+accessToken
      })
    } catch (e) {
      console.log(e)
      reject({ error: 'An error occured attempting to login' })

    }
  });
}


module.exports.login = login;