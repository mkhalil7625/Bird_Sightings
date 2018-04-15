var moment=require('moment-timezone');

function formatDate(date) {
    //get the utc standard date version
    m=moment.utc(date);
   // Convert to Minnesota timezone
    return m.tz('America/Chicago').format('dddd, MMM Do YYYY, h:mm a');
}
function length(array) {
    return array.length;
}
module.exports={
    formatDate,
    length
}