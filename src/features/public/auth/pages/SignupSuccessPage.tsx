import React from "react";
import { Link } from "react-router";
import { CheckCircle, Pill } from "lucide-react";

export function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PharmaSaaS</span>
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Request Received!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you! We'll review your request and send you access credentials
          within 24 hours. Keep an eye on your inbox.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
