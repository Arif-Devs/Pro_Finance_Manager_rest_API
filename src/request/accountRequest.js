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

// Sign Request Body Validator
const UpdatePatchRequestValidator = [
    body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Username must be a valid text format')
    .bail(),

    body('account_details')
    .optional()
    .isString()
    .withMessage('Account Details must be a valid text format'),

    body('initial_value')
    .optional()
    .isNumeric().withMessage('Initial Value must be an valid  Number!'),
];

export default {createRequestValidator, UpdatePatchRequestValidator}