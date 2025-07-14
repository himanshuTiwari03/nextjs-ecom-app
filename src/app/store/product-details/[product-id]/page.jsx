"use client"
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
export default function ProductDetailsPage() {
    const params = useParams();
    const productId = params["product-id"];

    const [product, setProduct] = useState({});
    const [isloading, setIsLoading] = useState(true);

    const getProduct = async () => {

        const res = await fetch('https://fakestoreapi.in/api/products/' + productId);
    
        const data = await res.json();
        setProduct(data.product);
    }

        const addToCart = (product) => {
          const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        
          // Optionally: check if product is already in cart
          const isAlreadyInCart = existingCart.find(item => item.id === product.id);
        
          if (!isAlreadyInCart) {
            const updatedCart = [...existingCart, { ...product, quantity: 1 }];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.success(`Item Added to cart!`);
           // alert(`${product.title} added to cart!`);
          } else {
           // alert(`${product.title} is already in the cart.`);
            toast.warning(`Already in the cart.`);
          }
        };

    useEffect(() => {
        getProduct();
        setIsLoading(false);
    },[])
    return (
        <>
        {isloading && <Loader />}
<div className="min-h-screen bg-gray-100 py-10 px-4">
  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      
      {/* Product Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src={product.image || "/next.svg"}
          width={300}
          height={300}
          alt="product"
          className="rounded-lg object-contain border"
        />
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
        <p className="text-gray-600"><span className="font-semibold">Category:</span> {product.category}</p>
        <p className="text-gray-600"><span className="font-semibold">Model:</span> {product.model}</p>
        <p className="text-gray-600"><span className="font-semibold">Color:</span> {product.color}</p>
        <p className="text-gray-700">{product.description}</p>
        <h5 className="text-xl font-bold text-blue-600">₹ {product.price}</h5>

        <button onClick={() => addToCart(product)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md mt-4 transition">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</div>
</>
    )
}
