"use client"

import React from 'react';
import { Users, MapPin, Shield, Heart } from 'lucide-react';

const ImpactMetrics = () => {
  // Sample impact data (this would come from backend in production)
  const metrics = [
    {
      icon: Users,
      label: "People Helped",
      value: "1.2M+",
      description: "Individuals assisted during crises"
    },
    {
      icon: MapPin,
      label: "Active Locations",
      value: "45+",
      description: "Cities and regions covered"
    },
    {
      icon: Shield,
      label: "Verified Volunteers",
      value: "25K+",
      description: "Trained and verified helpers"
    },
    {
      icon: Heart,
      label: "Success Rate",
      value: "98%",
      description: "Of crisis situations resolved"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {metrics.map((metric, index) => (
        <div key={index} className="rounded-lg border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <metric.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{metric.value}</h3>
          <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ImpactMetrics;

