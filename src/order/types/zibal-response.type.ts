export interface ZibalCreatePaymentResponse {
  message: string;
  status: number;
  trackId: number;
}

export interface ZobalVerifyPaymentResponse {
  message: string;
  result: number;
}
