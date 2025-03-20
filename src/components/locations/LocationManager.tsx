import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Pencil, Trash2, Search } from "lucide-react";
import LocationRegistration from "./LocationRegistration";

interface Location {
  id: string;
  name: string;
  address: string;
  thumbnail?: string;
}

// Create a key for localStorage
const LOCATIONS_STORAGE_KEY = "savedLocations";

// Default locations if none are saved
const defaultLocations = [
  {
    id: "loc1",
    name: "집",
    address: "서울시 강남구 테헤란로 123",
    thumbnail:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&q=80",
  },
  {
    id: "loc2",
    name: "학교",
    address: "서울시 강남구 선릉로 456",
    thumbnail:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80",
  },
  {
    id: "loc3",
    name: "축구교실",
    address: "서울시 강남구 영동대로 789",
    thumbnail:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200&q=80",
  },
  {
    id: "loc4",
    name: "할머니 집",
    address: "서울시 서초구 서초대로 321",
    thumbnail:
      "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=200&q=80",
  },
];

const LocationManager = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Load saved locations from localStorage on component mount
  useEffect(() => {
    const savedLocations = localStorage.getItem(LOCATIONS_STORAGE_KEY);
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    } else {
      setLocations(defaultLocations);
    }
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
    }
  }, [locations]);

  const addLocation = () => {
    if (locations.length < 8) {
      setIsAdding(true);
      setIsEditing(null);
    }
  };

  const saveLocation = (location: { name: string; address: string }) => {
    if (location.name && location.address) {
      if (isEditing) {
        setLocations(
          locations.map((loc) =>
            loc.id === isEditing
              ? {
                  ...loc,
                  name: location.name,
                  address: location.address,
                }
              : loc,
          ),
        );
      } else {
        // Generate a random thumbnail for the new location
        const thumbnail = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200&q=80`;

        setLocations([
          ...locations,
          {
            id: `loc${locations.length + 1}`,
            name: location.name,
            address: location.address,
            thumbnail,
          },
        ]);
      }
      setIsAdding(false);
      setIsEditing(null);
    }
  };

  const editLocation = (location: Location) => {
    setIsEditing(location.id);
    setIsAdding(true);

    // Find the location being edited to pre-populate the form
    const locationToEdit = locations.find((loc) => loc.id === location.id);
    if (locationToEdit) {
      // We'll pass this data to the LocationRegistration component
    }
  };

  const deleteLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const cancelAddEdit = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-base font-medium">
          등록된 주소 ({locations.length}/8)
        </h3>
        <MapPin className="h-4 w-4 text-primary" />
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
        {isAdding ? (
          <LocationRegistration
            onSave={saveLocation}
            onCancel={cancelAddEdit}
            initialData={
              isEditing
                ? locations.find((loc) => loc.id === isEditing) || {
                    name: "",
                    address: "",
                  }
                : { name: "", address: "" }
            }
          />
        ) : (
          <>
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-3 border rounded-md flex justify-between items-start bg-white"
              >
                <div className="flex items-start space-x-2">
                  {location.thumbnail && (
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={location.thumbnail}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {location.address}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => editLocation(location)}
                  >
                    <Pencil className="h-3 w-3 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => deleteLocation(location.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            {locations.length < 8 && (
              <Button
                variant="outline"
                className="w-full h-10 text-sm"
                onClick={addLocation}
              >
                <Plus className="h-3 w-3 mr-1" />새 주소 추가 (최대 8개)
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationManager;
