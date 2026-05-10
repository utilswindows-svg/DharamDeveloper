const { Category, Product } = require('../models');
const ApiError = require('../utils/ApiError');

// GET /catalog/categories — list active categories
exports.listCategories = async (req, res, next) => {
  try {
    const cats = await Category.findAll({
      where: { active: true },
      order: [['sortOrder', 'ASC'], ['label', 'ASC']],
    });
    res.json({ success: true, categories: cats });
  } catch (e) { next(e); }
};

// GET /catalog/products?category=<key>&search=<term>
// Returns products grouped under their categories.
exports.listProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const productWhere = { active: true };
    if (search && String(search).trim()) {
      const { Op } = require('sequelize');
      const term = `%${String(search).trim()}%`;
      productWhere[Op.or] = [
        { title: { [Op.like]: term } },
        { tagline: { [Op.like]: term } },
        { description: { [Op.like]: term } },
      ];
    }

    const categoryWhere = { active: true };
    if (category && category !== 'all') categoryWhere.key = category;

    const cats = await Category.findAll({
      where: categoryWhere,
      order: [['sortOrder', 'ASC'], ['label', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        where: productWhere,
        required: false,
        order: [['sortOrder', 'ASC'], ['title', 'ASC']],
      }],
    });

    // Flat list as well (handy for clients that don't want grouping)
    const products = await Product.findAll({
      where: productWhere,
      order: [['sortOrder', 'ASC'], ['title', 'ASC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'key', 'label'] }],
    });

    res.json({
      success: true,
      categories: cats,
      products,
      total: products.length,
    });
  } catch (e) { next(e); }
};

// GET /catalog/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, active: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'key', 'label'] }],
    });
    if (!product) throw new ApiError(404, 'Product not found');
    res.json({ success: true, product });
  } catch (e) { next(e); }
};