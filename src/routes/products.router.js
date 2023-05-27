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




router.get("/view", async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts', {
        data: products
    })
})

//LISTAMOS LOS PRODUCTOS localhost:8080/products/

const auth = (req, res, next) => {
    if (req.session.user) return next()
    return res.send('Debe esyat loguead para ver los productos')
}

router.get('/', auth, async  (req, res) => {
    try {
        let page = parseInt(req.query.page)
        if (!page) page = 1
        const result = await productModel.paginate({}, {page, limit:5, lean: true})

        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : 'products'
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : 'products'
        console.log(result)
        res.render('listProducts', { products: result.docs, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage, nextLink: result.nextLink, prevLink: result.prevLink });
    } catch (error) {
        console.error(error)
        res.status(500).send('Hubo un error al intentar obtener los productos.')
    }
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