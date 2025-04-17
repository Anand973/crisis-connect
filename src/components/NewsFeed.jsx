import React, { useState } from 'react';
import { AlertTriangle, MapPin, Zap, HeartPulse, Shield } from 'lucide-react';

const NewsFeed = () => {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      type: 'weather',
      title: 'Severe Thunderstorm Warning',
      location: 'Mumbai, Maharashtra',
      description: 'Heavy rainfall expected in the next 2 hours. Residents advised to stay indoors.',
      timestamp: new Date(),
      severity: 'high',
      verified: true
    },
    {
      id: 2,
      type: 'road',
      title: 'Road Blockage Alert',
      location: 'NH48, Delhi-Gurgaon Expressway',
      description: 'Major accident reported. Expect delays of 2-3 hours. Alternative routes suggested.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      severity: 'medium',
      verified: true
    },
    {
      id: 3,
      type: 'power',
      title: 'Power Outage Update',
      location: 'Bangalore, Karnataka',
      description: 'Scheduled maintenance causing power outage in multiple areas. Expected restoration in 4 hours.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      severity: 'medium',
      verified: true
    },
    {
      id: 4,
      type: 'medical',
      title: 'Medical Emergency Alert',
      location: 'Chennai, Tamil Nadu',
      description: 'Urgent need for blood donors of type O+. Contact nearest blood bank immediately.',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      severity: 'high',
      verified: true
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'weather':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'road':
        return <MapPin className="h-5 w-5 text-red-500" />;
      case 'power':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'medical':
        return <HeartPulse className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">{getIcon(update.type)}</div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{update.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityColor(update.severity)}`}>
                  {update.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{update.location}</span>
              </div>
              <p className="text-sm">{update.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{update.timestamp.toLocaleTimeString()}</span>
                {update.verified && (
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    Verified Update
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;