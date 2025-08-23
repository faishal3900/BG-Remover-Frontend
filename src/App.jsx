import React, { useState, useRef } from 'react';
import './App.css'

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  console.log(preview);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleFileChange = (e) => {
    handleImageSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
    dropRef.current.classList.remove("border-blue-400");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-blue-400");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("border-blue-400");
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('https://bg-remover-backend-tq92.onrender.com', {
        method: 'POST',
        body: formData,
      });

      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
      console.log(URL.createObjectURL(blob));
      console.log(blob);

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  function addAnotherImg() {
    setPreview(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-bl from-violet-500 to-fuchsia-500 p-6 flex flex-col items-center background-container" >
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">🪄 Background Remover</h1>

      {/* Drag & Drop Area */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-md rounded-2xl sm:p-30 p-10 text-center cursor-pointer transition 
              ${preview == null ? "block" : "hidden"} 
              bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20`}
      >
        <p className="text-white mb-2 font-medium">Drag & drop an image here</p>

        <div className="flex justify-center mt-5 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-white font-medium bg-white/10 border border-white/30 p-3 rounded-xl backdrop-blur-md shadow-inner placeholder:text-gray-300 cursor-pointer hover:bg-white/20 transition"
          />
        </div>
      </div>


      {/* Image Preview */}
      {preview && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Original Image</h2>
          <img src={preview} alt="Selected" className="max-w-md rounded-lg shadow-lg" />
        </div>
      )}

      {/* Upload Button */}
      <div className='flex justify-center items-center text-center gap-3'>
        <button
          onClick={handleUpload}
          className={`mt-6 px-6 py-2 text-white font-medium rounded-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Removing Background...' : 'Remove Background'}
        </button>
        <button className={`mt-6 px-6 py-2 text-white font-medium rounded-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} ${preview == null ? "hidden" : "block"}`} onClick={addAnotherImg}>Add another image</button>
      </div>
      {/* Result Image */}
      {result && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Result Image</h2>
          <img src={result} alt="Result" className="max-w-md rounded-lg shadow-lg mb-5" />
          <a
            href={result}
            download="no-bg.png"
            className="mt-6 px-6 py-2 text-white font-medium rounded-lg transition bg-green-500 hover:bg-green-600"
          >
            ⬇ Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
