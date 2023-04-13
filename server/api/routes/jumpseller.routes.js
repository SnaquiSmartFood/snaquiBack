const { Router } = require('express');
const JumpsellerController = require('../controllers/jumpseller.controler');

const JumpsellerRouter = Router({ mergeParams: true });

/*CRUD de los lugares del usuario*/


JumpsellerRouter.get('/products/:id', JumpsellerController.getProduct);
JumpsellerRouter.put('/products/:id', JumpsellerController.updateProduct);
JumpsellerRouter.get('/products', JumpsellerController.getProducts);

JumpsellerRouter.post('/categories', JumpsellerController.createCategory);
JumpsellerRouter.put('/categories/toggle', JumpsellerController.toggleCategory);

JumpsellerRouter.get('/customers/:id', JumpsellerController.getJumpsellerCustomerByID);
JumpsellerRouter.put('/customers/:id', JumpsellerController.updateJumpsellerCustomer);
JumpsellerRouter.get('/customers', JumpsellerController.getJumpsellerCustomer);
JumpsellerRouter.post('/customers', JumpsellerController.setJumpsellerCustomer);

JumpsellerRouter.post('/orders', JumpsellerController.createOrderJumpseller);

//https://api.jumpseller.com/v1/countries/{country_code}/regions/{region_code}/municipalities.json

JumpsellerRouter.get('/country/:country_code/:region_code', JumpsellerController.getCountryRegionMunicipallyJumpseller);
JumpsellerRouter.get('/country/:country_code', JumpsellerController.getCountryRegionMunicipallyJumpseller);
JumpsellerRouter.get('/country', JumpsellerController.getCountryRegionMunicipallyJumpseller);


module.exports = JumpsellerRouter;