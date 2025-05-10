import React from "react";
import SubsImage from "../assets/subs-img-png.png";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Link } from "react-router-dom";


const Subscription = () => {

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-purple-900 p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Discover a World of audio stories with Yappie Subscriptions
        </h1>
        <p className="max-w-2xl mx-auto text-sm">
          Thousands of books ranging from timeless classics to the best-selling books of the modern era. Immerse yourself with Yappie in stories, wherever you are and whenever you want.
        </p>
        <div className="mt-4 flex justify-center">
          <img
            src={SubsImage}
            alt="Subscription Illustration"
            className="w-64 h-auto ml-8"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-xl font-bold mb-4">Choose the best subscription package</h2>
        <div className="flex justify-center flex-wrap gap-6 px-4">
          <div className="bg-white text-black rounded-xl p-6 w-60 shadow-md">
            <h3 className="font-bold text-lg">Monthly plan</h3>
            <p className="text-2xl font-bold my-2">USD 8</p>
            <p className="text-sm">renews monthly</p>
               <Link
              to="/subscribe-form"
              className="bg-purple-600 text-white mt-4 px-4 py-2 rounded-md w-full inline-block text-center"
            >
              Subscribe now
            </Link>
          </div>

          <div className="bg-white text-black rounded-xl p-6 w-60 shadow-md">
            <h3 className="font-bold text-lg">Quarterly Plan</h3>
            <p className="text-2xl font-bold my-2">USD 21</p>
            <p className="text-sm">renews every 3 months</p>
              <Link
              to="/subscribe-form"
              className="bg-purple-600 text-white mt-4 px-4 py-2 rounded-md w-full inline-block text-center"
            >
              Subscribe now
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-800 to-purple-600 rounded-xl p-6 w-60 text-white shadow-md relative">
            <span className="absolute top-2 right-2 bg-green-500 text-xs px-2 py-1 rounded-full">
              $6.50 each
            </span>
            <h3 className="font-bold text-lg">Yearly Plan</h3>
            <p className="text-2xl font-bold my-2">USD 27.5</p>
            <p className="text-sm">renews yearly</p>
              <Link
              to="/subscribe-form"
              className="bg-purple-600 text-white mt-4 px-4 py-2 rounded-md w-full inline-block text-center"
            >
              Subscribe now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 px-4 py-8">
        <h3 className="text-center font-bold text-lg mb-4">FAQS</h3>
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="bg-white text-black rounded-md px-4 py-3 shadow-md">
            <details>
              <summary className="cursor-pointer font-medium">How to activate the Subscription</summary>
              <p className="mt-2 text-sm">
                Simply choose a plan and complete the payment process. Your subscription will be activated instantly, and you'll receive a confirmation email.
              </p>
            </details>
          </div>
          <div className="bg-white text-black rounded-md px-4 py-3 shadow-md">
            <details>
              <summary className="cursor-pointer font-medium">What are the benefits of subscribing to Yappie</summary>
              <p className="mt-2 text-sm">
                You'll gain unlimited access to thousands of audiobooks, offline listening, early access to new releases, and exclusive subscriber-only content.
              </p>
            </details>
          </div>
          <div className="bg-white text-black rounded-md px-4 py-3 shadow-md">
            <details>
              <summary className="cursor-pointer font-medium">How can I know the renewal date of my subscription</summary>
              <p className="mt-2 text-sm">
                Go to your account settings and click on "Subscription Details". You'll find your renewal date and billing history there.
              </p>
            </details>
          </div>
          <div className="bg-white text-black rounded-md px-4 py-3 shadow-md">
            <details>
              <summary className="cursor-pointer font-medium">Can I activate my personal account on more than one device?</summary>
              <p className="mt-2 text-sm">
                Yes! You can log in and use your subscription on up to 3 devices simultaneously—perfect for mobile, tablet, and desktop.
              </p>
            </details>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Subscription;
