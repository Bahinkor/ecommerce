import type {
  ZibalCreatePaymentResponse,
  ZobalVerifyPaymentResponse,
} from "src/payment/types/zibal-response.type";

export const createPaymentPortal = async (price: number): Promise<ZibalCreatePaymentResponse> => {
  const req = await fetch("https://gateway.zibal.ir/v1/request", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      merchant: process.env.PAYMENT_PORTAL_MERCHANT_ID ?? "zibal",
      callbackUrl: process.env.PAYMENT_PORTAL_CALLBACK_URL ?? "https://google.com",
      amount: price * 10, // convert irt to irr
    }),
  });
  return req.json();
};

export const verifyPayment = async (trackId: number): Promise<ZobalVerifyPaymentResponse> => {
  const req = await fetch("https://gateway.zibal.ir/v1/verify", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      merchant: process.env.PAYMENT_PORTAL_MERCHANT_ID ?? "zibal",
      trackId,
    }),
  });
  return req.json();
};
