/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for window width
const WindowWidthContext = createContext();

/**
 * WindowWidthProvider component
 *
 * This component provides the window width state to its children.
 * It checks if the window width is less than 768 pixels, indicating a smaller device.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The children components that will have access to the context.
 */
export const WindowWidthProvider = ({ children }) => {
  // State to track if the device width is smaller than 768px
  const [isSmallerDevice, setIsSmallerDevice] = useState(false); // Initialize with false

  // Function to update the state based on window width
  const handleResize = () => {
    setIsSmallerDevice(window.innerWidth < 768);
  };

  // Add event listener for window resize and cleanup on unmount
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      setIsSmallerDevice(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
};

/**
 * Custom hook to use the WindowWidthContext
 *
 * This hook provides access to the window width context, allowing components to check
 * if the device width is smaller than 768 pixels.
 *
 * @returns {object} - An object containing the `isSmallerDevice` boolean state.
 */
export const useWindowWidth = () => {
  return useContext(WindowWidthContext);
};
