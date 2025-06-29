import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const LoadingSpinner = () => (
  <motion.div 
    className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const minLength = 8;
    const maxLength = 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      valid: password.length >= minLength &&
             password.length <= maxLength &&
             hasUpperCase &&
             hasLowerCase &&
             hasNumber &&
             hasSymbol,
      errors: {
        length: password.length < minLength || password.length > maxLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        number: !hasNumber,
        symbol: !hasSymbol,
      }
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      toast.error("Name is required.", { position: "top-center" });
      return;
    }
    else if (!email) {
      toast.error("Email is required.", { position: "top-center" });
      return;
    }
    else if (!password) {
      toast.error("Password is required.", { position: "top-center" });
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      if (passwordValidation.errors.length) {
        toast.error("Password must be 8-20 characters long.", { position: "top-center" });
      }
      else if (passwordValidation.errors.upperCase) {
        toast.error("Password must include at least one uppercase letter.", { position: "top-center" });
      }
      else if (passwordValidation.errors.lowerCase) {
        toast.error("Password must include at least one lowercase letter.", { position: "top-center" });
      }
      else if (passwordValidation.errors.number) {
        toast.error("Password must include at least one number.", { position: "top-center" });
      }
      else if (passwordValidation.errors.symbol) {
        toast.error("Password must include at least one symbol.", { position: "top-center" });
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://mechathon-gulabi-peacock-10.onrender.com/auth/register', { username, email, password });
      if (response.data === "Registered successfully!") {
        toast.success("Registered successfully! Redirecting to login...", { position: "top-center" });
        setIsExiting(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data, { position: "top-center" });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", { position: "top-center" });
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setIsExiting(true);
    setTimeout(() => navigate('/login'), 500);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      
      {/* Left side - Animated Image */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 items-center justify-center"
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img 
            src="/dashboard.jpeg"
            alt="Registration illustration"
            className="w-full h-full object-contain"
            animate={{ 
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Right side - Registration Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
              </div>

              <motion.h2 
                className="text-3xl font-bold text-center text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Register To TakeTrack
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Register
                  </Button>
                </motion.div>
              </form>

              <motion.p 
                className="text-center text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Already have an account?{' '}
                <button
                  onClick={handleLoginRedirect}
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Login here
                </button>
              </motion.p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}