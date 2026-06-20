import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api/client";

export const Route = createFileRoute("/test-payment")({
  component: TestPayment,
});

function TestPayment() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPayment = async (method: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await api.placeOrder({
        items: [{ packageId: "dagaa-starter", quantity: 1 }],
        paymentMethod: method,
        deliveryAddress: "Test Address, Dar es Salaam",
        phoneNumber: "255712345678"
      });
      
      setResult({ success: true, data: response });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧪 Payment Testing</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => testPayment("azampay")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test AzamPay
            </button>
            
            <button
              onClick={() => testPayment("card")}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Test Card
            </button>
          </div>

          {loading && (
            <div className="p-4 bg-yellow-100 rounded">
              <p className="text-yellow-800">⏳ Testing payment...</p>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-semibold mb-2">
                {result.success ? '✅ Success' : '❌ Error'}
              </h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">📝 Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ensure backend is running on port 4000</li>
            <li>Login first to get authentication token</li>
            <li>Click any payment method button above</li>
            <li>Check browser console for detailed logs</li>
            <li>Check backend console for API responses</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
