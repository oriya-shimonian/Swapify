function buildProductFilters(query, options = {}) {
  const {
    includeSearch = true,
    includeAvailabilityDefault = true,
    excludeUserId = null, // נשתמש בזה ל־excludeMyProducts
  } = options;

  const conditions = [];
  const values = [];
  let index = 1;

  const add = (sql, val) => {
    conditions.push(sql.replace("?", `$${index}`));
    values.push(val);
    index++;
  };

  // זמינות
  if (query.availability) {
    add("Products.availability = ?", query.availability);
  } else if (includeAvailabilityDefault) {
    conditions.push("Products.availability IN ('Available', 'Interested')");
  }

  // חיפוש חופשי
  if (includeSearch && typeof query.search === "string" && query.search.trim()) {
    const searchVal = `%${query.search.trim()}%`;
    values.push(searchVal);
    const searchIndex = `$${index}`;
    index++;
    const ors = [
      `Products.title ILIKE ${searchIndex}`,
      `Products.description ILIKE ${searchIndex}`,
      `Products.subcategory ILIKE ${searchIndex}`,
      `Users.name ILIKE ${searchIndex}`,
      `b.author ILIKE ${searchIndex}`,
      `b.publisher ILIKE ${searchIndex}`,
      `pz.manufacturer ILIKE ${searchIndex}`,
    ];
    conditions.push(`(${ors.join(" OR ")})`);
  }

  if (query.category) add("Products.category = ?", query.category);
  if (query.subcategory) add("Products.subcategory = ?", query.subcategory);
  if (query.location) add("Products.location ILIKE ?", `%${query.location}%`);
  if (query.from) add("Products.created_at >= ?", query.from);
  if (query.to) add("Products.created_at < ?::date + INTERVAL '1 day'", query.to);
  if (query.author) add("b.author ILIKE ?", `%${query.author}%`);
  if (query.publisher) add("b.publisher ILIKE ?", `%${query.publisher}%`);
  if (query.publish_year) add("b.publish_year = ?", query.publish_year);
  if (query.manufacturer) add("pz.manufacturer ILIKE ?", `%${query.manufacturer}%`);
  if (query.piecesCount) add("pz.pieces_count = ?", query.piecesCount);
  if (query.min_players) add("bg.min_players <= ?", query.min_players);
  if (query.max_players) add("bg.max_players >= ?", query.max_players);
  if (query.duration) add("bg.duration <= ?", query.duration);
  if (query.condition) add("Products.condition = ?", query.condition);

  if (excludeUserId) {
    add("Products.user_id != ?", excludeUserId);
  }

  return {
    whereClause: conditions.length ? "WHERE " + conditions.join(" AND ") : "",
    values,
  };
}

module.exports = { buildProductFilters };
