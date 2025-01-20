import { body } from "express-validator";

//sign request body validator
const createRequestValidator = [
    body('name')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Name: please enter a valid text format')
    .bail(),

    body('accountDetails')
    .notEmpty()
    .isString()
    .withMessage('accountDetails: please enter a valid text format'),

    body('initialValue')
    .optional()
    .isNumeric().withMessage('Initial value must be a number')




]

export default {createRequestValidator}