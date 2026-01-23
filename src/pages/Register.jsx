import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import TextInput from '../components/Forms/TextInput';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...rest } = formData;

    const payload = {
      ...rest,
      customerRole: 'CUSTOMER',
      authProvider: 'LOCAL',
      profileCompleted: true
    };

    const result = await register(payload);

    if (result?.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="First name"
                required
              />

              <TextInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Last name"
                required
              />
            </div>

            <TextInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <TextInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="9421028950"
              required
            />

            <TextInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter your address"
              required
            />

            <TextInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password"
              required
            />

            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
