"use client"

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CrisisMap = () => {
  // Sample crisis data for India
  const crisisData = [
    {
      id: 1,
      location: [20.5937, 78.9629], // Central India
      title: "Flood in Maharashtra",
      description: "Severe flooding affecting multiple districts",
      type: "flood",
      severity: "high",
      affected: "50,000+ people"
    },
    {
      id: 2,
      location: [28.6139, 77.2090], // Delhi
      title: "Heat Wave Alert",
      description: "Extreme temperatures affecting vulnerable populations",
      type: "heatwave",
      severity: "medium",
      affected: "100,000+ people"
    },
    {
      id: 3,
      location: [19.0760, 72.8777], // Mumbai
      title: "Monsoon Flooding",
      description: "Heavy rainfall causing waterlogging",
      type: "flood",
      severity: "medium",
      affected: "25,000+ people"
    },
    {
      id: 4,
      location: [12.9716, 77.5946], // Bangalore
      title: "Urban Flooding",
      description: "Heavy rains causing infrastructure damage",
      type: "flood",
      severity: "low",
      affected: "10,000+ people"
    }
  ];

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Center on India
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {crisisData.map((crisis) => (
        <Marker key={crisis.id} position={crisis.location}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{crisis.title}</h3>
              <p className="text-sm">{crisis.description}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  crisis.severity === 'high' ? 'bg-red-100 text-red-800' :
                  crisis.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {crisis.severity.toUpperCase()} SEVERITY
                </span>
              </div>
              <p className="text-sm mt-1">Affected: {crisis.affected}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CrisisMap;

