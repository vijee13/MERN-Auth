import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData ? userData.name : 'Developer'}!
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
      <p className='mb-8 max-w-md'>
        Let’s start with a quick product tour — we’ll have you up and running in no time!
        Get ready to explore all the exciting features designed to make your experience seamless and enjoyable.
      </p>
      <button className='bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition'>
        Take a Tour
      </button>
    </div>
  );
};

export default Header;
