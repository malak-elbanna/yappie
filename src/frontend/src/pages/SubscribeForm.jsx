import React, { useState } from "react";

const SubscribeForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d4c2f5] px-4">
      <div className="bg-[#eee9fb] rounded-xl p-8 shadow-md w-full max-w-xl">
        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <p className="text-purple-800 font-semibold">Credit Card</p>
              <div className="flex justify-center gap-2 mt-2">
                <img
                  src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                  alt="Mastercard"
                  className="h-6"
                />
                <img
                  src="https://img.icons8.com/color/48/000000/visa.png"
                  alt="Visa"
                  className="h-6"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border-none outline-none"
                required
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border-none outline-none"
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Exp. Month"
                  className="w-1/2 px-4 py-3 rounded-md bg-white text-gray-700 border-none outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Exp. Year"
                  className="w-1/2 px-4 py-3 rounded-md bg-white text-gray-700 border-none outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="CCV"
                className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border-none outline-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-[#5E00B7] text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Thank you for subscribing!</h2>
            <p className="text-gray-700">Your payment has been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeForm;
