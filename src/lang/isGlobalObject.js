

const GLOBAL_OBJECT = new Function('return this')();

/**
 * @param {*} any
 * @returns {Boolean}
 */
export default function(any) {
    return any === GLOBAL_OBJECT;
}