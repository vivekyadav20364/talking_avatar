import React from 'react';

const Loader = () => {
  // console.log("Loader work");
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"> Vivek</div>
    </div>
  );
};

export default Loader;