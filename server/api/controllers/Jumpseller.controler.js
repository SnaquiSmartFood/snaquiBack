/* eslint-disable no-unused-vars */
const jumpsaleApi = require("../../utils/AxiosJumpsale");

const responseFormater = require("../../utils/ResponseFormater");

const JumpsellerController = {};

//aqui se modifica los lugares del administrador
/**
 * Search paginate list of jumpseller products the filters could be all, status or categories
 *
 */
JumpsellerController.getProducts = async (req, res, next) => {
  const { status, category } = req.query;
  const pageNumber = parseInt(req.query.page?.number || 1);
  const numberitemsInPage = parseInt(req.query.page?.size || 50);
  let url = "/products";
  if (status) {
    url += `/status/${status}`;
  } else if (category) {
    url += `/category/${category}`;
  }
  try {
    const { data, status = 200 } = await jumpsaleApi.get(`${url}.json`, {
      params: {
        page: pageNumber,
        limit: numberitemsInPage,
      },
    });
    const countProducts = await jumpsaleApi.get(`${url}/count.json`);
    const formatedResponse = responseFormater({
      code: status,
      data: data,
      startInZero: false,
      currentPage: pageNumber,
      perPage: numberitemsInPage,
      totalItems: countProducts?.data?.count || 0,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};
//obtener lugares por cercania para recomendaciones
/**
 * Get the information of a jumpseller product by id
 *
 */
JumpsellerController.getProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    next({
      statusCode: 505,
      message: "No ID defined",
      type: "E_ERROR",
    });
    return;
  }
  let url = `/products/${id}.json`;
  try {
    const { data, status = 200 } = await jumpsaleApi.get(`${url}`);
    const formatedResponse = responseFormater({
      code: status,
      data: data,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * Update the information of a jumpseller product by id
 *
 */
JumpsellerController.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { categories } = req.body;
  if (!id) {
    next({
      statusCode: 505,
      message: "No ID defined",
      type: "E_ERROR",
    });
    return;
  }
  let url = `/products/${id}.json`;
  try {
    const { data: productData } = await jumpsaleApi.get(`${url}`);
    const product = { ...productData.product };
    const { data, status = 200 } = await jumpsaleApi.put(`${url}`, {
      product: product,
    });
    const formatedResponse = responseFormater({
      code: status,
      data: data,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 *
 * Create a categorie the information of a jumpseller product by id
 * @returns
 */
JumpsellerController.createCategory = async (req, res, next) => {
  //https://api.jumpseller.com/v1/categories.json
  let url = `/categories.json`;
  const { name } = req.body;
  if (!name) {
    next({
      statusCode: 505,
      message: "No name defined",
      type: "E_ERROR",
    });
    return;
  }
  try {
    const parentId = parseInt(process.env.CATEGORY_COMPANY_ID);
    const { data, status = 200 } = await jumpsaleApi.post(`${url}`, {
      category: {
        name: `${name}`.toLowerCase(),
        parent_id: parentId,
      },
    });
    const formatedResponse = responseFormater({
      code: status,
      data: data.category,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * Toggle a category of a jumpseller product by id
 *
 */
JumpsellerController.toggleCategory = async (req, res, next) => {
  const { categoryID, productID } = req.body;
  if (!(categoryID && productID)) {
    next({
      statusCode: 505,
      message: "No ID defined",
      type: "E_ERROR",
    });
    return;
  }
  let url = `/products/${productID}.json`;
  try {
    const { data: productData } = await jumpsaleApi.get(`${url}`);
    const product = { ...productData.product };
    const categoriesList = [...product.categories];
    const indexCategory = categoriesList.findIndex((category) => {
      return parseInt(category.id) === parseInt(categoryID);
    });
    if (indexCategory >= 0) {
      categoriesList.splice(indexCategory, 1);
    } else {
      categoriesList.push({
        id: categoryID,
      });
    }
    product.categories = categoriesList;
    const { data, status = 200 } = await jumpsaleApi.put(`${url}`, {
      product: product,
    });
    const formatedResponse = responseFormater({
      code: status,
      data: data,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * get a customer of a jumpseller
 *
 */
JumpsellerController.getJumpsellerCustomer = async (req, res, next) => {
  const pageNumber = parseInt(req.query.page?.number || 1);
  const numberitemsInPage = parseInt(req.query.page?.size || 50);
  let url = "/customers";
  try {
    const { data, status = 200 } = await jumpsaleApi.get(`${url}.json`, {
      params: {
        page: pageNumber,
        limit: numberitemsInPage,
      },
    });
    const countProducts = await jumpsaleApi.get(`${url}/count.json`);
    const formatedResponse = responseFormater({
      code: status,
      data: data,
      startInZero: false,
      currentPage: pageNumber,
      perPage: numberitemsInPage,
      totalItems: countProducts?.data?.count || 0,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * get a customer by ID of a jumpseller
 *
 */
JumpsellerController.getJumpsellerCustomerByID = async (req, res, next) => {
  const { id } = req.params;
  let url = `/customers/${id}`;
  try {
    const { data, status = 200 } = await jumpsaleApi.get(`${url}.json`);
    const formatedResponse = responseFormater({
      code: status,
      data: data.customer,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * get a customer of a jumpseller
 *
 */
JumpsellerController.setJumpsellerCustomer = async (req, res, next) => {
  const {
    email,
    phone,
    password,
    name,
    surname,
    shipping_address,
    billing_address,
  } = req.body;
  let url = "/customers";
  try {
    const datatoSend = {
      customer: {
        email,
        phone,
        password,
        name,
        surname,
        //status: "approved",
        //customer_category: [0],
      },
    };
    /*
    billing_address = {
      name: "",
      surname: "",
      taxid: "",
      address: "",
      city: "",
      postal: "",
      municipality: "",
      region: "",
      country: "",
    }
    */
    if (billing_address) {
      datatoSend.customer.billing_address = billing_address;
    }
    /*
    shipping_address = {
      name: "",
      surname: "",
      address: "",
      city: "",
      postal: "",
      municipality: "",
      region: "",
      country: "",
    }
    */
    if (shipping_address) {
      datatoSend.customer.shipping_address = shipping_address;
    }
    const { data, status = 200 } = await jumpsaleApi.post(
      `${url}.json`,
      datatoSend
    );
    const formatedResponse = responseFormater({
      code: status,
      data: data.customer,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};
/**
 * Update a customer of a jumpseller
 *
 */
JumpsellerController.updateJumpsellerCustomer = async (req, res, next) => {
  const { phone, name, surname, shipping_address, billing_address } = req.body;
  const { id } = req.params;
  let url = `/customers/${id}`;
  try {
    const datatoSend = {
      customer: {},
    };
    if (phone) {
      datatoSend.customer.phone = phone;
    }
    if (name) {
      datatoSend.customer.name = name;
    }
    if (surname) {
      datatoSend.customer.surname = surname;
    }
    if (billing_address) {
      datatoSend.customer.billing_address = billing_address;
    }
    if (shipping_address) {
      datatoSend.customer.shipping_address = shipping_address;
    }
    const { data, status = 200 } = await jumpsaleApi.put(
      `${url}.json`,
      datatoSend
    );
    const formatedResponse = responseFormater({
      code: status,
      data: data.customer,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

/**
 * Create a order
 *
 */
JumpsellerController.createOrderJumpseller = async (req, res, next) => {
  const { status = "Pending Payment", customerID, products = [] } = req.body;

  let url = "/orders";
  try {
    const datatoSend = {
      order: {
        status: status,
        shipping_required: false,
        customer: {
          id: customerID,
        },
        products: products,
      },
    };
    const { data, status = 200 } = await jumpsaleApi.post(
      `${url}.json`,
      datatoSend
    );
    const formatedResponse = responseFormater({
      code: status,
      data: data,
    });
    res.status(formatedResponse.meta.statusCode).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

module.exports = JumpsellerController;
