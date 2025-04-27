import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import useProducts from "@/hooks/useProducts";
import { IProduct } from "@/types/products";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AddProductButton } from "@/components/Buttons/AddProductButton";

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const { user } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [condition, setCondition] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (condition) {
      filtered = filtered.filter((p) => p.condition === condition);
    }
    if (location) {
      filtered = filtered.filter((p) => p.location.toLowerCase() === location.toLowerCase());
    }
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategory === subcategory);
    }

    // Sorting
    if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category, condition, location, subcategory, sortBy, products]);

  return (
    <div className="container mx-auto px-4 py-6 mt-[4.5rem]">
      <h1 className="text-3xl font-bold text-center mb-6">Discover & Swap Items</h1>

      {/* כפתור הוספת מוצר */}
      <AddProductButton />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Puzzle">Puzzle</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Board Game">Board Game</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setCondition}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Good Condition">Good Condition</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-1/4">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
              <SelectItem value="Jerusalem">Jerusalem</SelectItem>
              <SelectItem value="Haifa">Haifa</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

 {/* TODO: get all the products except yours? */}
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
         filteredProducts.map((product) => {
          const isOwner = user?.user_id === product.user_id;
        
          return (
            <ProductCard
              key={product.product_id}
              product={product}
              actionButtons={
                isOwner ? (
                  <>
                    <FaEdit
                      onClick={() => navigate(`/edit-product/${product.product_id}`)}
                      className="text-blue-600 cursor-pointer"
                      title="ערוך"
                    />
                    <GoTrash 
                      onClick={() => console.log("TODO: מחיקת מוצר")}
                      className="text-red-600 cursor-pointer"
                      title="מחק"
                    />
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/product/${product.product_id}`)}
                      variant="secondary"
                    >
                      צפה בפרטים
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white"
                      onClick={() => console.log("TODO: פתיחת דיאלוג החלפה")}
                    >
                      שלח בקשה
                    </Button>
                  </>
                )
              }
            />
          );
        })
                ) : (
          <p className="text-center col-span-full text-gray-500">לא נמצאו פריטים.</p>
        )}
      </div>
    </div>
  );
}
