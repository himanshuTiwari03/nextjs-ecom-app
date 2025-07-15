"use client"
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function RecentlyAdded() {
    // const [ user,setUser] = useContext(UserContext);
    const [products,setProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const getProducts = async () => {
      const res = await axios.get('https://fakestoreapi.in/api/products?limit=5');
      // const data = await res.json();
      setProducts(res.data.products);
      console.log(res);
    }

    const getNewProducts = async () => {
      const res = await axios.get('https://fakestoreapi.in/api/products/category?type=gaming');
      const limitedProducts = res.data.products.slice(0, 5); // 👈 Limit to 5
      setNewProducts(limitedProducts);
      console.log(limitedProducts);
    }
    useEffect(() => {
       
        getProducts();
        getNewProducts();
        setIsLoading(false);
    },[])


    const addToCart = (product) => {
      const user = JSON.parse(localStorage.getItem('user')) || null;
      if(!user){
        toast.error(`Please Login to add to cart!`);
        return;
      }
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
  return (
    <>
    {isloading ? (<Loader /> ):(
      <>
    
    <h1 className='text-3xl font-bold text-center my-4'>RECENTLY ADDED</h1>

    <div className='container mx-auto p-5 flex flex-wrap gap-4 justify-center'>
        {products.map((product) => (
            <div key={product.id} className="max-w-sm bg-white rounded shadow p-4 flex flex-col items-center mb-3">
            <h2 className="text-xl font-bold">{product.brand}</h2>
            <Link href={`store/product-details/${product.id}`}>
            <div style={{ width: '200px', height: '200px' }}>
            <Image src={product.image} alt={product.title} width={200} height={200} />
            </div>
            </Link>
            <p className="text-gray-700">${product.price}</p>
            <button onClick={() => addToCart(product)} className= 'mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add to Cart</button>
            </div>
        ))}
    </div>


    <h1 className='text-3xl font-bold text-center my-4'>NEWLY ADDED</h1>

<div className='container mx-auto p-5 flex flex-wrap gap-4 justify-center'>
    {newProducts.map((product) => (
        <div key={product.id} className="max-w-sm bg-white rounded shadow p-4 flex flex-col items-center mb-3">
        <h2 className="text-xl font-bold">{product.brand}</h2>
        <Link href={`store/product-details/${product.id}`}>
        <div style={{ width: '200px', height: '200px' }}>
        <Image src={product.image} alt={product.title} width={200} height={200} />
        </div>
        </Link>
        <p className="text-gray-700">${product.price}</p>
        <button onClick={() => addToCart(product)} className= 'mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add to Cart</button>
        </div>
    ))}
</div>
</>
    )}

    </>
  )
}