// Enum for product conditions
export enum ProductCondition {
    NEW = "New",
    USED = "Used",
    GOOD_CONDITION = "Good Condition",
  }
  
  // Enum for product categories
  export enum ProductCategory {
    PUZZLE = "Puzzle",
    BOOK = "Book",
    BOARD_GAME = "Board Game",
  }
  
  // Enum for subcategories (extend as needed)
  export enum PuzzleSubcategory {
    JIGSAW = "Jigsaw",
    LOGIC = "Logic",
  }
  
  export enum BookSubcategory {
    FICTION = "Fiction",
    NON_FICTION = "Non-Fiction",
    SCIENCE_FICTION = "Science Fiction",
  }
  
  export enum BoardGameSubcategory {
    STRATEGY = "Strategy",
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
  }
  
  // Specific product types
  export interface IPuzzleProduct extends IProductBase {
    category: ProductCategory.PUZZLE;
    subcategory?: PuzzleSubcategory;
    manufacturer?: string;
    pieces_count?: number;
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
  
  // General product type (union of all specific products)
  export type IProduct = IPuzzleProduct | IBookProduct | IBoardGameProduct;
  