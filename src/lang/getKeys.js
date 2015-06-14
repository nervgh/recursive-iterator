

import isArray from './isArray';
import isArrayLike from './isArrayLike';


const {floor} = Math;
const {keys} = Object;


/**
 * @param {Object|Array} object
 * @returns {Array<String>}
 */
export default function(object) {
    var keys_ = keys(object);
    if (isArray(object)) {
        // skip sort
    } else if(isArrayLike(object)) {
        // only integer values
        keys_ = keys_.filter((key) => floor(Number(key)) == key);
        // skip sort
    } else {
        // sort
        keys_ = keys_.sort();
    }
    return keys_;
}