import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-32 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Welcome to ChatGPT</h1>
        <p className="text-xl mb-10">
          Your AI-powered assistant for all your questions and tasks. 
          Experience seamless conversations and get instant responses.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition">
            Get Started
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

