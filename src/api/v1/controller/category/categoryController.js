import { categoryLibs } from "../../../../libs/index.js";

const create = async(req, res, next)=>{
    try {
    const {name} = req.body
    const category = await categoryLibs.createCategory(name)

    const result = {
        code: 201,
        message: 'Category create success!',
        data:{
            ...category
        }
    }
    return res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}


export default create