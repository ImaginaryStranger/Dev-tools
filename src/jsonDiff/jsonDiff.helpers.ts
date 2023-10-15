import _map from "lodash/map";
import _keys from 'lodash/keys.js';
import { diff } from "jsondiffpatch";

export const getJsonDeltaArray = (jsonArray) => {
  const deltaArray = _map(jsonArray, (jsonObject, index) => {
    if (index >= jsonArray.length - 1) return undefined;
    return diff(jsonObject, jsonArray[index + 1]);
  });
  return deltaArray.splice(0, deltaArray.length - 1);
};

export const processJsonArray = (unprocessedJSONArray) =>
    _map(unprocessedJSONArray, ({ jsonEvent }) => JSON.parse(jsonEvent));

export const countBlockKeys = blockValue => {
  if (blockValue === null) return 0;
  else if (typeof blockValue === 'object') {
    const keys = _keys(blockValue);
    let count = 0;
    keys.forEach(key => {
      count += countBlockKeys(blockValue[key]);
    })
    return count;
  } else if (Array.isArray(blockValue)) {
      let count = 0;
      blockValue.forEach(obj => {
        count += countBlockKeys(obj);
      });
      return count;
  } else {
    return 1;
  }
}
