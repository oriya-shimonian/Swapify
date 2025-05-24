import { useState } from "react";
import axios from "axios";
import { exchangeRequestRoutes } from "@/settings";
import {
  ExchangeRequestData,
  ReceivedExchangeRequest,
  SentExchangeRequest,
} from "@/types/exchangeRequest";
import toast from "react-hot-toast";

export function useExchangeRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (data: ExchangeRequestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        exchangeRequestRoutes.createExchangeRequest,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return {
        ...response.data,
        hasPartialOverlap: response.data.hasPartialOverlap ?? false,
      };
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "שגיאה בשליחת הבקשה");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (
    exchangeRequestID: number,
    chosenProductId: number,
    userId: number,
    userName: string
  ) => {
    try {
      const res = await axios.post(
        exchangeRequestRoutes.approveExchangeRequest(exchangeRequestID),
        {
          chosenProductId,
          userId,
          userName,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const completeRequest = async (
    id: number,
    userId: number,
    userName: string
  ) => {
    try {
      const res = await axios.put(
        exchangeRequestRoutes.completeExchangeRequest(id),
        {
          userId,
          userName,
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const cancelMyRequest = async (
    id: number,
    userId: number,
    userName: string
  ) => {
    try {
      const res = await axios.delete(
        exchangeRequestRoutes.cancelExchangeRequest(id),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const rejectOfferedRequest = async (
    requestId: number,
    userId: number,
    userName: string
  ) => {
    try {
      const res = await axios.put(
        exchangeRequestRoutes.updateExchangeRequestStatus(requestId),
        {
          status: "Rejected",
          userId,
          userName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getUserRequests = async (
    userId: number
  ): Promise<SentExchangeRequest[]> => {
    try {
      const res = await axios.get(
        exchangeRequestRoutes.getAllUserExchangeRequests(userId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // מוסיפים לכל בקשה את type = "sent"
      const requestsWithType: SentExchangeRequest[] = res.data.map(
        (req: any) => ({
          ...req,
          type: "sent",
        })
      );

      return requestsWithType;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getIncomingRequests = async (
    userId: number
  ): Promise<ReceivedExchangeRequest[]> => {
    try {
      const res = await axios.get(
        exchangeRequestRoutes.getIncomingExchangeRequests(userId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // מוסיפים לכל בקשה את type = "received"
      const requestsWithType: ReceivedExchangeRequest[] = res.data.map(
        (req: any) => ({
          ...req,
          type: "received",
        })
      );

      return requestsWithType;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getRequestById = async (id: number) => {
    try {
      const res = await axios.get(
        exchangeRequestRoutes.getExchangeRequestById(id)
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateExchangeRequestProposalOptions = async (
    requestId: number,
    newProductIds: number[],
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      await axios.put(
        exchangeRequestRoutes.updateExchangeRequestProposalOptions(requestId),
        { offeredProductIds: newProductIds },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("הבקשה עודכנה בהצלחה!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בעדכון הבקשה");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createRequest,
    approveRequest,
    completeRequest,
    cancelMyRequest,
    rejectOfferedRequest,
    getUserRequests,
    getIncomingRequests,
    getRequestById,
    updateExchangeRequestProposalOptions,
  };
}
