/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-void */
/* eslint-disable consistent-return */
function traverse(object, path, callback) {
  let objectRes = object;
  const segments = path.split('.');
  const { length } = segments;
  const _loop = function _loop(idx) {
    const currentSegment = segments[idx];
    if (!object) {
      return { v: void 0 };
    }
    objectRes = callback(objectRes, currentSegment, segments, idx);
  };
  for (let idx = 0; idx < length; idx += 1) {
    const ret = _loop(idx);
    if (typeof ret === 'object') return ret.v;
  }
  return objectRes;
}

function isLastSegment(segments, index) {
  return segments.length === index + 1;
}

function setProperty(object, property, value) {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  if (typeof property === 'undefined') {
    return object;
  }
  try {
    return traverse(object, property, (currentObject, currentProperty, segments, index) => {
      if (!currentObject[currentProperty]) {
        currentObject[currentProperty] = {};
      }
      if (isLastSegment(segments, index)) {
        currentObject[currentProperty] = value;
      }
      return currentObject[currentProperty];
    });
  } catch (err) {
    return object;
  }
}

function getProperty(object, property) {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  if (typeof property === 'undefined') {
    return object;
  }
  try {
    return traverse(object, property, (currentObject, currentProperty) => currentObject[currentProperty]);
  } catch (err) {
    return object;
  }
}

module.exports = {
  set: setProperty,
  get: getProperty,
};
