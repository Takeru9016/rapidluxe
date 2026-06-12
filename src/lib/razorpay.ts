import Razorpay from "razorpay";

// Lazy singleton — only instantiated on first call, not at module load time.
// This prevents Vercel build failures when env vars aren't available at build time.
let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error(
        "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables",
      );
    }
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _razorpay;
}
