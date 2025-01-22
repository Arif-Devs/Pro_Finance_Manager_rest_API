import {body} from "express-validator"
import Expanse from "../model/expanse.js";

// Sign Request Body Validator
const expanseCreateRequest  = [
    body('amount')
    .trim()
    .notEmpty()
    .bail()
    .isNumeric().withMessage('amount value must be a number'),

    body('categoryId')
    .notEmpty()
    .withMessage('Category Id is Required Field!'),

    body('accountId')
    .notEmpty()
    .withMessage('Account Id is Required Field!')
];

export default {
    expanseCreateRequest
}

