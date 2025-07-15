// app/page.jsx or app/products/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Loader from '../components/Loader';
import axios from 'axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define columns manually or dynamically
const productColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Price', accessorKey: 'price' },
  ];

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then((res) => {
        const updatedProducts = res.data.map((product) => ({
          ...product,
          price: `$${product.price}`, // Convert number to string with dollar sign
        }));

        setProducts(updatedProducts);
        setIsLoading(false);
      });
    // const storedOrders = localStorage.getItem('orders');

    // if (storedOrders) {
    //   const parsedOrders = JSON.parse(storedOrders);
  
    //   // Optional: check shape of parsedOrders
    //   console.log('Parsed Orders:', parsedOrders);
  
    //   setProducts(parsedOrders);
    //   console.log(' Orders:', products);
    // } else {
    //   setProducts([]); // fallback
    // }
  
    // setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log('Orders:', products);
  }, [products]);

  return (
    <>
   {isLoading ? (
       <Loader />
   ) : (
    <main className="container mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Product Table with Pagination</h1>
    <Table data={products} columns={productColumns}/>
  </main>
   )}

    </>
  );
}
