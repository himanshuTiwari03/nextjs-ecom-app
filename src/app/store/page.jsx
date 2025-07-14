"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { HiOutlineEye } from "react-icons/hi";
import api from '../services/api';
import { getCategoryService } from '../services/products';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { authHook } from '../hooks/authHook';

export default function StorePage() {
  authHook(['admin', 'user']);
    const [category, setCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [categorySelected, setCategorySelected] = useState('');
    const [isloading, setIsLoading] = useState(true);
 

    const getCategory = async () => {
        // setIsLoading(true);
        const res = await getCategoryService();
         const data = await res.data;
        setCategory(data.categories);
        setCategorySelected(data.categories[0]);
        getProducts(data.categories[0]);
        // setIsLoading(false);    
        console.log(data);
    }

    const getProducts = async (categorySelected) => {
        setIsLoading(true);
        setCategorySelected(categorySelected);
        const res = await fetch('https://fakestoreapi.in/api/products/category?type='+categorySelected);
        setIsLoading(false);
        const data = await res.json();
        setProducts(data.products);
        console.log(data);
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
        toast.warning(`Item is already in the cart.`);
      }
    };
    

    useEffect(() => {
        getCategory();
    },[]) 

 
  return (
<>
{ isloading && <Loader />}
  <div className="store-div flex flex-col lg:flex-row min-h-screen bg-gray-50">
    {/* Sidebar */}
    <aside className="bg-white w-full lg:w-1/5 p-4 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {category.map((cat) => (
          <li
            key={cat}
            onClick={() => getProducts(cat)}
            className={`cursor-pointer px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition ${
              categorySelected === cat ? 'bg-blue-500 text-white font-semibold' : ''
            }`}
          >
            {cat}
          </li>
        ))}
      </ul>
    </aside>

    {/* Products */}
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
                                 {/* <Link href={`store/product-details/${product.id}`}
                     style={{textAlign: 'right',width:'100%',paddingLeft: '10px'}}><HiOutlineEye size={20}/></Link> 
                     */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.brand}</h3>
            <Link href={`store/product-details/${product.id}`}>
            <div style={{ width: '200px', height: '200px' }}>
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="rounded mb-3 object-contain"
            />
            </div>
            </Link>
            <p className="text-gray-700 font-medium text-lg mb-4">${product.price}</p>
            <button onClick={() => addToCart(product)} className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  </div>
</>


  )
}
