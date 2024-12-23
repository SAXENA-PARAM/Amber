// components/SplineWrapper.tsx
import React, { useEffect, useState } from 'react';

const SplineWrapper: React.FC<any> = (props) => {
  const [LoadedSpline, setLoadedSpline] = useState<React.FC<any> | null>(null);

  useEffect(() => {
    const loadSpline = async () => {
      // Dynamically import the Spline component
      const { default: SplineComponent } = await import('@splinetool/react-spline/next');
      setLoadedSpline(() => (props: any) => <SplineComponent {...props} />); // Correctly wrapping the component
    };

    loadSpline();
  }, []);

  if (!LoadedSpline) {
    return <div>Loading...</div>; // Loading spinner or message
  }

  return <LoadedSpline {...props} />;
};

export default SplineWrapper;
