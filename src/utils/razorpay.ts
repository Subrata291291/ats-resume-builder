const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const CV_DOWNLOAD_AMOUNT = 9900;

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOrderResponse = {
  id: string;
  amount?: number;
  currency?: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => void;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

type StartCvPaymentParams = {
  name?: string;
  email?: string;
  contact?: string;
  themeColor: string;
};

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });

const createRazorpayOrder = async (): Promise<RazorpayOrderResponse> => {
  const orderEndpoint = import.meta.env.VITE_RAZORPAY_ORDER_ENDPOINT as string | undefined;

  if (!orderEndpoint) {
    throw new Error("Missing VITE_RAZORPAY_ORDER_ENDPOINT. Add your backend order API URL to .env.");
  }

  const response = await fetch(orderEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: CV_DOWNLOAD_AMOUNT,
      currency: "INR",
      receipt: `cv_${Date.now()}`,
      notes: {
        product: "ATS CV PDF Download",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to create Razorpay order.");
  }

  const order = (await response.json()) as RazorpayOrderResponse;

  if (!order.id) {
    throw new Error("Razorpay order response is missing an order id.");
  }

  return order;
};

export const startCvDownloadPayment = async ({
  name,
  email,
  contact,
  themeColor,
}: StartCvPaymentParams) => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

  if (!key) {
    throw new Error("Missing VITE_RAZORPAY_KEY_ID. Add your Razorpay Key ID to .env.");
  }

  await loadRazorpayScript();
  const order = await createRazorpayOrder();

  return new Promise<RazorpayPaymentResponse>((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay Checkout is not available."));
      return;
    }

    const checkout = new window.Razorpay({
      key,
      amount: order.amount ?? CV_DOWNLOAD_AMOUNT,
      currency: order.currency ?? "INR",
      name: "ATS CV Engine",
      description: "CV PDF Download",
      order_id: order.id,
      prefill: {
        name,
        email,
        contact,
      },
      notes: {
        product: "ATS CV PDF Download",
      },
      theme: {
        color: themeColor,
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled.")),
      },
      handler: (response) => resolve(response),
    });

    checkout.on("payment.failed", () => {
      reject(new Error("Payment failed. Please try again."));
    });

    checkout.open();
  });
};
