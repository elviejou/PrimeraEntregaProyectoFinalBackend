import { Router } from 'express'
import productModel from '../models/product.model.js'
const router = Router()


//BORRA UN PRODUCTO (EJ: DEL localhost:8080/products/4)
router.delete('/:code', async (req, res) => {
    const code = req.params.code
    try {
        await productModel.deleteOne({ code })
        console.log("producto borrado")
        res.send(`Producto ${code} borrado exitosamente!`)
    } catch (err) {

        console.error(err)
        res.send({err})
    }
})


// MOSTRAMOS FORMLARIO PARA NUEVO PRODUCTO
router.get('/create', (req, res) => {
    res.render('createProduct', {})
})

//LISTAMOS LOS PRODUCTOS localhost:8080/products/
router.get('/', async  (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('listProducts', { products })
});


// //CREAMOS UN NUEVO PRODUCTO
router.post('/', async (req, res) => {
    const newProduct = req.body
    const productGenerated = new productModel(newProduct)
    await productGenerated.save()
    res.redirect(`/products/${productGenerated.code}`)

})
  


//LISTAMOS PRODUCTO SEGUN CODE (EJ: localhost:8080/products/1814041)
router.get('/:code', async (req, res) => {
    const code = req.params.code
    const product = await productModel.findOne({ code }).lean().exec()
    res.render('productByCode', { product })
});



// //EDITAMOS UN PRODUCTO EXISTENTE SEGUN SU CODE (EJ: PUT localhost:8080/products/4)
router.get('/update/:code', async (req, res) => {
    const code = req.params.code
    const product = await productModel.findOne({ code }).lean().exec()
    res.render('editProduct', { product })
})

export default router
