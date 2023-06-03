/* eslint-disable no-param-reassign */
const FILTER_KEY = ['address', 'country', 'state', 'city', 'bankName', 'bankAddress', 'bankCity'];
const INTERNAL_FILTER_KEY = ['expire_date', 'exp_date', 'line1', 'street_number', 'line2', 'zipcode', 'name', 'nameZh', 'holder_name'];
const MASKED_KEY = ['bankCardNum', 'idNum', 'swiftCode', 'phoneNum', 'number'];

const loopFilterObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (typeof (value) === 'object') {
        loopFilterObject(value);
      } else if (FILTER_KEY.includes(key) || INTERNAL_FILTER_KEY.includes(key)) {
        delete object[key];
      } else if (MASKED_KEY.includes(key)) {
        const start = value.substr(0, 3);
        const end = value.substr(-4);
        object[key] = `${start}******${end}`;
      }
    }
  });
  return object;
};

const filterClient = {
  maskedPan: (pan) => {
    const binNumber = pan.substr(0, 3);
    const last4 = pan.substr(-4);
    return `${binNumber}******${last4}`;
  },
  filterObject: (object) => {
    const obj = JSON.parse(JSON.stringify(object));
    return loopFilterObject(obj);
  },
};

module.exports = filterClient;
