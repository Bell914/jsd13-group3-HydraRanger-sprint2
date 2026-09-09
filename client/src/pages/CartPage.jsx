import { useEffect } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

export default function CartPage() {
  // ดึง state และ actions จาก cartStore.js
  const { cart, isLoading, error, fetchCart } = useCartStore();

  // ตัวอย่าง userId (อาจปรับตาม auth store หรือ params ของทีม)
  const userId = "guest-user"; 

  useEffect(() => {
    fetchCart(userId);
  }, [fetchCart]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {!cart || cart.items?.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Cart Content State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* โซนแสดงรายการสินค้า (รอแยกเป็น CartItem ในข้อถัดไป) */}
            {cart.items.map((item) => (
              <div
                key={item._id || item.variantId}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.name || "Product Name"}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-bold">฿{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* โซน สรุปยอดเงิน */}
          <div className="p-6 border rounded-lg h-fit bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>฿{cart.subtotal || 0}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
              <span>Total</span>
              <span>฿{cart.total || 0}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full mt-6 bg-black text-white py-3 rounded block text-center hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}