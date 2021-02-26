const { User, employees } = require('../db/sequalize');

/**
 * method to register user in the system
 * @param {Object} req 
 */

const register = (req) => {
    let userJson = req.body;
    return new Promise(async function (resolve, reject) {
        try {
            
            console.log("userJson"+JSON.stringify(userJson));
            const { email } = req.body
            console.log("Email "+JSON.stringify(email));
            const user = await User.findOne({

              where : {
                email: email
              }
            });
            console.log("user record found is "+JSON.stringify(user));

            if(user){
               return resolve(
                  {
                    "code": 400,
                    "message": "User already exists"
                  }  
                )
            }

            employees.create({
                orgName: userJson.orgName,
            }).then(function (employee) {
                console.log("employee "+JSON.stringify(employee));
                User.create({
                    firstName: userJson.firstName,
                    lastName: userJson.lastName,
                    email: userJson.email,
                    password: userJson.password,
                    employeeId: employee.employeeId
                }).then(function () {
                    resolve({
                        "code": 200,
                        "message": "User details saved successfully"
                    });
                });
            });

        } catch (error) {
            console.log("Error in Register Service");
            reject();
        }

    });
}

module.exports.register = register;