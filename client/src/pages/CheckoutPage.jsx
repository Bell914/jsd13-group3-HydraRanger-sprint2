import React from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

export default function CheckoutPage() {
  const { cart } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ฟอร์มกรอกข้อมูลจัดส่ง */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full border p-2 rounded" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea className="w-full border p-2 rounded" rows="3" placeholder="123 Street..."></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border rounded-lg h-fit bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.items?.map((item) => (
              <div key={item._id || item.variantId} className="flex justify-between text-sm">
                <span>{item.name || "Product"} x {item.quantity}</span>
                <span>฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>฿{cart.total || 0}</span>
          </div>
          <button className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}