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
 * Get country, regions or municipialy from jumpseller
 *
 */
JumpsellerController.getCountryRegionMunicipallyJumpseller = async (
  req,
  res,
  next
) => {
  const { country_code, region_code } = req.params;
  let url = `/countries`;
  if (country_code) {
    url += `/${country_code}/regions`;
  }
  if (region_code) {
    url += `/${region_code}/municipalities`;
  }
  try {
    const { data, status } = await jumpsaleApi.get(`${url}.json`);
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
JumpsellerController.createCustomerCategory = async (req, res, next) => {
  //https://api.jumpseller.com/v1/customer_categories.json
  let url = `/customer_categories.json`;
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
    const { data, status = 200 } = await jumpsaleApi.post(`${url}`, {
      customer_category: {
        name: `${name}`.toLowerCase(),
      },
    });
    const formatedResponse = responseFormater({
      code: status,
      data: data.customer_category,
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
    customer_category=[]
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
        status: "approved",
        customer_category: customer_category.map(it=>(parseInt(it))),
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
  const { phone, name, surname, shipping_address, billing_address,customer_category } = req.body;
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
    if (customer_category) {
      datatoSend.customer.customer_category = customer_category.map(i=>(parseInt(i)));
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
//orders-------------------------------------------------------------------------------------------------------------


/**
 * get a order
 *
 */
JumpsellerController.getOrder = async (req, res, next) => {

  const {id} = req.params
   let url = `/orders/${id}`;
   try {
     //configuration of the target
     const { data, status = 200 } = await jumpsaleApi.get(
       `${url}.json`,
     );
     const formatedResponse = responseFormater({
       code: status,
       data: data.order,
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
  const { status = "Pending Payment", customerID, products = [],shipping_required } = req.body;

  let url = "/orders";
  try {
    const datatoSend = {
      order: {
        status: status,
        shipping_required: shipping_required,
        customer: {
          id: customerID,
        },
        products: products,
      },
    };
    const { data, status:statusResponse = 200 } = await jumpsaleApi.post(
      `${url}.json`,
      datatoSend
    );
    const formatedResponse = responseFormater({
      code: statusResponse,
      data: data.order,
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

//promotions
/**
 * get a promotion
 *
 */
JumpsellerController.getPromotion = async (req, res, next) => {

 const {id} = req.params
  let url = `/promotions/${id}`;
  try {
    //configuration of the target
    const { data, status = 200 } = await jumpsaleApi.get(
      `${url}.json`,
    );
    const formatedResponse = responseFormater({
      code: status,
      data: data.promotion,
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
 * Create a promotion
 *
 */
JumpsellerController.setPromotion = async (req, res, next) => {
  const {
    target = "categories",
    name = "",
    type = "percentage",
    value = 0,
    products,
    categories,
    conditions = {
      type: "none",
      value: 0,
    },
    last = {
      type: "none",
      begins_at: "",
      expires_at: "",
      max_times_used: 0,
    },
    cuponCode = "",
    customer_categories = [],
    customers = "categories",
    maxUsage = 0,
    cumulative = false,
    quantity_x,
    products_x,
  } = req.body;

  let url = "/promotions";
  try {
    const datatoSend = {
      promotion: {
        name: name,
        enabled: true,
        discount_target: target,
        buys_at_least: conditions.type,
        type,
        lasts: last.type,
        cumulative,
        customers: customers,
        customer_categories: customer_categories.map(id=>({
          id:parseInt(id)
        })),
        coupons: [
          {
            code: cuponCode,
            usage_limit: maxUsage,
          },
        ],
      },
    };
    //configuration of the target

    if (target === "categories") {
      if (categories) datatoSend.promotion.categories = categories.map(id=>({
        id:parseInt(id)
      }));
      if (products) datatoSend.promotion.products = products.map(id=>({
        id:parseInt(id)
      }));
    }
    if (target === "buy_x_get_y") {
      datatoSend.promotion.quantity_x = quantity_x;
      datatoSend.promotion.products_x = products_x;
    }
    //configuration of the type of discount
    if (type === "percentage") {
      datatoSend.promotion.discount_amount_percent = value;
    } else if (type === "fix") {
      datatoSend.promotion.discount_amount_fix = value;
    }
    //configuration of the activate contidions
    if (conditions.type === "price") {
      datatoSend.promotion.condition_price = conditions.value;
    } else if (
      conditions.type === "buys_at_least" ||
      conditions.type === "qty" ||
      conditions.type === "single_item"
    ) {
      datatoSend.promotion.condition_qty = conditions.value;
    }
    //configuration of the expires conditions
    if (last.type === "date") {
      if (last.begins_at) {
        datatoSend.promotion.begins_at = last.begins_at;
      }
      if (last.expires_at) {
        datatoSend.promotion.expires_at = last.expires_at;
      }
    } else if (last.type === "max_times_used") {
      datatoSend.promotion.max_times_used = last.max_times_used;
    } else if (last.type === "both") {
      if (last.begins_at) {
        datatoSend.promotion.begins_at = last.begins_at;
      }
      if (last.expires_at) {
        datatoSend.promotion.expires_at = last.expires_at;
      }
      datatoSend.promotion.max_times_used = last.max_times_used;
    }

    const { data, status = 200 } = await jumpsaleApi.post(
      `${url}.json`,
      datatoSend
    );
    const formatedResponse = responseFormater({
      code: status,
      data: data.promotion,
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
 * Update a promotion
 *
 */
JumpsellerController.updatePromotionByID = async (req, res, next) => {
  const { id } = req.params;
  const {
    target,
    name,
    enabled,
    type,
    value,
    products,
    categories,
    conditions ,
    last,
    cumulative,
    quantity_x,
    products_x,
  } = req.body;

  let url = `/promotions/${id}`;
  try {
    const datatoSend = {
      promotion: {
      },
    };
    if (cumulative) {
      datatoSend.promotion.cumulative = cumulative;
    }
    if (name) {
      datatoSend.promotion.name = name;
    }
    if (enabled) {
      datatoSend.promotion.enabled = enabled;
    }
    //configuration of the target
    if(target) {
      datatoSend.promotion.discount_target = target;
      if (target === "categories") {
        if (categories) datatoSend.promotion.categories = categories;
        if (products) datatoSend.promotion.products = products;
      }
      if (target === "buy_x_get_y") {
        datatoSend.promotion.quantity_x = quantity_x;
        datatoSend.promotion.products_x = products_x;
      }
    }
    //configuration of the type of discount
    if (type) {
      datatoSend.promotion.type = type;
      if (type === "percentage") {
        datatoSend.promotion.discount_amount_percent = value;
      } else if (type === "fix") {
        datatoSend.promotion.discount_amount_fix = value;
      }
    }
    //configuration of the activate contidions
    if (conditions.type) {
      datatoSend.promotion.buys_at_least = conditions.type;
      if (conditions.type === "price") {
        datatoSend.promotion.condition_price = conditions.value;
      } else if (
        conditions.type === "buys_at_least" ||
        conditions.type === "qty" ||
        conditions.type === "single_item"
      ) {
        datatoSend.promotion.condition_qty = conditions.value;
      }
    }
    //configuration of the expires conditions

    if (last.type) {
      datatoSend.promotion.lasts = last.type;
      if (last.type === "date") {
        if (last.begins_at) {
          datatoSend.promotion.begins_at = last.begins_at;
        }
        if (last.expires_at) {
          datatoSend.promotion.expires_at = last.expires_at;
        }
      } else if (last.type === "max_times_used") {
        datatoSend.promotion.max_times_used = last.max_times_used;
      } else if (last.type === "both") {
        if (last.begins_at) {
          datatoSend.promotion.begins_at = last.begins_at;
        }
        if (last.expires_at) {
          datatoSend.promotion.expires_at = last.expires_at;
        }
        datatoSend.promotion.max_times_used = last.max_times_used;
      }
    }

    const { data, status = 200 } = await jumpsaleApi.put(
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
