import express from 'express'
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
import productModel from "./models/product.model.js"
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionRouter from './routes/session.router.js'




const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//MOTOR DE PLANTILLA
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


app.use(express.static('.src/public'));


const DB = [ {
  username: 'admintest',
  password: 'admintest',
  role: 'admin'
}]


//LOGIN http://localhost:8080/api/login?username=admintest&password=admintest
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://exequielcalo:9jcJ0oakOocnwH8y@martinexequielbackend.pwaqhb5.mongodb.net/backend-martinExequiel',
    dbName: 'backend-martinExequiel'
  }),
  secret: 'sercreto',
  resave: true,
  saveUninitialized: true
}));

const auth = (req, res, next) => {
  if (req.session.user) return next()
  return res.send('Authentication error')
}

app.get('/api/login', (req, res) => {
  const { username, password } = req.query
  const user = DB.find(u => u.username === username && u.password === password)
  if (!user) return res.send('Invalid credentials')
  req.session.user = user
  res.send('Login success!')
})

app.get('/api/private', auth, (req, res) => {
  res.send('Welcome!!')
})

app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) return res.send('Logout error')
  })
  return res.send('Logout success')
})


// INGRESAMOS MEDIANTE localhost:8080/products/
app.get('/', (req, res) => res.send('Backend E-commerce!'))
app.use('/products', productsRouter);
app.use('/sessions', sessionRouter)
// INGRESAMOS MEDIANTE localhost:8080/carts/
// app.use('/carts', cartsRouter);

mongoose.set('strictQuery', false)
try {
    await mongoose.connect('mongodb+srv://exequielcalo:9jcJ0oakOocnwH8y@martinexequielbackend.pwaqhb5.mongodb.net/backend-martinExequiel')
    app.listen(8080, () => console.log('Server Up'))
  } catch (error) {
    console.log('No se pude conectar con la BD')
  }
