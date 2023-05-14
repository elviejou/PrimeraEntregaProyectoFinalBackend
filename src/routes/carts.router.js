import { Router } from 'express'
const router = Router()



//FUNCION PARA LEER LO QUE ASIGNEMOS A "FILENAME" (TODOS LOS ARCHIVOS QUE ESTAN DENTRO DE LA CARPETA DATA)
function readFile(filename) {
  console.log('Reading file:', filename);
  return new Promise((resolve, reject) => {
    fs.readFile(`./src/data/${filename}`, 'utf8', (err, data) => { //RUTA DE LOS ARCHIVOS
      if (err) {
        reject(err);
      } else {
        try {
          const parsedData = JSON.parse(data);
          if (Array.isArray(parsedData)) {
            resolve(parsedData);
          } else {
            resolve();
          }
        } catch (error) {
          resolve();
        }
      }
    });
  });
}

//FUNCION PARA ESCRIBIR A LO QUE ASIGNEMOS A "FILENAME" (TODOS LOS ARCHIVOS QUE ESTAN DENTRO DE LA CARPETA DATA)
function writeFile(filename, data) {
   return new Promise((resolve, reject) => {
      fs.writeFile(`./src/data/${filename}`, JSON.stringify(data), (err) => { //RUTA DE LOS ARCHIVOS
         if (err) {
            reject(err);
         } else {
            resolve();
         }
      });
   });
}

// CREAR U NUEVO CARRITO
router.post('/', async (req, res) => {
  const cart = req.body;
  cart.id = Math.floor(Math.random() * 10000) + 1; //ID UNICO
  cart.products = [];

  // LEEMOS ARCHIVO CARRITOS.JSON
  let carts = await readFile('carritos.json');
  if (!carts) {
     carts = [];
  }

  // PUSHEAMOS AGREGAMOS EL NUEVO CARRITO AL ARCHIVO CARRITOS.JSON
  carts.push(cart);
  await writeFile('carritos.json', carts);

  // ENVIAMOS LOS DATOS AL CLIENTE
  res.json(cart);
});

// AGREGAMOS UN PRODUCTO AL CARRITO
router.post('/:cid/products', async (req, res) => {
   const products = await readFile('productos.json'); //LEEMOS LOS DATOS DEL ARCHIVO PRODUCTOS.JSON
   const product = products.find((p) => p.id === parseInt(req.body.productId)); //BUSCA SI EL ID DEL PRODUCTO COINCIDE CON EL QUE QUEREMOS AGREGAR
   if (!product) {
      return res.status(404).send('Producto no encontrado');
   }

   const carts = await readFile('carritos.json'); //LEEMOS LOS DATOS DEL ARCHIVO CARRITOS.JSON
   const cartIndex = carts.findIndex((c) => c.id === parseInt(req.params.cid)); //BUSCA SI EL ID DEL CARRITO COINCIDE PARA AGREGAR PRODUCTOS
   if (cartIndex === -1) {
          return res.status(404).send('Carrito no encontrado');
   }

   const existingProductIndex = carts[cartIndex].products.findIndex((p) => p.id === product.id); 
   if (existingProductIndex !== -1) {
      carts[cartIndex].products[existingProductIndex].quantity++; //SI EL PRODUCTO QUE QUEREMOS AGREGAR YA SE ENCUENTRA EN EL CARRTO LE SUMA UNO A LA CATIDAD
   } else {
      carts[cartIndex].products.push({ ...product, quantity: 1 }); //SI EL PRODUCTO QUE QUEREMOS AGREGAR NO SE ENCUENTRA EN EL CARRTO LO AGREGA
   }

   await writeFile('carritos.json', carts); 

   res.json(carts[cartIndex]);
});

export default router
