const express = require('express');
const app = express();
const productsRouter = require('./routes/products'); //RUTA AL MANEJADOR DE PRODUCTOS
const cartsRouter = require('./routes/carts'); //RUTA AL MAEJADOR DE CARRITOS


app.use(express.json());

// INGRESAMOS MEDIANTE localhost:8080/products/
app.use('/products', productsRouter);
// INGRESAMOS MEDIANTE localhost:8080/carts/
app.use('/carts', cartsRouter);

app.listen(8080, () => { //PUERTO 8080
  console.log('Servidor iniciado en el puerto 8080');
});