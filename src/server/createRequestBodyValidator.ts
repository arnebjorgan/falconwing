import Joi from 'joi';
import fieldTypes from '../fieldTypes';
import { Field, Model } from '../definitions';

export default (model: Model, options = { merge: false }) => {
    let validationObject : { [key: string] : any } = {};
    model.fields.forEach((field: Field) => {
        let fieldValidator = fieldTypes[field.type].validator;
        if(field.required && !options.merge) {
            fieldValidator = fieldValidator.required();
        }
        validationObject[field.name] = fieldValidator;
    });
    const validationSchema = Joi.object(validationObject);
    return (requestBody: Object) : string | null =>  {
        const { error } = validationSchema.validate(requestBody, { abortEarly: false });
        return error ? error.details.map((detail: { message: any; }) => detail.message).join(', ') : null;
    };
};