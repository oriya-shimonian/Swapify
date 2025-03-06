import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProducts from "@/hooks/useProducts";
import { IProduct } from "@/types/type";


export default function HomePage() {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);

  // Handle filtering
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (condition) {
      filtered = filtered.filter(p => p.condition === condition);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, category, condition, products]);

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Puzzle">Puzzle</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Board Game">Board Game</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select onValueChange={setCondition}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter by Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Good Condition">Good Condition</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Card key={product.id} className="shadow-md hover:shadow-xl transition">
              <CardHeader>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-t-md">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="mt-3">
                  <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">{product.category}</span>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded ml-2">{product.condition}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
