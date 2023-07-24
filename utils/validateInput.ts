import type { SignupFormType } from "../types";

const isFieldNotEmpty = (input: SignupFormType) => {
    let isValid = true;
    
    Object.keys(input).forEach(inp => {
        isValid = isValid && input[inp as keyof typeof input].trim() !== "";
    });

    return Object.keys(input).length > 0 && isValid;
}

const isEmail = (email: string) => {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return pattern.test(email);
}

const includesNonEnglish = (input: SignupFormType) => {
    const pattern = /[^\x00-\x7F]+/;
    let count = 0; // Number of fields that include non english character

    Object.keys(input).forEach(field => {
        count = pattern.test(input[field as keyof typeof input]) ? ++count : count; 
    });

    return count > 0;
}

const isPasswordValid = (password: string) => {
    /*
        A valid password should include the following:
        - at least 8 characters, at most 16 characters long
        - at least 1 uppercase character
        - at least 1 numeric character
        - at least 1 non-alpha numeric character like: `! @ # $ % ^ &`
    */
    const regularExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    return regularExp.test(password);
}

module.exports = {
    isFieldNotEmpty,
    isEmail,
    includesNonEnglish,
    isPasswordValid
}