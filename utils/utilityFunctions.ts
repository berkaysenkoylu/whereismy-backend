const fs = require('fs');

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

const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (err: any) => {
        if(err && err.code === 'ENOENT') {
            console.log("404 - No file");
        } else if (err) {
            console.log("500 - Some other problems going on");
        } else {
            console.log(`removed`);
        }
    });
}

module.exports = {
    removeUndefinedValuesFromObject,
    isObjectEmpty,
    deleteFile
}