import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap, Polyline } from 'react-leaflet';
import { Filter, AlertTriangle, Package, Users, MapPin, User, Navigation } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom component to get user location and update map
const UserLocationMarker = ({ onLocationFound }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Check if component is still mounted
          if (!isMountedRef.current) return;
          
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          onLocationFound({ latitude, longitude });
          
          // Center map on user location - Check if map still exists and has methods
          if (map && map._loaded && isMountedRef.current) {
            try {
              map.setView([latitude, longitude], 13);
            } catch (e) {
              console.error('Error setting map view:', e);
            }
          }
        },
        (error) => {
          if (!isMountedRef.current) return;
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location');
        },
        { enableHighAccuracy: true }
      );
    };

    getUserLocation();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [map, onLocationFound]);

  if (error) return null;
  if (!position) return null;

  // Custom user location icon
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">Your Location</h3>
          <p className="text-sm text-muted-foreground">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const CrisisDashboard = () => {
  const [filters, setFilters] = useState({
    resourceTypes: [],
    urgency: 'all',
    showResources: true,
    showNeeds: true,
    showVolunteers: true,
    showBoundaries: true
  });

  // State for resource requests from the database
  const [resourceRequests, setResourceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for user location and their resource requests
  const [userLocation, setUserLocation] = useState(null);
  const [userResourceRequests, setUserResourceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Add a ref for the map
  const mapRef = useRef(null);

  // State for admin location and route calculation
  const [adminLocation, setAdminLocation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Fetch resource requests from the API
  useEffect(() => {
    const fetchResourceRequests = async () => {
      try {
        setIsLoading(true);
        // Update the API endpoint to use the correct route
        const response = await axios.get('http://localhost:5000/api/resources/resources');
        console.log('Resource requests fetched:', response.data);
        
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          console.log(`Found ${response.data.length} resource requests`);
          
          // Check if each request has the required fields
          const validRequests = response.data.filter(request => {
            const isValid = request && 
                           request.location && 
                           request.location.coordinates && 
                           Array.isArray(request.location.coordinates) && 
                           request.location.coordinates.length === 2;
            
            if (!isValid) {
              console.warn('Invalid resource request:', request);
            }
            
            return isValid;
          });
          
          console.log(`Found ${validRequests.length} valid resource requests`);
          setResourceRequests(validRequests);
        } else {
          console.error('Response data is not an array:', response.data);
          setError('Invalid data format received from server');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching resource requests:', err);
        setError('Failed to load resource requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResourceRequests();
  }, []);

  // Handle user location found
  const handleLocationFound = async (location) => {
    setUserLocation(location);
    
    // Find resource requests near the user's location
    try {
      // In a real app, you would use a geospatial query to find nearby requests
      // For now, we'll just find requests within a certain radius
      const nearbyRequests = resourceRequests.filter(request => {
        const requestCoords = request.location.coordinates;
        const distance = calculateDistance(
          location.latitude, 
          location.longitude, 
          requestCoords[1], 
          requestCoords[0]
        );
        return distance <= 5; // Within 5km
      });
      
      setUserResourceRequests(nearbyRequests);
    } catch (err) {
      console.error('Error finding nearby requests:', err);
    }
  };

  // Calculate distance between two points in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Handle marker click
  const handleMarkerClick = (request) => {
    setSelectedRequest(request);
    
    // Center map on the selected request
    if (mapRef.current) {
      const coordinates = request.location.coordinates;
      const position = [coordinates[1], coordinates[0]]; // Leaflet uses [lat, lng] format
      mapRef.current.setView(position, 15);
    }
  };

  // Sample data - in a real app, this would come from an API
  const resourcePoints = [
    { id: 1, position: [34.0522, -118.2437], type: 'Medical Supplies', name: 'Community Center', status: 'active' },
    { id: 2, position: [34.0722, -118.2637], type: 'Food', name: 'Food Bank', status: 'active' },
    { id: 3, position: [34.0322, -118.2237], type: 'Shelter', name: 'Emergency Shelter', status: 'active' },
  ];

  const areasOfNeed = [
    { id: 1, position: [34.0622, -118.2537], type: 'Medical', urgency: 'high', description: 'Medical supplies needed' },
    { id: 2, position: [34.0822, -118.2737], type: 'Food', urgency: 'medium', description: 'Food distribution needed' },
    { id: 3, position: [34.0422, -118.2337], type: 'Shelter', urgency: 'high', description: 'Emergency shelter needed' },
  ];

  const volunteerLocations = [
    { id: 1, position: [34.0522, -118.2437], name: 'Volunteer Team A', status: 'active' },
    { id: 2, position: [34.0722, -118.2637], name: 'Volunteer Team B', status: 'active' },
    { id: 3, position: [34.0322, -118.2237], name: 'Volunteer Team C', status: 'active' },
  ];

  const crisisBoundaries = [
    {
      id: 1,
      coordinates: [
        [34.0522, -118.2437],
        [34.0722, -118.2637],
        [34.0322, -118.2237],
        [34.0522, -118.2437]
      ],
      type: 'evacuation',
      description: 'Evacuation Zone A'
    }
  ];

  const realTimeUpdates = [
    {
      id: 1,
      timestamp: '2 minutes ago',
      type: 'alert',
      message: 'New resource distribution point added in Downtown',
      urgency: 'high'
    },
    {
      id: 2,
      timestamp: '5 minutes ago',
      type: 'update',
      message: 'Volunteer Team A has completed their current task',
      urgency: 'medium'
    },
    {
      id: 3,
      timestamp: '10 minutes ago',
      type: 'alert',
      message: 'New area of need identified in North District',
      urgency: 'high'
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'Medical':
        return 'red';
      case 'Food':
        return 'green';
      case 'Shelter':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Get icon for resource request based on needs
  const getResourceRequestIcon = (request) => {
    const { resources } = request;
    
    // Create a custom icon based on the resource needs
    let iconColor = 'gray';
    
    if (resources.medical && resources.food && resources.shelter) {
      iconColor = 'purple'; // All needs
    } else if (resources.medical && resources.food) {
      iconColor = 'orange'; // Medical and food
    } else if (resources.medical && resources.shelter) {
      iconColor = 'pink'; // Medical and shelter
    } else if (resources.food && resources.shelter) {
      iconColor = 'cyan'; // Food and shelter
    } else if (resources.medical) {
      iconColor = 'red'; // Only medical
    } else if (resources.food) {
      iconColor = 'green'; // Only food
    } else if (resources.shelter) {
      iconColor = 'blue'; // Only shelter
    }
    
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${iconColor}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Create a custom div icon with resource indicators
  const createResourceDivIcon = (request) => {
    const { resources } = request;
    
    // Create a div element with resource indicators
    const divIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="marker-pin" style="background-color: ${getMarkerBackgroundColor(request)}; width: 30px; height: 30px; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
          ${resources.medical ? '<span style="color: white; font-size: 12px;">M</span>' : ''}
          ${resources.food ? '<span style="color: white; font-size: 12px;">F</span>' : ''}
          ${resources.shelter ? '<span style="color: white; font-size: 12px;">S</span>' : ''}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
    
    return divIcon;
  };

  // Get background color for marker based on resources
  const getMarkerBackgroundColor = (request) => {
    const { resources } = request;
    
    if (resources.medical && resources.food && resources.shelter) {
      return 'purple'; // All needs
    } else if (resources.medical && resources.food) {
      return 'orange'; // Medical and food
    } else if (resources.medical && resources.shelter) {
      return 'pink'; // Medical and shelter
    } else if (resources.food && resources.shelter) {
      return 'cyan'; // Food and shelter
    } else if (resources.medical) {
      return 'red'; // Only medical
    } else if (resources.food) {
      return 'green'; // Only food
    } else if (resources.shelter) {
      return 'blue'; // Only shelter
    }
    
    return 'gray'; // Default
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to calculate route between two points using OSRM API
  const calculateRoute = async (start, end) => {
    try {
      setIsCalculatingRoute(true);
      
      // Format coordinates for OSRM API (longitude,latitude format)
      const startCoord = `${start[1]},${start[0]}`;
      const endCoord = `${end[1]},${end[0]}`;
      
      // Call OSRM API to get the route
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`
      );
      
      if (response.data && response.data.routes && response.data.routes.length > 0) {
        // Extract the route coordinates
        const route = response.data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        setRouteCoordinates(coordinates);
        return coordinates;
      }
      
      return [];
    } catch (error) {
      console.error('Error calculating route:', error);
      return [];
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Function to handle route calculation for a specific request
  const handleCalculateRoute = async (request) => {
    if (!adminLocation) {
      alert('Please set your admin location first');
      return;
    }
    
    setSelectedRequest(request);
    setSelectedRoute(request._id);
    
    // Extract coordinates from the request
    const requestCoords = request.location.coordinates;
    const requestPosition = [requestCoords[1], requestCoords[0]]; // Leaflet uses [lat, lng] format
    
    // Calculate route from admin location to request location
    await calculateRoute(adminLocation, requestPosition);
  };

  // Function to set admin location from current position
  const setAdminLocationFromCurrentPosition = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAdminLocation([latitude, longitude]);
        
        // Center map on admin location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with filters and updates */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Crisis Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time crisis monitoring</p>
        </div>

        {/* Admin Location Section */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Admin Location
          </h3>
          {adminLocation ? (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Latitude:</span> {adminLocation[0].toFixed(4)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Longitude:</span> {adminLocation[1].toFixed(4)}
              </p>
              <button 
                className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                onClick={setAdminLocationFromCurrentPosition}
              >
                Update Location
              </button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-muted-foreground">Admin location not set</p>
              <button 
                className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                onClick={setAdminLocationFromCurrentPosition}
              >
                Set Current Location
              </button>
            </div>
          )}
        </div>

        {/* User Location Section */}
        {userLocation && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Location
            </h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Latitude:</span> {userLocation.latitude.toFixed(4)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Longitude:</span> {userLocation.longitude.toFixed(4)}
              </p>
            </div>
            
            {userResourceRequests.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Nearby Resource Requests</h4>
                <div className="space-y-2">
                  {userResourceRequests.map(request => (
                    <div 
                      key={request._id} 
                      className={`p-2 border rounded-md cursor-pointer ${
                        selectedRequest && selectedRequest._id === request._id 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleMarkerClick(request)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">Request #{request._id.slice(-4)}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {request.resources.medical && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Medical</span>
                          )}
                          {request.resources.food && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Food</span>
                          )}
                          {request.resources.shelter && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Shelter</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resource Requests */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Resource Requests
          </h3>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading resource requests...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : resourceRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resource requests found.</p>
          ) : (
            <div className="space-y-3">
              {resourceRequests.map(request => (
                <div 
                  key={request._id} 
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedRequest && selectedRequest._id === request._id 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleMarkerClick(request)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">Request #{request._id.slice(-4)}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {request.resources.medical && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Medical</span>
                      )}
                      {request.resources.food && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Food</span>
                      )}
                      {request.resources.shelter && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Shelter</span>
                      )}
                    </div>
                  </div>
                  {adminLocation && (
                    <button 
                      className="mt-2 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCalculateRoute(request);
                      }}
                    >
                      Show Route
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Request Details */}
        {selectedRequest && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Request Details
            </h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-sm mb-2">Request #{selectedRequest._id.slice(-4)}</h4>
              <p className="text-xs text-muted-foreground mb-3">
                {formatDate(selectedRequest.createdAt)}
              </p>
              
              <div className="space-y-2 mb-3">
                <h5 className="text-sm font-medium">Resources Needed:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.resources.medical && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Medical Supplies</span>
                  )}
                  {selectedRequest.resources.food && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Food</span>
                  )}
                  {selectedRequest.resources.shelter && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Shelter</span>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium">Location:</h5>
                <p className="text-xs text-muted-foreground">
                  {selectedRequest.location.coordinates[1].toFixed(4)}, {selectedRequest.location.coordinates[0].toFixed(4)}
                </p>
              </div>
              
              {adminLocation && (
                <button 
                  className="mt-3 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  onClick={() => handleCalculateRoute(selectedRequest)}
                >
                  {selectedRoute === selectedRequest._id ? 'Hide Route' : 'Show Route'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        <div className="p-4">
          <h3 className="font-semibold mb-3">Real-time Updates</h3>
          <div className="space-y-4">
            {realTimeUpdates.map(update => (
              <div
                key={update.id}
                className={`p-3 rounded-lg border ${
                  update.urgency === 'high' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    update.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {update.urgency}
                  </span>
                </div>
                <p className="text-sm">{update.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[34.0522, -118.2437]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location Marker */}
          <UserLocationMarker onLocationFound={handleLocationFound} />

          {/* Admin Location Marker */}
          {adminLocation && (
            <Marker 
              position={adminLocation}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">Admin Location</h3>
                  <p className="text-xs text-muted-foreground">
                    {adminLocation[0].toFixed(4)}, {adminLocation[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route from Admin to Selected Request */}
          {routeCoordinates.length > 0 && selectedRoute && (
            <Polyline
              positions={routeCoordinates}
              color="blue"
              weight={5}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}

          {/* Resource Requests from Database */}
          {resourceRequests.map(request => {
            // Extract coordinates from the location field
            const coordinates = request.location.coordinates;
            const position = [coordinates[1], coordinates[0]]; // Leaflet uses [lat, lng] format
            
            return (
              <Marker 
                key={request._id} 
                position={position}
                icon={createResourceDivIcon(request)}
                eventHandlers={{
                  click: () => handleMarkerClick(request)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Resource Request</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDate(request.createdAt)}
                    </p>
                    <div className="space-y-1">
                      {request.resources.medical && (
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                          <span className="text-sm">Medical Supplies</span>
                        </div>
                      )}
                      {request.resources.food && (
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                          <span className="text-sm">Food</span>
                        </div>
                      )}
                      {request.resources.shelter && (
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          <span className="text-sm">Shelter</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Location: {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}</p>
                    </div>
                    <button 
                      className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      onClick={() => handleMarkerClick(request)}
                    >
                      View Details
                    </button>
                    {adminLocation && (
                      <button 
                        className="mt-2 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCalculateRoute(request);
                        }}
                      >
                        Show Route
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Areas of Need */}
          {filters.showNeeds && areasOfNeed.map(area => (
            <Circle
              key={area.id}
              center={area.position}
              radius={500}
              pathOptions={{
                color: getMarkerColor(area.type),
                fillColor: getMarkerColor(area.type),
                fillOpacity: 0.2,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{area.type} Need</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    area.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {area.urgency} urgency
                  </span>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Volunteer Locations */}
          {filters.showVolunteers && volunteerLocations.map(volunteer => (
            <Marker key={volunteer.id} position={volunteer.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{volunteer.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    volunteer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Crisis Boundaries */}
          {filters.showBoundaries && crisisBoundaries.map(boundary => (
            <Polygon
              key={boundary.id}
              positions={boundary.coordinates}
              pathOptions={{
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.1,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{boundary.description}</h3>
                  <p className="text-sm text-muted-foreground">{boundary.type}</p>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>
        
        {/* Status overlay for resource requests */}
        <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-md shadow-md">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading resource requests...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : resourceRequests.length === 0 ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">No resource requests found</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-500">
              <Package className="w-4 h-4" />
              <span className="text-sm">{resourceRequests.length} resource requests</span>
            </div>
          )}
        </div>
        
        {/* Route calculation status */}
        {isCalculatingRoute && (
          <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-md shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Calculating route...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrisisDashboard; 