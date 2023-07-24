/*
    It removes any keys whose values are equal
    to 'undefined', and returns a new object.
*/
const removeUndefinedValuesFromObject = (inpObject: object) => {
    Object.keys(inpObject).forEach((key) => {
        if (!inpObject[key as keyof typeof inpObject]) {
            delete inpObject[key as keyof typeof inpObject];
        }
    });

    return { ...inpObject };
}

/*
    It checks if the given object is empty.
*/
const isObjectEmpty = (inpObject: object) => {
    return Object.keys(inpObject).length === 0;
}

module.exports = {
    removeUndefinedValuesFromObject,
    isObjectEmpty
}