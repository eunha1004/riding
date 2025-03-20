// A simple store for managing locations across components

export interface Location {
  id: string;
  name: string;
  address: string;
  thumbnail?: string;
}

// Storage key for localStorage
export const LOCATIONS_STORAGE_KEY = "savedLocations";

// Default locations if none are saved
export const defaultLocations: Location[] = [
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

// Get all saved locations
export const getSavedLocations = (): Location[] => {
  try {
    const savedLocations = localStorage.getItem(LOCATIONS_STORAGE_KEY);
    if (savedLocations) {
      return JSON.parse(savedLocations);
    }
    // Initialize localStorage with default locations if not already set
    saveLocations(defaultLocations);
    return defaultLocations;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return defaultLocations;
  }
};

// Save locations to localStorage
export const saveLocations = (locations: Location[]): void => {
  try {
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Add a new location
export const addLocation = (
  location: Omit<Location, "id" | "thumbnail">,
): Location[] => {
  const currentLocations = getSavedLocations();
  const newLocation = {
    ...location,
    id: `loc${Date.now()}`,
    thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200&q=80`,
  };

  const updatedLocations = [...currentLocations, newLocation];
  saveLocations(updatedLocations);
  return updatedLocations;
};

// Update an existing location
export const updateLocation = (
  id: string,
  updates: Partial<Location>,
): Location[] => {
  const currentLocations = getSavedLocations();
  const updatedLocations = currentLocations.map((location) =>
    location.id === id ? { ...location, ...updates } : location,
  );

  saveLocations(updatedLocations);
  return updatedLocations;
};

// Delete a location
export const deleteLocation = (id: string): Location[] => {
  const currentLocations = getSavedLocations();
  const updatedLocations = currentLocations.filter(
    (location) => location.id !== id,
  );

  saveLocations(updatedLocations);
  return updatedLocations;
};
