import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import OrderSuccess from "./OrderSuccess";
import { useNavigate } from "react-router-dom";

const HandleUpiPayment = ({ amount, onSuccess, userData, products, selectedAddress }) => {
  useEffect(() => {
    if (typeof window.Razorpay === "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
 const [verified, setVerified] = useState(false);
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      if (!amount || amount < 1) {
        toast.error("Amount must be at least ₹1");
        return;
      }

      const calculatedAmount = Math.round(amount * 100); // Convert ₹ to paise

      // Create Razorpay Order
      const response = await axios.post(
        "https://mustaab.onrender.com/api/payment/create-order",
        {
          userId: userData._id,
          orderItems: products.map((item) => ({
            product: item._id,
            quantity: item.quantity || item.product?.quantity || 1,
            price: item.price,
          })),
          shippingAddress: selectedAddress._id,
          amount: calculatedAmount, // Already in paise
          paymentDetails: {
            paymentMethod: "UPI",
          },
          orderStatus: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const razorpayOrderId = response?.data?.razorpayOrder?.id;

      if (!razorpayOrderId) {
        toast.error("Failed to get Razorpay Order ID");
        return;
      }

      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK not loaded properly");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: calculatedAmount,
        currency: "INR",
        name: "Mustaab Store",
        description: "Complete your UPI payment",
        image: "https://yourdomain.com/logo.png", // ✅ Avoid localhost or http
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verification = await axios.post(
              "https://mustaab.onrender.com/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (verification?.data?.success) {
              toast.success("Order Placed Successfully!");
              onSuccess?.();
              setVerified(true);
            } else {
              toast.error("Order placement failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(error);
          }
        },
        prefill: {
          name: userData?.fullName,
          email: userData?.email,
          contact: userData?.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
        method: {
          upi: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Payment Init Error:", error);
      toast.error("Failed to initiate Razorpay Payment");
    }
  };

  return (
    <div>
    <button
      onClick={handlePayment}
      className="bg-black text-white rounded-md py-2 px-4 w-full mt-2 hover:bg-gray-800 transition duration-200"
    >
      Pay with UPI
    </button>
    verified&&<OrderSuccess/>
    </div>
  );
};

export default HandleUpiPayment;
