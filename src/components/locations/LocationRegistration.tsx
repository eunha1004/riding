import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AddressSearch from "../rides/AddressSearch";

interface LocationRegistrationProps {
  onSave?: (location: { name: string; address: string }) => void;
  onCancel?: () => void;
  initialData?: { name: string; address: string };
}

const LocationRegistration = ({
  onSave = () => {},
  onCancel = () => {},
  initialData = { name: "", address: "" },
}: LocationRegistrationProps) => {
  const [locationName, setLocationName] = useState(initialData.name);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [address, setAddress] = useState(initialData.address);
  const [directInput, setDirectInput] = useState(initialData.address !== "");

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setShowAddressSearch(false);
  };

  const handleSave = () => {
    if (locationName && address) {
      onSave({ name: locationName, address });
    }
  };

  const toggleDirectInput = () => {
    setDirectInput(!directInput);
    setShowAddressSearch(false);
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg">
      <div className="space-y-2">
        <label className="text-base font-medium">위치 이름</label>
        <Input
          placeholder="예: 집, 학교, 학원"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium">주소</label>
        {!directInput ? (
          <div className="space-y-2">
            {!showAddressSearch ? (
              <div className="flex space-x-2">
                <Input
                  placeholder="주소 검색 (동, 도로명)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  readOnly={true}
                  className="cursor-pointer"
                  onClick={() => setShowAddressSearch(true)}
                />
                <Button size="icon" onClick={() => setShowAddressSearch(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <AddressSearch onSelectAddress={handleAddressSelect} />
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleDirectInput}
            >
              직접 입력으로 전환
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="주소 직접 입력"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleDirectInput}
            >
              주소 검색으로 전환
            </Button>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          취소
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!locationName || !address}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default LocationRegistration;
