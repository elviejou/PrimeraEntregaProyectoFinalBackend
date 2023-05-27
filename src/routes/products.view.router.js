import {Router} from "express"
import productModel from "../models/product.model.js"

const router = Router()

const auth = (req, res, next) => {
    if (req.session.user) return next()
    return res.send('Error de authentication')
}

router.get("/", auth, async (req, res) => {

    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
 

    const search = {}
    if(filter) {
        search.title = filter
    }
    const options = {
        limit, 
        page, 
        lean: true
    }
    
    const data = await productModel.paginate(search, options)
    console.log(JSON.stringify(data, null, 2, '\t'));


    res.render('products', data)
})

export default router