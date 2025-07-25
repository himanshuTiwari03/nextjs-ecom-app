"use client"
import React, { useState } from 'react'
import UserContext from './UserContext';

export default function DemoProvider({ children })  {
    // const [user,setUser] = useState(localStorage.getItem("user"));
    const [user,setUser] = useState("demo of context");
  return (
    <UserContext.Provider value={[user,setUser]}>
        {children}
    </UserContext.Provider>
  )
}