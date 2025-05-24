
export const NUM_PRODUCTS_IN_PAGE = 2;

export interface CreateProductPayload {
  category: ProductCategory;
  data: any;
}

export interface UpdateProductPayload {
  category: ProductCategory;
  id: string;
  data: any;
}

export interface DeleteProductPayload {
  category: ProductCategory;
  id: string;
}


// Enum for product conditions
export enum ProductCondition {
  NEW = "New",
  USED = "Used",
  GOOD_CONDITION = "Good Condition",
}

// זמינות מוצר
export enum ProductAvailability {
  AVAILABLE = "Available",
  INTERESTED = "Interested",
  PENDING = "Pending",
  EXCHANGED = "Exchanged",
}

// תוויות זמינות
export const productAvailabilityLabels: Record<ProductAvailability, string> = {
  [ProductAvailability.AVAILABLE]: "זמין",
  [ProductAvailability.INTERESTED]: "מעוניינים",
  [ProductAvailability.PENDING]: "בתהליך החלפה",
  [ProductAvailability.EXCHANGED]: "הוחלף",
};

export const productConditionLabels: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: "חדש",
  [ProductCondition.USED]: "משומש",
  [ProductCondition.GOOD_CONDITION]: "במצב טוב",
};

export function getProductConditionLabel(category: ProductCondition): string {
  return productConditionLabels[category] || category;
}

// Enum for product categories
export enum ProductCategory {
  PUZZLE = "Puzzle",
  BOOK = "Book",
  BOARD_GAME = "Board Game",
}

export enum PuzzleSubcategory {
  NATURE = "Nature",
  ART = "Art",
  KIDS = "Kids",
  THREE_D = "3 D", // כן, יש רווח וזה חוקי אם זה תואם ל־DB
}

export const productCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.PUZZLE]: "פאזל",
  [ProductCategory.BOOK]: "ספר",
  [ProductCategory.BOARD_GAME]: "משחק קופסה",
};

export function getProductCategoryLabel(category: ProductCategory): string {
  return productCategoryLabels[category] || category;
}

export enum BookSubcategory {
  ROMANCE = "Romance",
  THRILLER = "Thriller",
  FANTASY = "Fantasy",
  SCIFI = "Sci-Fi",
  CHILDREN = "Children",
  NON_FICTION = "Non-fiction",
  BIOGRAPHY = "Biography",
  TEXTBOOK = "Textbook",
}

export enum BoardGameSubcategory {
  STRATEGY = "Strategy",
  KIDS = "Kids",
  PARTY = "Party",
  PUZZLE = "Puzzle",
  TWO_PLAYER = "Two-player",
  GROUP = "Group",
  FAMILY = "Family",
}

// Base product interface
export interface IProductBase {
  product_id: number;
  user_id: number;
  title: string;
  description: string;
  category: ProductCategory;
  subcategory?: string; // Optional since not all products may have subcategories
  condition: ProductCondition;
  location: string;
  image_url?: string | null; // Optional, as some products may not have images
  created_at: string; // ISO date string
  updated_at?: string; // Optional, if tracking updates
  availability: ProductAvailability;
  status: string; // Status of the product (e.g., available, pending, exchanged)
  name?: string; // Owner's name, optional for some operations
}

// Specific product types
export interface IPuzzleProduct extends IProductBase {
  category: ProductCategory.PUZZLE;
  subcategory?: PuzzleSubcategory;
  manufacturer?: string;
  piecesCount?: number;
}

export interface IBookProduct extends IProductBase {
  category: ProductCategory.BOOK;
  subcategory?: BookSubcategory;
  author?: string;
  publish_year?: number;
  publisher?: string;
  page_count?: number;
}

export interface IBoardGameProduct extends IProductBase {
  category: ProductCategory.BOARD_GAME;
  subcategory?: BoardGameSubcategory;
  game_name?: string;
  min_players?: number;
  max_players?: number;
  duration?: number; // Duration in minutes
}

export const subcategoryMaps = {
  [ProductCategory.BOOK]: {
    fromLabel: {
      רומן: BookSubcategory.ROMANCE,
      מותחן: BookSubcategory.THRILLER,
      פנטזיה: BookSubcategory.FANTASY,
      "מדע בדיוני": BookSubcategory.SCIFI,
      ילדים: BookSubcategory.CHILDREN,
      עיון: BookSubcategory.NON_FICTION,
      ביוגרפיה: BookSubcategory.BIOGRAPHY,
      "ספר לימוד": BookSubcategory.TEXTBOOK,
    },
    toLabel: {
      [BookSubcategory.ROMANCE]: "רומן",
      [BookSubcategory.THRILLER]: "מותחן",
      [BookSubcategory.FANTASY]: "פנטזיה",
      [BookSubcategory.SCIFI]: "מדע בדיוני",
      [BookSubcategory.CHILDREN]: "ילדים",
      [BookSubcategory.NON_FICTION]: "עיון",
      [BookSubcategory.BIOGRAPHY]: "ביוגרפיה",
      [BookSubcategory.TEXTBOOK]: "ספר לימוד",
    },
  },
  [ProductCategory.PUZZLE]: {
    fromLabel: {
      טבע: PuzzleSubcategory.NATURE,
      אמנות: PuzzleSubcategory.ART,
      ילדים: PuzzleSubcategory.KIDS,
      "תלת מימד": PuzzleSubcategory.THREE_D,
    },
    toLabel: {
      [PuzzleSubcategory.NATURE]: "טבע",
      [PuzzleSubcategory.ART]: "אמנות",
      [PuzzleSubcategory.KIDS]: "ילדים",
      [PuzzleSubcategory.THREE_D]: "תלת מימד",
    },
  },
  [ProductCategory.BOARD_GAME]: {
    fromLabel: {
      אסטרטגיה: BoardGameSubcategory.STRATEGY,
      ילדים: BoardGameSubcategory.KIDS,
      מסיבה: BoardGameSubcategory.PARTY,
      חידות: BoardGameSubcategory.PUZZLE,
      "שני שחקנים": BoardGameSubcategory.TWO_PLAYER,
      קבוצתי: BoardGameSubcategory.GROUP,
      משפחתי: BoardGameSubcategory.FAMILY,
    },
    toLabel: {
      [BoardGameSubcategory.STRATEGY]: "אסטרטגיה",
      [BoardGameSubcategory.KIDS]: "ילדים",
      [BoardGameSubcategory.PARTY]: "מסיבה",
      [BoardGameSubcategory.PUZZLE]: "חידות",
      [BoardGameSubcategory.TWO_PLAYER]: "שני שחקנים",
      [BoardGameSubcategory.GROUP]: "קבוצתי",
      [BoardGameSubcategory.FAMILY]: "משפחתי",
    },
  },
};

export const getSubcategoryLabel = (
  category: ProductCategory,
  subcategoryValue: string
): string => {
  const toLabel = subcategoryMaps[category]?.toLabel;
  return toLabel?.[subcategoryValue as keyof typeof toLabel] || subcategoryValue;
};

export const getSubcategoryValueFromLabel = (
  category: ProductCategory,
  label: string
): string => {
  const fromLabel = subcategoryMaps[category]?.fromLabel;
  return fromLabel?.[label as keyof typeof fromLabel] || label;
};


// General product type (union of all specific products)
export type IProduct = IPuzzleProduct | IBookProduct | IBoardGameProduct;

export type IProductWithOwnerName = IProduct & { name: string };
