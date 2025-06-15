declare module '@cashfreepayments/cashfree-js' {
  export function load(options: { mode: string }): Promise<CashfreeInstance>;

  interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<CheckoutResult>;
  }

  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget: string;
  }

  interface CheckoutResult {
    error?: any;
    paymentDetails?: any;
  }
}
