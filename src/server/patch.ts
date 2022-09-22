import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Database, Model } from '../definitions';
import createRequestBodyValidator from './createRequestBodyValidator';

export default (model: Model, database: Database) : RequestHandler  => {
    const bodyValidator = createRequestBodyValidator(model, { merge: true });
    return async (req: Request, res: Response, next: NextFunction) => {
        const bodyErrors = bodyValidator(req.body);
        if(bodyErrors) {
            res.status(400).send(bodyErrors);
        }
        else {
            const result = await database.collection(model.name).update(req.params.id, req.body);
            if(result) {
                res.send(result);
            }
            else {
                res.status(404).send(`Could not find ${model.name} with id ${req.params.id}`);
            }
        }
    };
};