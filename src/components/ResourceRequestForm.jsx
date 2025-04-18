import React, { useState } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import CrisisChatbot from './CrisisChatbot';

const ResourceRequestForm = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    needsMedical: false,
    needsFood: false,
    needsShelter: false,
    longitude: '',
    latitude: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
        setIsGettingLocation(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate at least one resource is selected
    if (!formData.needsMedical && !formData.needsFood && !formData.needsShelter) {
      setError('Please select at least one resource need');
      setIsLoading(false);
      return;
    }

    // Validate location data
    if (!formData.longitude || !formData.latitude) {
      setError('Please provide your location');
      setIsLoading(false);
      return;
    }

    // Structure payload to match backend expectations
    const payload = {
      resources: {
        medical: formData.needsMedical,
        food: formData.needsFood,
        shelter: formData.needsShelter
      },
      longitude: formData.longitude,
      latitude: formData.latitude
    };

    try {
      // Simple POST request without authentication
      const response = await axios.post(
        'http://localhost:5000/api/resources',
        payload
      );

      setSuccess('Resource request submitted successfully!');
      
      // Reset form
      setFormData({
        needsMedical: false,
        needsFood: false,
        needsShelter: false,
        longitude: '',
        latitude: ''
      });
    } catch (err) {
      console.error('Error submitting resource request:', err);
      
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.message) {
          setError(data.message);
        } else {
          setError('Failed to submit request. Please try again.');
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please log in to request resources</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Request Resources</h1>
          <p className="text-muted-foreground mt-2">
            Select the resources you need and provide your location
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">What resources do you need?</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="needsMedical"
                  checked={formData.needsMedical}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300"
                />
                <span>Medical Supplies</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="needsFood"
                  checked={formData.needsFood}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300"
                />
                <span>Food</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="needsShelter"
                  checked={formData.needsShelter}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300"
                />
                <span>Shelter</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Location</h3>
            
            <button
              type="button"
              onClick={getLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
            >
              <MapPin className="h-5 w-5" />
              {isGettingLocation ? 'Getting Location...' : 'Get My Location'}
            </button>
            
            {(formData.latitude && formData.longitude) && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm">
                  <strong>Latitude:</strong> {formData.latitude}
                </p>
                <p className="text-sm">
                  <strong>Longitude:</strong> {formData.longitude}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (!formData.latitude && !formData.longitude)}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
      <CrisisChatbot />
    </div>
  );
};

export default ResourceRequestForm;