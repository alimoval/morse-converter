const moment = require('moment');
const { charCodes, curseWords } = require('../../dictionary');

countTodayMessages = data => {
  const today = moment().dayOfYear();
  const year = moment().year();
  return data.filter(el => {
    return moment(el.createdAt).dayOfYear() === today
      && moment(el.createdAt).year() === year;
  }).length;
}

countThisWeekMessages = data => {
  const todayWeekNumber = moment().week();
  const year = moment().year();
  return data.filter(el => {
    return moment(el.createdAt).week() === todayWeekNumber
      && moment(el.createdAt).year() === year;
  }).length;
}

checkCurse = input => {
  return new Promise((resolve, reject) => {
    const result = [];
    input.split(' ').some(el => {
      let foo = curseWords.indexOf(el) >= 0 ? '#' : el;
      result.push(foo)
    });
    resolve(result.join(' '));
  });
}

convertChars = input => {
  return new Promise((resolve, reject) => {
    const chars = input.split('');
    let result = '';
    for (i = 0; i < chars.length; i++) {
      if (chars[i] != ' ') {
        if (charCodes[chars[i]]) {
          result += charCodes[chars[i]] + '   ';
        } else if (chars[i] === '#') {
          result += '###';
        }
      } else {
        result += result.slice(-1) === ' ' ? '    ' : '       ';
      }
    }
    resolve(result.trim());
  });
}

module.exports = {
  countTodayMessages,
  countThisWeekMessages,
  checkCurse,
  convertChars,
};
