'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { 
  Shield, 
  User, 
  Lock, 
  HardHat, 
  Building2, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login, mockUsers } = useSafety();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'manager'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const result = login(formData.username, formData.password, formData.role);
      
      if (result.success) {
        // Login successful, the context will handle the redirect
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = (role) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setFormData({
        username: user.username,
        password: user.password,
        role: user.role
      });
      setError('');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'manager': return <Building2 className="w-5 h-5" />;
      case 'supervisor': return <HardHat className="w-5 h-5" />;
      case 'worker': return <User className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'manager': return 'text-blue-400 border-blue-400/30';
      case 'supervisor': return 'text-green-400 border-green-400/30';
      case 'worker': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-construction-yellow rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-12 h-12 text-black" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">SafeSite AI</h1>
          <p className="text-gray-400">Construction Safety Ecosystem</p>
          <p className="text-xs text-gray-500 mt-1">Powered by YTL AI Cloud</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['manager', 'supervisor', 'worker'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role }))}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center space-y-1 ${
                      formData.role === role
                        ? getRoleColor(role)
                        : 'border-dark-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {getRoleIcon(role)}
                    <span className="text-xs capitalize">{role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-construction-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-dark-border">
            <p className="text-sm text-gray-400 mb-3 text-center">
              Quick Demo Access
            </p>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => fillDemoCredentials(user.role)}
                  className="w-full p-2 bg-dark-bg border border-dark-border rounded-lg hover:border-construction-yellow transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm text-white capitalize">{user.role}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {user.username} / {user.password}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-500">
            Secure Login • End-to-End Encryption
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}