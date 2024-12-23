// src/pages/index.tsx
import RazorpayCheckout from '@/components/RazorpayCheckout';

const HomePage = () => {
  return (
    <div>
      <h1>Next.js Razorpay Payment Integration</h1>
      <RazorpayCheckout amount={500} /> {/* Amount in INR */}
    </div>
  );
};

export default HomePage;
