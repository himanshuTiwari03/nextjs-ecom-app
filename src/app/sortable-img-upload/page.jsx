'use client';

import React, { useCallback, useState } from 'react';
import { BiX } from 'react-icons/bi';

export default function ImageUploadPage() {
  const [images, setImages] = useState([]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    const previews = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: URL.createObjectURL(file) // Unique key
    }));

    setImages((prev) => [...prev, ...previews]);
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className='p-2 overflow-hidden'>
    <div className="max-w-3xl mx-auto mt-10 px-4 mb-3">
      <h1 className="text-2xl font-bold mb-6 text-center">Drag & Drop Image Uploader</h1>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-4 border-dashed border-blue-400 bg-blue-50 h-40 flex flex-col justify-center items-center rounded-lg cursor-pointer mb-6"
      >
        <p className="text-blue-600 font-medium">Drag and drop images here</p>
        <p className="text-sm text-gray-500">or</p>
        <input
  type="file"
  accept="image/*"
  multiple
  onChange={handleFileSelect}
  className="block text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-600 file:text-white
             hover:file:bg-blue-700 cursor-pointer
              border-dashed border-2 border-gray-300 rounded-lg p-2
              mt-2"
             
/>

      </div>

      {/* Image Previews with Delete Button */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative border rounded overflow-hidden group">
              <img src={img.url} alt="upload-preview" className="object-cover w-full h-40" />

              {/* Delete Button */}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center 
                            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                title="Remove"
                >
               <BiX />
                </button>

            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
