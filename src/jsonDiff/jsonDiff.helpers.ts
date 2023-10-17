import _map from "lodash/map";
import _keys from 'lodash/keys.js';
import {diff} from "jsondiffpatch";
import padStart from 'lodash/padStart';
import _isEmpty from "lodash/isEmpty.js";
import _includes from 'lodash/includes';
import _pick from 'lodash/pick';


export const getJsonDeltaArray = (jsonArray) => {
    const deltaArray = _map(jsonArray, (jsonObject, index: number) => {
        if (index >= jsonArray.length - 1) return undefined;
        return diff(jsonObject, jsonArray[index + 1]);
    });
    return deltaArray.splice(0, deltaArray.length - 1);
};

export const getJsonArrayMetadata = unprocessedJSONArray =>
    _map(unprocessedJSONArray, ({createdTime, userId}) => ({createdTime, userId}))

export const processJsonArray = (unprocessedJSONArray) =>
    _map(unprocessedJSONArray, ({jsonEvent}) => JSON.parse(jsonEvent));

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


export const epochToDateTimeWithMilliseconds = epoch => {
    const date = new Date(epoch);
    const year = date.getUTCFullYear();
    const month = padStart(String(date.getUTCMonth() + 1), 2, '0');
    const day = padStart(String(date.getUTCDate()), 2, '0');
    const hours = padStart(String(date.getUTCHours()), 2, '0');
    const minutes = padStart(String(date.getUTCMinutes()), 2, '0');
    const seconds = padStart(String(date.getUTCSeconds()), 2, '0');
    const milliseconds = padStart(String(date.getUTCMilliseconds()), 3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const INITIAL_SEARCH_QUERY = {
    searchText: '',
    isNestedSearchEnabled: false,
    searchValues: false,
}

const findJsonValues = (json, searchTextArray, isNestedSearchEnabled) => {
    if (Array.isArray(json)) {
        const result = [];
        for (const key in json) {
            if (typeof json[key] === 'object') {
                const findValue = isNestedSearchEnabled ? findJsonValues(json[key], searchTextArray, isNestedSearchEnabled) : [];
                if (!_isEmpty(findValue)) result.push(findValue);
            } else {
                if (_includes(searchTextArray, json[key])) result.push(json[key]);
            }
            return [...result];
        }
    } else {
        const result = {};
        for (const key in json) {
            if (typeof json[key] === 'object') {
                const findValue = isNestedSearchEnabled ? findJsonValues(json[key], searchTextArray, isNestedSearchEnabled) : {};
                if (!_isEmpty(findValue)) result[key] = findValue;
            } else {
                if (_includes(searchTextArray, json[key])) result[key] = json[key];
            }
        }
        return {...result};
    }

}

const findJsonKeysByName = (json, searchTextArray, isNestedSearchEnabled) => {
    const result = {};
    for (const key in json) {
        if (_includes(searchTextArray, key)) {
            result[key] = json[key];
        } else if (typeof json[key] === 'object' && !Array.isArray(json[key])) {
            const findKey = isNestedSearchEnabled ? findJsonKeysByName(json[key], searchTextArray, isNestedSearchEnabled) : {};
            if (!_isEmpty(findKey)) result[key] = findKey;
        }
    }
    return result;
}

export const getFilteredJson = (jsonArray, searchQuery) => {
    if (searchQuery.searchText === '') return jsonArray;
    const searchTextArray = searchQuery.searchText.split(' ');
    const isNestedSearchEnabled = searchQuery.isNestedSearchEnabled;
    if (searchQuery.searchType === 'search-values') {
        return _map(jsonArray, json => findJsonValues(json, searchTextArray, isNestedSearchEnabled));
    } else if (searchQuery.searchType === 'search-name-keys') {
        return _map(jsonArray, json => findJsonKeysByName(json, searchTextArray, isNestedSearchEnabled));
    } else {
        return _map(jsonArray, json => _pick(json, searchTextArray));
    }
}
