import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationManager from "../locations/LocationManager";
import ChildManager from "./ChildManager";
import { MapPin, User } from "lucide-react";

const ProfileManager = () => {
  const [activeTab, setActiveTab] = useState("locations");

  return (
    <div className="w-full pb-20">
      <Tabs
        defaultValue="locations"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="locations"
            className="flex items-center justify-center"
          >
            <MapPin className="h-4 w-4 mr-2" />
            <span>등록된 주소</span>
          </TabsTrigger>
          <TabsTrigger
            value="children"
            className="flex items-center justify-center"
          >
            <User className="h-4 w-4 mr-2" />
            <span>등록된 아이</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="locations" className="mt-0">
          <LocationManager />
        </TabsContent>
        <TabsContent value="children" className="mt-0">
          <ChildManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileManager;
