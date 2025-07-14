// "use client"
// import { useState, useEffect } from 'react';
// import Loader from '../components/Loader';
// import { toast } from 'react-toastify';

// const Cart = () => {
//   // Load the cart items from localStorage
//   const [cart, setCart] = useState([]);
//   const [isloading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//     setIsLoading(false);
//   }, []);

//   // Update the cart in localStorage
//   const updateCart = (updatedCart) => {
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     setCart(updatedCart);
//   };

//   // Increase quantity
//   const incrementQuantity = (id) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     updateCart(updatedCart);
//   };

//   // Decrease quantity
//   const decrementQuantity = (id) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
//     );
//     updateCart(updatedCart);
//   };

//   // Remove item from cart
//   const removeFromCart = (id) => {
//     const updatedCart = cart.filter(item => item.id !== id);
//     updateCart(updatedCart);
//     toast.success('Item removed from cart!');
//   };

//   // Calculate the total price
//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//   };

//   return (
//     <> {isloading && <Loader />}
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

//       {cart.length === 0 ? (
//         <p className="text-center text-gray-600">Your cart is empty.</p>
//       ) : (
//         <div>
// <div className="space-y-4">
//   {cart.map((item) => (
//     <div
//       key={item.id}
//       className="bg-white p-4 rounded-lg shadow-md grid grid-cols-3 items-center gap-4"
//     >
//       {/* Product Info */}
//       <div className="flex items-center space-x-4 col-span-2">
//         <img
//           src={item.image}
//           alt={item.title}
//           className="w-16 h-16 object-contain rounded"
//         />
//         <div>
//           <h3 className="text-lg font-semibold">{item.title}</h3>
//           <p className="text-gray-700">${item.price}</p>
//         </div>
//       </div>

//       {/* Quantity Controls */}
//       <div className="flex flex-col justify-end items-center space-x-4 sm:flex-row">
//         <button
//           onClick={() => decrementQuantity(item.id)}
//           className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
//         >
//           -
//         </button>
//         <span className="text-xl font-semibold">{item.quantity}</span>
//         <button
//           onClick={() => incrementQuantity(item.id)}
//           className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
//         >
//           +
//         </button>
//         <button
//           onClick={() => removeFromCart(item.id)}
//           className="text-red-600 font-semibold hover:text-red-800"
//         >
//           Remove
//         </button>
//       </div>

//       {/* Remove Button */}
//       {/* <div className="flex justify-end">
//         <button
//           onClick={() => removeFromCart(item.id)}
//           className="text-red-600 font-semibold hover:text-red-800"
//         >
//           Remove
//         </button>
//       </div> */}
//     </div>
//   ))}
// </div>


//           <div className="mt-6 flex justify-between items-center border-t pt-4">
//             <span className="text-lg font-semibold">Total: </span>
//             <span className="text-xl font-bold text-blue-600">${calculateTotal()}</span>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">
//               Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default Cart;



"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Loader from "../components/Loader";   // Assuming you have a Loader component
import { BiTrash } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { toast } from "react-toastify";
export default function Cart() {
    const SHIPPING_COST = 5.0;
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isloading, setIsLoading] = useState(true);
    const [paypalError, setPaypalError] = useState("");
    const [cart, setCart] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    // Load cart from localStorage when component mounts
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        setIsLoading(false);
    }, []); // This runs only once when the component mounts

    // Recalculate total and subtotal whenever `cart` changes
    useEffect(() => {
        const calculatedSubtotal = calculateTotal();
        setSubtotal(calculatedSubtotal);

        const totalWithShipping = calculatedSubtotal + SHIPPING_COST;
        setTotal(totalWithShipping);
    }, [cart]); // This hook runs whenever `cart` changes

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: total.toFixed(2),
                        currency_code: "USD"
                    },
                    description: "Farm Market Order"
                }
            ]
        });
    };

    const onApprove = async (data, actions) => {
        setIsProcessing(true);
        try {
            const order = await actions.order.get();

            const payerName = order.payer?.name?.given_name || "";
            const payerEmail = order.payer?.email_address || "";

            const paymentData = {
                name: payerName,
                email: payerEmail,
                amount: total.toFixed(2),
                orderID: data.orderID
            };

            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error("Payment processing failed");
            }
            setOrderSuccess(true);
           // alert("Payment successful!");
        } catch (error) {
            console.error("Payment failed:", error);
            setPaypalError("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError("An error occurred with PayPal. Please try again.");
    };


    // Update the cart in localStorage
    const updateCart = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    // Increase quantity
    const incrementQuantity = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    // Decrease quantity
    const decrementQuantity = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCart(updatedCart);
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        updateCart(updatedCart);
        toast.success('Item removed from cart!');
    };

    // Calculate the total price
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <>
                    {isProcessing && <Loader />}
                    {isloading && <Loader />}
        {orderSuccess ? (
            <div className="min-h-screen bg-gray-50 p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Order Placed Successfully!</h2>
            </div>
        ) : (
          <div className="min-h-screen bg-gray-50 p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Cart</h2>

          {cart.length === 0 ? (
              <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                  <ul className="space-y-4 mb-3 ">
                      {cart.map((item) => (
                          <div key={item.id}>
                              <li
                                  key={item.id}
                                  className="grid grid-cols-3 items-center gap-4 pb-4"
                              >
                                  <div className="flex items-center space-x-4 col-span-2 ">
                                      <Image
                                          src={item.image}
                                          alt={item.title}
                                          width={80}
                                          height={80}
                                          className="rounded"
                                      />
                                      <div>
                                          <h3 className="text-lg font-semibold">{item.title}</h3>
                                          <p className="text-gray-700">${item.price.toFixed(2)}</p>
                                          <div className="flex justify-between">
                                          <p className="text-sm text-gray-500">
                                              Quantity: {item.quantity}
                                          </p>

                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex flex-col">
                                      <div className="text-right mt-4">
                                          ${(item.price * item.quantity).toFixed(2)}                                             
                                      </div>
                                      <div className="flex justify-end mt-3 text-red-600">
                                      <BiTrash onClick={() => removeFromCart(item.id)}/>
                                      </div>
                                      {/* <div className="flex justify-end gap-x-2 mt-4">
                                      <button
                                          onClick={() => decrementQuantity(item.id)}
                                          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
                                      >
                                          <BiMinus />
                                      </button>
                                      <span className="text-xl font-semibold">{item.quantity}</span>
                                      <button
                                          onClick={() => incrementQuantity(item.id)}
                                          className="border-0 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
                                      >
                                          <BiPlus />
                                      </button>
                                      </div> */}


                                  </div>
                              </li>

                              {/* Quantity Controls */}
                              <li className=" border-b pb-4">
                                  <div className="flex justify-center items-center space-x-2 sm:justify-end">
                                      <button
                                          onClick={() => decrementQuantity(item.id)}
                                          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
                                      >
                                          <BiMinus />
                                      </button>
                                      <span className="text-xl font-semibold">{item.quantity}</span>
                                      <button
                                          onClick={() => incrementQuantity(item.id)}
                                          className="border-0 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded"
                                      >
                                          <BiPlus />
                                      </button>
                                      {/* <button
                                          onClick={() => removeFromCart(item.id)}
                                          className="text-red-600 font-semibold hover:text-red-800"
                                      >
                                        <BiTrash />
                                      </button> */}
                                  </div>
                              </li>
                          </div>
                      ))}
                  </ul>

                  {/* Price Summary */}
                  <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>${SHIPPING_COST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                      </div>
                  </div>

                  {/* PayPal Errors */}
                  {paypalError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                          {paypalError}
                      </div>
                  )}

                  {/* PayPal Integration */}
                  <PayPalScriptProvider
                      options={{
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                          currency: "USD",
                          intent: "capture"
                      }}
                  >
                      <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          style={{ layout: "vertical" }}
                          disabled={isProcessing}
                      />
                  </PayPalScriptProvider>

                  <p className="text-xs text-gray-500 text-center mt-4">
                      By completing this purchase, you agree to our terms and
                      conditions.
                  </p>
              </div>
          )}
      </div>
        )}

        


        </>
    );
}

