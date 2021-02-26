let nodemailer = require('nodemailer');
const { User, sequelize } = require('../db/sequalize');

//queries

let USER_DETAILS = `select first_name, last_name, email, e.employee_id, organization_name as orgName 
                    from users as u 
                    inner join 
                    employees as e 
                    ON u.employee_id = e.employee_id 
                    WHERE 1 = 1 `;
/**
 * method to fetch list of users
 * @param {Object} req 
 */

const userList = (req) => {
  return new Promise ( async (resolve,reject)=>{
    try {
      console.log("[START] userList service");
      let {sort, filters} = req.body;
      let {pageNumber , pageSize} = req.params;
      let replacements = {};
      let dynamiceQuery = USER_DETAILS;

      //filter record based on parameters
      for(let i=0; i<filters.length; i++){
        if(filters[i].by === "firstName"){
          dynamiceQuery += ` and first_name like '%${escape(filters[i].value)}%' `;
        }
        else if(filters[i].by === "lastName"){
          dynamiceQuery += ` and last_name like '%${escape(filters[i].value)}%' `;
          replacements["firstName"] = filters[i].value;
        }
        else if(filters[i].by === "employeeId"){
          dynamiceQuery += ` and e.employee_id = ${escape(filters[i].value)} `;
        }
      }

      //sort record based on parameter
      if(sort === undefined || sort.by === undefined || sort.by === 'email'){
        dynamiceQuery += ` order by email `;
      }
      else if(sort.by === 'firstName'){
        dynamiceQuery += ` order by first_name `;
      }
      else if(sort.by === 'lastName'){
        dynamiceQuery += ` order by last_name `;
      }
      else if(sort.by === 'employeeId'){
        dynamiceQuery += ` order by employee_id `;
      }
      else if(sort.by === 'orgName'){
        dynamiceQuery += ` order by organization_name `;
      }

      if(sort === undefined || sort.type === undefined || sort.type === 'desc'){
        dynamiceQuery += ` desc `;
      }
      else {
        dynamiceQuery += ` asc `;
      }

      let usersTotal = await sequelize.query(dynamiceQuery, {
        replacements: replacements,
        model: User,
        mapToModel: true
      });

      let page = (parseInt(pageNumber) - 1) * parseInt(pageSize);
      dynamiceQuery += ` limit ${pageSize} offset ${page}`;

      console.log("dynamic query formed is "+dynamiceQuery);
      //fetch valid data for update
      let users = await sequelize.query(dynamiceQuery, {
        replacements: replacements,
        model: User,
        mapToModel: true
      });
      
      if(users.length === 0){
        return resolve({"status":404, error : "Record not found"});

      }
      resolve({
        status : 200,
        users : users,
        meta : {
          total : usersTotal.length
        }
      });
      console.log("[END] userList service");
    } catch (error) {
      console.log("error occurred in userList service " + error.message);
      reject({status: 500, error: "Processing Error Occurred" });
    }
  })
}

module.exports.userList = userList;
