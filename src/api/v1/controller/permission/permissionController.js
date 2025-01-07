import {permissionLibs} from '../../../../libs/index.js'

//Create permission
const create = async (req, res, next)=>{
    const {name} = req.body
    const permission = await permissionLibs.createPermission(name)

    // Send response to user
    res.status(201).json({
        code:201,
        message:"Permission has been created!",
        data: {...permission}
    })
}

export default {create}