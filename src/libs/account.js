import { serverError } from "../utils/error.js";
import Account from "../model/account.js";

//create new account
const createAccount = async({name, accountDetails, initialValue, userId})=>{
    try {
        const account = new Account({
            name,
            accountDetails,
            initialValue,
            userId
        })
        await account.save()
        delete account._doc.id
        delete account._doc.__v
        return {account}
    } catch (error) {
        throw serverError(error.message)
    }
}

export default {createAccount}