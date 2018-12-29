const monthEnum = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
];

const dayEnum = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '04', '25', '26', '27', '28', '29', '30', '31',
];

const timeEnum = [
  '00',
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '04', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
  '51', '52', '53', '54', '55', '56', '57', '58', '59',
];

const datatime = {

  parseStampToFormat(timestamp, type) {
    let _date;
    if (timestamp) {
      _date = new Date(timestamp);
    } else {
      _date = new Date();
    }

    let parsedDate;
    let parseTime;
    let parseDatetime;

    const yearNum = _date.getFullYear();
    const monthNum = monthEnum[_date.getMonth()];
    const dayNum = dayEnum[_date.getDate() - 1];
    const hourNum = timeEnum[_date.getHours()];
    const minNum = timeEnum[_date.getMinutes()];
    const secNum = timeEnum[_date.getSeconds()];

    type = type || 'YYYY/MM/DD/hh/mm/ss';

    parseDatetime = type
      .replace('YYYY', yearNum)
      .replace('MM', monthNum)
      .replace('DD', dayNum)
      .replace('hh', hourNum)
      .replace('mm', minNum)
      .replace('ss', secNum);

    return parseDatetime;
  },

  getNowDatetime() {
    const timestamp = new Date().getTime();
    const nowDatetime = this.parseStampToFormat(timestamp);
    return nowDatetime;
  },


};

module.exports = datatime;
