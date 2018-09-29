const helperGetEmployeeName = require('helperFunction')

exports.getResults = data => {

    console.log(data.connection.params);
    try {
        //Querying mongoDb using Action Hero
        const SavingModel = api.savings;
        const getSaving = await SavingModel.get({
            account_id: data.connection.params.account_id
        });

        const savings = getSaving; //Got savings 

        //Now will maniplulate the savings with our updated data
        //Incorrect way it will push data to a mongo instance (check response.json for more details)
        const savings = getSaving.map(saving => {
            let eName = '';
            if (saving.employee_id) {
                eName = helperGetEmployeeName.getEmployeeName(saving.employee_id);
            }
            const temp = {
                ...saving,
                employeeName: eName
            };

            return temp;
        });

        //correct way before pushing we have to use mongoose set method to insert data 
        await savings.forEach((saving, i) => {
            if (saving.employee_id) {
                savings[i].set(
                    'employeeName',
                    helperGetEmployeeName.getEmployeeName(saving.employee_id), { //get the corresponding employee name using employee id
                        strict: false
                    }
                );
            }
        });

        data.response.data = {
            result: 'Retrieval successful',
            saving: savings
        };
    } catch (err) {
        api.log(err.message, 'error', {
            api: JSON.stringify(data.connection.params.action),
            stack: JSON.stringify(err.stack),
            params: JSON.stringify(data.connection.params)
        });
        data.response.error = err;
    }

}