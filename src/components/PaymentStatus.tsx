import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";

interface PaymentStatusProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
}

export function PaymentStatus({ orderId, onStatusChange }: PaymentStatusProps) {
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const response = await api.checkPaymentStatus(orderId);
        const newStatus = response.status;
        setStatus(newStatus);
        onStatusChange?.(newStatus);
        
        if (newStatus === "paid" || newStatus === "failed") {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkStatus();
    
    // Then check every 3 seconds
    interval = setInterval(checkStatus, 3000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, onStatusChange]);

  const getStatusMessage = () => {
    switch (status) {
      case "pending":
        return "⏳ Waiting for payment confirmation...";
      case "paid":
        return "✅ Payment confirmed!";
      case "failed":
        return "❌ Payment failed. Please try again.";
      default:
        return "🔄 Processing...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Checking payment status...
      </div>
    );
  }

  return (
    <div className={`text-sm font-medium ${getStatusColor()}`}>
      {getStatusMessage()}
    </div>
  );
}
