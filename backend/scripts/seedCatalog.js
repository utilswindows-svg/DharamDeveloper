require('dotenv').config();
const { sequelize, Category, Product } = require('../models');

const CATEGORIES = [
  { key: 'email',        label: 'Email & Migration', description: 'Migrate, convert, and export email data across formats and platforms.', sortOrder: 1 },
  { key: 'pdf',          label: 'PDF Tools',         description: 'Unlock, merge, split, compress, and convert PDF documents.',           sortOrder: 2 },
  { key: 'recovery',     label: 'Data Recovery',     description: 'Recover lost or deleted files from any storage device.',                sortOrder: 3 },
  { key: 'optimization', label: 'PC Optimization',   description: 'Speed up Windows, free disk space, and boost system performance.',     sortOrder: 4 },
];

// Maps slug -> { categoryKey, icon (lucide name), color, sortOrder, featured }
const PRODUCT_META = {
  'mbox-to-pdf':   { categoryKey: 'email',        icon: 'Mail',       color: 'text-primary', sortOrder: 1, featured: true  },
  'pst-migration': { categoryKey: 'email',        icon: 'FileInput',  color: 'text-accent',  sortOrder: 2, featured: false },
  'msg-migration': { categoryKey: 'email',        icon: 'MailOpen',   color: 'text-success', sortOrder: 3, featured: false },
  'msg-to-pdf':    { categoryKey: 'email',        icon: 'FileOutput', color: 'text-teal',    sortOrder: 4, featured: false },
  'pdf-tools':     { categoryKey: 'pdf',          icon: 'FileText',   color: 'text-accent',  sortOrder: 1, featured: true  },
  'data-recovery': { categoryKey: 'recovery',     icon: 'HardDrive',  color: 'text-primary', sortOrder: 1, featured: false },
  'pc-optimizer':  { categoryKey: 'optimization', icon: 'Cpu',        color: 'text-success', sortOrder: 1, featured: false },
};

/**
 * Loads the rich ProductData map from the frontend's TS source so we can
 * keep a single source of truth for descriptive content. The TS file uses
 * `import` syntax + asset imports — we strip those and stub their values.
 */
function loadProductsFromTs() {
  const fs = require('fs');
  const path = require('path');
  const tsPath = path.resolve(__dirname, '../../src/data/products.ts');
  let src = fs.readFileSync(tsPath, 'utf8');

  // Drop type-only constructs and asset imports
  src = src.replace(/^import .*?;$/gm, '');
  src = src.replace(/^export\s+interface[\s\S]*?^\}$/gm, '');
  src = src.replace(/:\s*(LicenseData|ReviewData|ScreenshotData|ProductData)(\[\])?/g, '');
  src = src.replace(/Record<[^>]+>/g, 'Object');
  src = src.replace(/^export\s+/gm, '');

  // Stub identifiers that came from imports (lucide icons, asset modules).
  // Build by scanning for imported names in original file.
  const original = fs.readFileSync(tsPath, 'utf8');
  const imported = new Set();
  for (const m of original.matchAll(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"][^'"]+['"]/g)) {
    if (m[1]) m[1].split(',').forEach((n) => imported.add(n.trim()));
    if (m[2]) imported.add(m[2].trim());
  }
  const stubs = [...imported].map((n) => `var ${n} = ${n.endsWith('Video') ? '{ url: "" }' : '"__stub__"'};`).join('\n');

  const wrapped = `${stubs}\n${src}\nreturn products;`;
  // eslint-disable-next-line no-new-func
  const fn = new Function(wrapped);
  return fn();
}

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const catMap = {};
    for (const c of CATEGORIES) {
      const [row] = await Category.upsert(c, { returning: true });
      catMap[c.key] = row.id;
    }

    for (const p of PRODUCTS) {
      const { categoryKey, ...rest } = p;
      await Product.upsert({ ...rest, categoryId: catMap[categoryKey] || null });
    }

    console.log(`✅ Seeded ${CATEGORIES.length} categories and ${PRODUCTS.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();