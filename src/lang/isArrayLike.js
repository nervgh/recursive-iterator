

import isObject from './isObject';
import isGlobalObject from './isGlobalObject';


/**
 * @param {*} any
 * @returns {Boolean}
 */
export default function(any) {
    if (!isObject(any)) return false;
    if (isGlobalObject(any)) return false;
    if(!('length' in any)) return false;
    var length = any.length;
    if(length === 0) return true;
    return (length - 1) in any;
}
