import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, CalendarRange, Cloud, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
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
          {/* {message && (
          <div className="text-red-500 flex justify-center text-sm font-medium mt-1 items-center mb-1">
            <span role="alert">{message}</span>
          </div>
        )} */}

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
              {/* {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm font-medium mt-1">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )} */}
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
              {/* {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm font-medium mt-1">
                <span role="alert">{formik.errors.password}</span>
              </div>
            )} */}
            </div>

            {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div> */}

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center py-2" type='submit'>
              Sign in
            </button>
          </form>

          {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign up
            </Link>
          </p>
        </div> */}
        </div>
      </motion.div>
    </div>
  );
}

export default Login;