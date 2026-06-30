export interface PaymentRequest {
  amount: number;
  orderId: string;
  description: string;
  callbackUrl: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  requestPayment(req: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string, amount: number): Promise<PaymentResult>;
}

// --- Mock provider (default, works on static export) ---
class MockProvider implements PaymentProvider {
  name = "پرداخت آزمایشی";
  async requestPayment(req: PaymentRequest) {
    return { success: true, transactionId: `mock-${Date.now()}`, redirectUrl: `/checkout/callback?orderId=${req.orderId}&status=OK` };
  }
  async verifyPayment(_tid: string, _amount: number) {
    return { success: true, transactionId: _tid };
  }
}

// --- Zarinpal provider (requires backend proxy for static export) ---
// To use Zarinpal, create a serverless function /api/payment/request and /api/payment/verify
// that proxy requests to Zarinpal with your merchant key.
// Then update the provider below to call those endpoints instead of Zarinpal directly.

class ZarinpalProvider implements PaymentProvider {
  name = "زرین‌پال";
  async requestPayment(req: PaymentRequest) {
    const res = await fetch("/api/payment/request", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: req.amount, orderId: req.orderId, description: req.description, callbackUrl: req.callbackUrl }),
    });
    return res.json();
  }
  async verifyPayment(authority: string, amount: number) {
    const res = await fetch("/api/payment/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authority, amount }),
    });
    return res.json();
  }
}

export function createPaymentProvider(type?: "mock" | "zarinpal"): PaymentProvider {
  return type === "zarinpal" ? new ZarinpalProvider() : new MockProvider();
}

export const defaultProvider = createPaymentProvider(
  typeof window !== "undefined" && localStorage.getItem("payment_provider") === "zarinpal" ? "zarinpal" : "mock"
);
