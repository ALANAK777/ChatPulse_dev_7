import React from 'react';

const UnlockProButton = () => {
  return (
    <button className="hidden md:inline-flex group items-center px-2 py-2 gap-2 font-bold text-green-400 rounded-full cursor-pointer
                       bg-gradient-to-r from-black via-gray-800 to-green-900
                       hover:bg-[length:400%] hover:animate-gradient-x
                       transition-all duration-300 ease-in-out
                       border border-green-500 shadow-lg shadow-green-500/20">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className="w-6 h-4 fill-green-400 transition-colors duration-300 ease-in-out group-hover:fill-white">
        <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z"></path>
      </svg>
      Unlock Pro
    </button>
  );
};

export default UnlockProButton;
