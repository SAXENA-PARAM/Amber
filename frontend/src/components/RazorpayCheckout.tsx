// src/components/RazorpayCheckout.tsx
"use client";

import React, { useEffect } from 'react';

interface RazorpayCheckoutProps {
  amount: number;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ amount }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript(); // Load the Razorpay script when the component mounts
  }, []);

  const handlePayment = async () => {
    const orderData = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    }).then((t) => t.json());

    if (!(window as any).Razorpay) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: orderData.id,
      handler: async function (response: any) {
        alert(`Payment successful: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <button onClick={handlePayment} className="pay-button">
     Subscription 
    </button>
  );
};

export default RazorpayCheckout;
