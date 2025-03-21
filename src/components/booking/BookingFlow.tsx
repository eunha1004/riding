import React, { useState, useEffect } from "react";
import RideScheduler from "../rides/RideScheduler";
import { getSavedLocations, Location } from "@/lib/locationStore";

interface BookingFlowProps {
  onComplete?: () => void;
}

const BookingFlow = ({ onComplete = () => {} }: BookingFlowProps) => {
  // Use state to store locations
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  // Load locations on component mount
  useEffect(() => {
    try {
      const locations = getSavedLocations();
      setSavedLocations(locations);
    } catch (error) {
      console.error("Error loading locations:", error);
      // Set default empty array if there's an error
      setSavedLocations([]);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen no-scrollbar bg-transparent">
      <div>
        <RideScheduler savedLocations={savedLocations} />
      </div>
    </div>
  );
};

export default BookingFlow;
