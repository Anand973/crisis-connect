import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);

      if (!user) {
        setError('No account found with this email address');
        setLoading(false);
        return;
      }

      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code in localStorage
      localStorage.setItem('resetCode_' + email, JSON.stringify({
        code,
        timestamp: Date.now(),
        attempts: 0
      }));

      // For development: Show the code in success message
      setSuccess(`Verification code: ${code} (Demo mode)`);
      setStep(2);
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const resetData = JSON.parse(localStorage.getItem('resetCode_' + email));
      
      if (!resetData) {
        setError('Verification code expired. Please try again');
        setStep(1);
        return;
      }

      // Check if code is expired (15 minutes)
      if (Date.now() - resetData.timestamp > 15 * 60 * 1000) {
        localStorage.removeItem('resetCode_' + email);
        setError('Verification code expired. Please try again');
        setStep(1);
        return;
      }

      // Check if too many attempts
      if (resetData.attempts >= 3) {
        localStorage.removeItem('resetCode_' + email);
        setError('Too many attempts. Please try again');
        setStep(1);
        return;
      }

      if (resetData.code !== verificationCode) {
        // Increment attempts
        resetData.attempts += 1;
        localStorage.setItem('resetCode_' + email, JSON.stringify(resetData));
        setError('Invalid verification code');
        return;
      }

      setSuccess('Code verified successfully!');
      setStep(3);
    } catch (err) {
      setError('An error occurred while verifying the code');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, password: newPassword };
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('resetCode_' + email);

      navigate('/login', {
        state: { message: 'Password reset successful! Please login with your new password.' }
      });
    } catch (err) {
      setError('An error occurred while resetting your password');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Reset Password</h1>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            <p className="text-sm">{success}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                maxLength={6}
                placeholder="Enter 6-digit code"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 