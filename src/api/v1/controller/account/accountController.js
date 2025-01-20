import { accountLibs } from "../../../../libs/index.js";
import { userRelationDataCheck } from "../../../../utils/error.js";

//create account on db
const create = async(req, res, next)=>{
    
    try {
        const {name, accountDetails, initialValue, userId} = req.body
        
        if(userId){
            await userRelationDataCheck(userId)
        }else{
            userId = req.user._id
        }

        const {account} = await accountLibs.createAccount({name, accountDetails, initialValue, userId})
        const result = {
            code: 201,
            message: 'account create success!',
            data:{
                ...account._doc
            }
        }
        console.log(result);
        
        return res.status(201).json(result);
    }
     catch (error) {
        next(error)
    }
}

export default create