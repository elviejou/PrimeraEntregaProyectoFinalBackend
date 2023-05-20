import express from 'express'
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
import productModel from "./models/product.model.js"
import mongoose from 'mongoose';



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



//MOTOR DE PLANTILLA
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


app.use(express.static('.src/public'));


// INGRESAMOS MEDIANTE localhost:8080/products/
app.get('/', (req, res) => res.send('Backend E-commerce!'))
app.use('/products', productsRouter);
// INGRESAMOS MEDIANTE localhost:8080/carts/
// app.use('/carts', cartsRouter);

mongoose.set('strictQuery', false)
try {
    await mongoose.connect('mongodb+srv://exequielcalo:9jcJ0oakOocnwH8y@martinexequielbackend.pwaqhb5.mongodb.net/backend-martinExequiel')
    app.listen(8080, () => console.log('Server Up'))
  } catch (error) {
    console.log('No se pude conectar con la BD')
  }
