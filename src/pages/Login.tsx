import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarRange, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errordesc, setError] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
        {errordesc && <div className='text-red-500 text-center mb-3 font-bold'>Wrong Credentials</div>}

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <CalendarRange className="h-8 w-8 text-teal-400" />
              <span className="font-poppins font-bold text-2xl">
                EventFlow
              </span>
            </Link>
            <h2 className="mt-6 text-3xl font-poppins font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in join public event and connect
            </p>
          </div>

          {isLoading && <div id="loading">Loading&#8230;</div>}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full ps-10 pe-3 pt-2 pb-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...register('email', { required: true })}
                />
              </div>
              </div>

            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full ps-10 pe-3 pt-2 pb-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...register('password', { required: true })}
                />
              </div>
              </div>
            </div>

            <button className="w-full bg-[#6B46C1] hover:bg-[#5F3DB8] text-white rounded-xl flex items-center justify-center py-2" type='submit'>
              Sign in
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}

export default Login;