import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {

  return (
    <div className=" justify-center items-center bg-cover bg-center min-h-screen flex">
      <div>
        <div className='relative'>
          <div className='bg-neutral-950 blur-2xl p-20 absolute inset-0'></div>
          <div className='relative text-white z-10'>
            <h1 className='flex items-center justify-center text-3xl p-2 '>
            Page not found
            </h1>
            <p className='flex items-center justify-center'>
            Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
            </p>
            <Link to="/" className="flex items-center justify-center text-white">
             Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
