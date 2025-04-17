import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import { Filter, AlertTriangle, Package, Users, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CrisisDashboard = () => {
  const [filters, setFilters] = useState({
    resourceTypes: [],
    urgency: 'all',
    showResources: true,
    showNeeds: true,
    showVolunteers: true,
    showBoundaries: true
  });

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

  return (
    <div className="flex h-screen">
      {/* Sidebar with filters and updates */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Crisis Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time crisis monitoring</p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resource Types</label>
              <div className="space-y-2">
                {['Medical Supplies', 'Food', 'Shelter', 'Transportation'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.resourceTypes.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.resourceTypes, type]
                          : filters.resourceTypes.filter(t => t !== type);
                        handleFilterChange('resourceTypes', newTypes);
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Urgency Level</label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Levels</option>
                <option value="high">High Urgency</option>
                <option value="medium">Medium Urgency</option>
                <option value="low">Low Urgency</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showResources}
                  onChange={(e) => handleFilterChange('showResources', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Show Resource Points</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showNeeds}
                  onChange={(e) => handleFilterChange('showNeeds', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Show Areas of Need</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showVolunteers}
                  onChange={(e) => handleFilterChange('showVolunteers', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Show Volunteer Locations</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showBoundaries}
                  onChange={(e) => handleFilterChange('showBoundaries', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Show Crisis Boundaries</span>
              </label>
            </div>
          </div>
        </div>

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
      <div className="flex-1">
        <MapContainer
          center={[34.0522, -118.2437]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Resource Points */}
          {filters.showResources && resourcePoints.map(point => (
            <Marker key={point.id} position={point.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{point.name}</h3>
                  <p className="text-sm text-muted-foreground">{point.type}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    point.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {point.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

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
      </div>
    </div>
  );
};

export default CrisisDashboard; 