// services/productFilterService.js

function buildProductFilters(params, userId = null) {
  const conditions = [];
  const values = [];

  let paramIndex = 1;
  if (userId) {
    conditions.push(`user_id = $${paramIndex++}`);
    values.push(userId);
  }

  const filterMap = [
    { key: 'search', clause: (i) => `(LOWER(title) LIKE $${i} OR LOWER(description) LIKE $${i})`, transform: (v) => `%${v.toLowerCase()}%` },
    { key: 'category', clause: (i) => `category = $${i}` },
    { key: 'subcategory', clause: (i) => `subcategory = $${i}` },
    { key: 'condition', clause: (i) => `condition = $${i}` },
    { key: 'availability', clause: (i) => `availability = $${i}` },
    { key: 'location', clause: (i) => `location ILIKE $${i}`, transform: (v) => `%${v}%` },
    { key: 'from', clause: (i) => `created_at >= $${i}` },
    { key: 'to', clause: (i) => `created_at <= $${i}` },
    { key: 'author', clause: (i) => `b.author ILIKE $${i}`, transform: (v) => `%${v}%` },
    { key: 'publisher', clause: (i) => `b.publisher ILIKE $${i}`, transform: (v) => `%${v}%` },
    { key: 'publish_year', clause: (i) => `b.publish_year = $${i}` },
    { key: 'manufacturer', clause: (i) => `pz.manufacturer ILIKE $${i}`, transform: (v) => `%${v}%` },
    { key: 'piecesCount', clause: (i) => `pz.pieces_count = $${i}` },
    { key: 'min_players', clause: (i) => `bg.min_players <= $${i}` },
    { key: 'max_players', clause: (i) => `bg.max_players >= $${i}` },
    { key: 'duration', clause: (i) => `bg.duration <= $${i}` },
  ];

  for (const { key, clause, transform } of filterMap) {
    if (params[key]) {
      values.push(transform ? transform(params[key]) : params[key]);
      conditions.push(clause(paramIndex++));
    }
  }

  return { whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values, nextParamIndex: paramIndex };
}

module.exports = { buildProductFilters };
