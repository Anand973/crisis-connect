"use client"

import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertBanner = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            <span className="font-medium">Active Crisis Alert:</span> Flash flood warning in effect for Riverside County. 
            Seek higher ground immediately if in affected areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;

