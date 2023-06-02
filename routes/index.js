const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const documentation = fs.readFileSync('./documentation.yml', 'utf8');
const swaggerDocument = YAML.parse(documentation);
router.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const middlewares = require('../utils/middlewares');
const storage = require('../utils/strorage');

const user = require('../controllers/user');
const supplier = require('../controllers/supplier');
const component = require('../controllers/component');
const product = require('../controllers/product');
const componentSupplier = require('../controllers/componentSupplier');
const productComponent = require('../controllers/productComponent');
const media = require('../controllers/media');


router.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Factory RESTfull API' }));

router.post('/auth/register', user.register); // register user
router.post('/auth/login', user.login); // login user
router.get('/auth/oauth', user.googleOauth2); // login user using OAuth2
router.get('/auth/whoami', middlewares.auth, user.whoami);// get user

router.use(middlewares.auth);

router.get('/suppliers', supplier.index); // get all supplier
router.post('/suppliers', supplier.store); // create new supplier
router.get('/suppliers/:id', supplier.show); // get detail supplier
router.put('/suppliers/:id', supplier.update); // update supplier
router.delete('/suppliers/:id', supplier.destroy); // delete supplier

router.get('/components', component.index); // get all cumponent
router.post('/components', component.store); // create new cumponent
router.get('/components/:id', component.show); // get detail cumponent
router.put('/components/:id', component.update); // update cumponent
router.delete('/components/:id', component.destroy); // delete cumponent

router.get('/products', product.index); // get all product
router.post('/products', product.store); // create new product
router.get('/products/:id', product.show); // get detail product
router.put('/products/:id', product.update); // update product
router.delete('/products/:id', product.destroy); // delete product

router.post('/ComponentSuppliers', componentSupplier.store); // add relation component and supplier
router.delete('/ComponentSuppliers', componentSupplier.destroy); // remove relation component and supplier

router.post('/productComponents', productComponent.store); // add relation product and component
router.delete('/productComponents', productComponent.destroy); // remove relation product and component

router.post('/storage/images', storage.image.single('media'), media.strogeSingle); // upload single image file
router.post('/storage/multi/images', storage.image.array('media'), media.storageArray); // upload multiple image file

module.exports = router;
