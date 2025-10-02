'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [dbStatus, setDbStatus] = useState('Testing...');

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      // Test health endpoint
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        setApiStatus('✅ API Working');
      } else {
        setApiStatus('❌ API Error: ' + healthRes.status);
      }

      // Test database connection
      try {
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          setDbStatus('✅ Database Connected');
        } else {
          setDbStatus('❌ Database Error: ' + productsRes.status);
        }
      } catch (error) {
        setDbStatus('❌ Database Error: ' + error.message);
      }
    } catch (error) {
      setApiStatus('❌ API Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🚀 PulsePixelTech Deployment Test
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">API Status:</h3>
            <p className="text-sm">{apiStatus}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Database Status:</h3>
            <p className="text-sm">{dbStatus}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Environment:</h3>
            <p className="text-sm text-blue-600">
              {process.env.NODE_ENV || 'development'}
            </p>
          </div>
          
          <div className="text-center pt-4">
            <a 
              href="/" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}