const moment = require('moment'); 


function DateFormat(date){
    try {
        return moment(new Date(date.toString())).format("D-M-YYYY ")
    } catch (error) {
        console.log("")
    }
   
}
module.exports = {
    DateFormat
  };
