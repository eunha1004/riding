import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface AddressSearchProps {
  onSelectAddress?: (address: string) => void;
}

const AddressSearch = ({ onSelectAddress = () => {} }: AddressSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { address: string; thumbnail: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // 네이버 API 주소 검색 시뮬레이션
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    // 검색 결과 시뮬레이션 (실제로는 네이버 API 호출)
    setTimeout(() => {
      const results = [
        {
          address: `${searchTerm} 1번길 123`,
          thumbnail:
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&q=80",
        },
        {
          address: `${searchTerm} 2번길 456`,
          thumbnail:
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80",
        },
        {
          address: `${searchTerm} 3번길 789`,
          thumbnail:
            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200&q=80",
        },
        {
          address: `${searchTerm} 중앙로 100`,
          thumbnail:
            "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=200&q=80",
        },
      ];
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const handleSelectAddress = (result: {
    address: string;
    thumbnail: string;
  }) => {
    onSelectAddress(result.address);
    setSearchResults([]);
    setSearchTerm("");
  };

  return (
    <div className="w-full space-y-3 bg-background">
      <div className="flex space-x-2">
        <Input
          placeholder="주소 검색 (동, 도로명)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button size="sm" onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs mt-2 text-gray-500">주소 검색 중...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="text-xs font-medium p-2 bg-muted">
            검색 결과 ({searchResults.length})
          </div>
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 text-sm hover:bg-muted cursor-pointer flex items-center border-t"
                onClick={() => handleSelectAddress(result)}
              >
                <div className="w-10 h-10 rounded overflow-hidden mr-2 flex-shrink-0">
                  <img
                    src={result.thumbnail}
                    alt="위치 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <MapPin className="h-3 w-3 inline-block mr-1 text-gray-400" />
                  <span className="text-xs">{result.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
