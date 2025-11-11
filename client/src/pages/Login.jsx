import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { api, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(api(`/api/auth/register`), {
          name,
          email,
          password,
        }, 
      { withCredentials: true });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(api(`/api/auth/login`), {
          email,
          password,
        }, { withCredentials: true });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-transparent pt-24'>
      <Navbar/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up'
            ? 'Create your account'
            : 'Login to your account!'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4'>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                placeholder='Full Name'
                required
                className='border-b-2 outline-none rounded-full mb-4 w-full px-5 py-3 text-black'
              />
            </div>
          )}

          <div className='mb-4'>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='text'
              placeholder='E-Mail'
              required
              className='border-b-2 text-black outline-none rounded-full mb-4 w-full px-5 py-3'
            />
          </div>

          <div className='mb-2'>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Password'
              required
              className='border-b-2 text-black outline-none rounded-full mb-4 w-full px-5 py-3'
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 cursor-pointer'
          >
            Forgot Password?
          </p>

          <button
            type='submit'
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full transition-colors mb-4'
          >
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-blue-400 cursor-pointer underline'
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-blue-400 cursor-pointer underline'
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
