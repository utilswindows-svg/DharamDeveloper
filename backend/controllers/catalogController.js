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

// Map of color tokens used in the catalog -> concrete hex values for SVG fills
const COLOR_HEX = {
  'text-primary': '#2563eb',
  'text-accent':  '#f59e0b',
  'text-success': '#10b981',
  'text-teal':    '#14b8a6',
};

const escapeXml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wrapText = (str, maxChars) => {
  const words = String(str || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line ? line + ' ' : '') + w;
    }
  }
  if (line) lines.push(line);
  return lines;
};

// GET /catalog/products/:slug/og.svg — dynamic 1200x630 OG image
exports.getProductOgImage = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, active: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'key', 'label'] }],
    });
    if (!product) throw new ApiError(404, 'Product not found');

    const accent = COLOR_HEX[product.color] || '#2563eb';
    const categoryLabel = product.category?.label || 'WindowsUtils';
    const titleLines = wrapText(product.title, 28).slice(0, 2);
    const taglineLines = wrapText(product.tagline || '', 60).slice(0, 2);
    const startingPrice = product.startingPrice != null ? `From $${Number(product.startingPrice)}` : null;

    const titleSvg = titleLines
      .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 80}">${escapeXml(line)}</tspan>`)
      .join('');
    const taglineSvg = taglineLines
      .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 40}">${escapeXml(line)}</tspan>`)
      .join('');

    const titleStartY = 280 - (titleLines.length - 1) * 40;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="220" fill="${accent}" opacity="0.12"/>
  <circle cx="1100" cy="540" r="160" fill="${accent}" opacity="0.08"/>
  <rect x="0" y="0" width="8" height="630" fill="url(#accent)"/>

  <!-- Category badge -->
  <rect x="80" y="80" rx="24" ry="24" width="${30 + categoryLabel.length * 11}" height="48" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.5"/>
  <text x="${80 + (30 + categoryLabel.length * 11) / 2}" y="111" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="${accent}" text-anchor="middle">${escapeXml(categoryLabel.toUpperCase())}</text>

  <!-- Title -->
  <text x="80" y="${titleStartY}" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff">${titleSvg}</text>

  <!-- Tagline -->
  <text x="80" y="${titleStartY + 80}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400" fill="#cbd5e1">${taglineSvg}</text>

  ${startingPrice ? `
  <!-- Price pill -->
  <rect x="80" y="490" rx="32" ry="32" width="220" height="64" fill="${accent}"/>
  <text x="190" y="532" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(startingPrice)}</text>` : ''}

  <!-- Brand -->
  <text x="1120" y="585" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="end">WindowsUtils</text>
  <text x="1120" y="610" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#94a3b8" text-anchor="end">windowsutils.lovable.app/products/${escapeXml(product.slug)}</text>
</svg>`;

    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(svg);
  } catch (e) { next(e); }
};