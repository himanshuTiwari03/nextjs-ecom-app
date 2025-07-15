import React from 'react'

export default function OrderSucess() {
  return (
<div className=" border border-blue-800 text-green-800 px-6 py-4 rounded-md shadow-md max-w-md mx-auto text-center mt-10">
  <h2 className="text-lg font-semibold mb-2"> Order placed successfully!</h2>
  <a
    href="/"
    className="inline-block mt-2 text-blue-600 hover:underline font-medium"
  >
    Continue shopping
  </a>
</div>

  )
}
