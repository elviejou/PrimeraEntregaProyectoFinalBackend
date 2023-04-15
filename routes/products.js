const express = require('express');
const router = express.Router();
const fs = require('fs');


//LISTAMOS LOS PRODUCTOS localhost:8080/products/
router.get('/', (req, res) => {
  const limit = req.query.limit || 10;
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));
  res.json(products.slice(0, limit));
});

//LISTAMOS PRODUCTO SEGUN ID (EJ: localhost:8080/products/2)
router.get('/:pid', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product) {
    res.status(404).send('Producto no encontrado');
    return;
  }
  res.json(product);
});

//CREMOS UN NUEVO PRODUCTO
router.post('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));

  const newProduct = {
    id: products.length + 1,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || [],
  };
  //VALIDAMOS QUE TODOS LOS CAMPOS ESTEN COMPLETOS
  const requiredFields = ['title', 'description', 'price', 'stock', 'category']; //CAMPOS REQUERIDOS
  for (const field of requiredFields) {
    if (!newProduct[field]) {
      return res.status(400).send(`El campo ${field} es requerido.`);
    }
  }
  //VERIFICA QUE EL CAMPO "CODE" NO ESTE EN ALGUN OTRO ARTICULO
  if (products.some(product => product.code === newProduct.code)) {
    return res.status(400).send(`El código ${newProduct.code} ya existe.`);
  }

  products.push(newProduct);
  fs.writeFileSync('./data/productos.json', JSON.stringify(products));
  res.json(newProduct);
});

//EDITAMOS UN PRODUCTO EXISTENTE SEGUN SU ID (EJ: PUT localhost:8080/products/4)
router.put('/:pid', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.pid)
  );
  if (productIndex === -1) {
    res.status(404).send('Producto no encontrado');
    return;
  }
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: parseInt(req.params.pid)
  };


  products[productIndex] = updatedProduct;
  fs.writeFileSync('./data/productos.json', JSON.stringify(products));
  res.json(updatedProduct);
});



//BORRA UN PRODUCTO (EJ: DEL localhost:8080/products/4)
router.delete('/:pid', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.pid)
  );
  if (productIndex === -1) {
    res.status(404).send('Producto no encontrado');
    return;
  }
  products.splice(productIndex, 1);
  fs.writeFileSync('./data/productos.json', JSON.stringify(products));
  res.send('Producto eliminado');
});

module.exports = router;