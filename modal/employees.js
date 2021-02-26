
module.exports = (sequelize, type) => {
  let employees = sequelize.define('employees', {
    employeeId: {
      type: type.INTEGER,
      field: 'employee_id',
      primaryKey: true,
      autoIncrement: true
    },
    orgName: {
      type: type.STRING,
      field: 'organization_name'
    },
    updatedAt: {
      type: 'TIMESTAMP',
      field: 'last_updated',
      defaultValue: type.literal('CURRENT_TIMESTAMP')
    }
  }, {
    timestamps: false,
    freezeTableName: true
  })

  return employees;
}



