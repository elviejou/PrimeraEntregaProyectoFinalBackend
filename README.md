# Primera entrega Proyecto Final Backend
## _Martin Exequiel Caló_

## Iniciar

- Se inicia con el comando nodemon server.js

Proyecto Backend de un E-commerce.
Funcionando en la actualidad:

- Listar todos los productos en JSON
GET > localhost:8080/products/
- Listar un producto segun su id en JSON
GET > localhost:8080/products/id
- Agregar Productos (con verificación de campos)
POST > localhost:8080/products/
- Modificar productos (en caso de modificar solo un camp de producto el resto se mantiene igual)
PUT > localhost:8080/products/id/ a tarves del Body en formato json
- Eliminar productos
DEL > localhost:8080/products/id/
- Crear Carritos
POST > localhost:8080/carts/
- Agregar productos a un carrito de compras (Actualiza Cantidades si el articulo ya se encuetra en el carrito)
POST > localhost:8080/carts/IDCARRITO/products a tarves del Body en formato json
