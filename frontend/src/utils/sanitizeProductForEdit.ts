import { BoardGameSubcategory, BookSubcategory, IBoardGameProduct, IBookProduct, IProduct, IProductWithOwnerName, IPuzzleProduct, ProductCategory, PuzzleSubcategory } from "@/types/products";


export function sanitizeProductForEdit(product: IProductWithOwnerName): IProduct {
  const {
    product_id,
    user_id,
    title,
    description,
    condition,
    location,
    image_url,
    created_at,
    updated_at,
    availability,
    status,
  } = product;

  switch (product.category) {
    case ProductCategory.BOOK: {
      const subcategory = product.subcategory as BookSubcategory | undefined;
      const typedProduct: IBookProduct = {
        product_id,
        user_id,
        title,
        description,
        category: ProductCategory.BOOK,
        subcategory,
        condition,
        location,
        image_url,
        created_at,
        updated_at,
        availability,
        status,
        author: product.author,
        publish_year: product.publish_year,
        publisher: product.publisher,
        page_count: product.page_count,
      };
      return typedProduct;
    }

    case ProductCategory.PUZZLE: {
      const subcategory = product.subcategory as PuzzleSubcategory | undefined;
      const typedProduct: IPuzzleProduct = {
        product_id,
        user_id,
        title,
        description,
        category: ProductCategory.PUZZLE,
        subcategory,
        condition,
        location,
        image_url,
        created_at,
        updated_at,
        availability,
        status,
        manufacturer: product.manufacturer,
        piecesCount: product.piecesCount,
      };
      return typedProduct;
    }

    case ProductCategory.BOARD_GAME: {
      const subcategory = product.subcategory as BoardGameSubcategory | undefined;
      const typedProduct: IBoardGameProduct = {
        product_id,
        user_id,
        title,
        description,
        category: ProductCategory.BOARD_GAME,
        subcategory,
        condition,
        location,
        image_url,
        created_at,
        updated_at,
        availability,
        status,
        game_name: product.game_name,
        min_players: product.min_players,
        max_players: product.max_players,
        duration: product.duration,
      };
      return typedProduct;
    }

    default:
      throw new Error("Unsupported product category");
  }
}
