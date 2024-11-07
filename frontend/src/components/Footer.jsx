import React from 'react';

function Footer() {
  return (
    <div className="w-full h-36 bg-black text-white flex justify-center items-center shadow-inner mt-12">
      <div className="text-center">
        <p className="text-lg font-medium">
          Made with <span className="text-red-500">♡</span> | Team Gulabi Peacock
        </p>
        <p className="text-sm mt-2 text-gray-400">© 2024 All Rights Reserved</p>
      </div>
    </div>
  );
}

export default Footer;
