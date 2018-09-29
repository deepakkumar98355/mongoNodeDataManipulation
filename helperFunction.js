const employeeDetails = require('./data')

exports.getEmployeeName = employeeId => {
    const matchedEle = employeeDetails.filter(emp => emp.employee_id === employeeId);
    if (matchedEle.length) return matchedEle[0].fullname;
    return null;
};