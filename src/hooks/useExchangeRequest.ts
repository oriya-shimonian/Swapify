import { useState } from "react";
import axios from "axios";
import { exchangeRequestRoutes } from "@/settings"; 
import { ExchangeRequestData, ReceivedExchangeRequest, SentExchangeRequest } from "@/types/exchangeRequest";


export function useExchangeRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (data: ExchangeRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(exchangeRequestRoutes.createExchangeRequest, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "שגיאה בשליחת הבקשה");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id: number, chosenProductId: number, userId: number, userName: string) => {
    try {
      const res = await axios.put(exchangeRequestRoutes.approveExchangeRequest(id), {
        chosenProductId,
        userId,
        userName,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const completeRequest = async (id: number, userId: number, userName: string) => {
    try {
      const res = await axios.put(exchangeRequestRoutes.completeExchangeRequest(id), {
        userId,
        userName,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const cancelRequest = async (id: number, userId: number, userName: string) => {
    try {
      const res = await axios.delete(exchangeRequestRoutes.cancelExchangeRequest(id), {
        data: { userId, userName },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getUserRequests = async (userId: number): Promise<SentExchangeRequest[]> => {
    try {
      const res = await axios.get(exchangeRequestRoutes.getAllUserExchangeRequests(userId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      // מוסיפים לכל בקשה את type = "sent"
      const requestsWithType: SentExchangeRequest[] = res.data.map((req: any) => ({
        ...req,
        type: "sent",
      }));
  
      return requestsWithType;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };  

  const getIncomingRequests = async (userId: number): Promise<ReceivedExchangeRequest[]> => {
    try {
      const res = await axios.get(exchangeRequestRoutes.getIncomingExchangeRequests(userId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      // מוסיפים לכל בקשה את type = "received"
      const requestsWithType: ReceivedExchangeRequest[] = res.data.map((req: any) => ({
        ...req,
        type: "received",
      }));
  
      return requestsWithType;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const getRequestById = async (id: number) => {
    try {
      const res = await axios.get(exchangeRequestRoutes.getExchangeRequestById(id));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    loading,
    error,
    createRequest,
    approveRequest,
    completeRequest,
    cancelRequest,
    getUserRequests,
    getIncomingRequests,
    getRequestById,
  };
}
