import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";

export const AddProductButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    user && (
      <div className="flex justify-end mb-4">
        {/* <Button
          onClick={() => navigate("/add-product")}
          className="bg-green-500 text-white"
        >
          הוספת מוצר +
        </Button> */}
        <AppButton onClick={() => navigate("/add-product")}> הוספת מוצר +</AppButton>
      </div>
    )
  );
};
