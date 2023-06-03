/* eslint-disable no-param-reassign */
const ESCAPE_KEY = ['fieldValue', 'startDate', 'endDate', 'column', 'sort', 'page_size', 'page_index', 'page_column', 'page_sort', 'time_start', 'time_end'];
const loopEscapeObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (typeof (value) === 'object') {
        loopEscapeObject(value);
      } else if (ESCAPE_KEY.includes(key)) {
        object[key] = encodeURIComponent(value).replace('%20', ' ');
      }
    }
  });
  return object;
};

const escapeClient = {

  escapeObject: (object) => {
    const obj = JSON.parse(JSON.stringify(object));
    return loopEscapeObject(obj);
  },
};

module.exports = escapeClient;
