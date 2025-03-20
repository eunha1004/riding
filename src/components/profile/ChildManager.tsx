import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Plus, Pencil, Trash2 } from "lucide-react";
import ChildRegistration from "./ChildRegistration";

interface Child {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  notes: string;
}

// Create a key for localStorage
const CHILDREN_STORAGE_KEY = "savedChildren";

// Default children if none are saved
const defaultChildren = [
  {
    id: "child1",
    name: "김민준",
    birthdate: "2015-05-15",
    gender: "male",
    notes: "축구를 좋아합니다. 알레르기: 땅콩",
  },
  {
    id: "child2",
    name: "김서연",
    birthdate: "2017-08-22",
    gender: "female",
    notes: "그림 그리기를 좋아합니다.",
  },
];

const ChildManager = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Load saved children from localStorage on component mount
  useEffect(() => {
    const savedChildren = localStorage.getItem(CHILDREN_STORAGE_KEY);
    if (savedChildren) {
      setChildren(JSON.parse(savedChildren));
    } else {
      setChildren(defaultChildren);
    }
  }, []);

  // Save children to localStorage whenever they change
  useEffect(() => {
    if (children.length > 0) {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(children));
    }
  }, [children]);

  const addChild = () => {
    if (children.length < 5) {
      setIsAdding(true);
      setIsEditing(null);
    }
  };

  const saveChild = (child: {
    name: string;
    birthdate: string;
    gender: string;
    notes: string;
  }) => {
    if (child.name && child.birthdate) {
      if (isEditing) {
        setChildren(
          children.map((c) =>
            c.id === isEditing
              ? {
                  ...c,
                  name: child.name,
                  birthdate: child.birthdate,
                  gender: child.gender,
                  notes: child.notes,
                }
              : c,
          ),
        );
      } else {
        setChildren([
          ...children,
          {
            id: `child${children.length + 1}`,
            name: child.name,
            birthdate: child.birthdate,
            gender: child.gender,
            notes: child.notes,
          },
        ]);
      }
      setIsAdding(false);
      setIsEditing(null);
    }
  };

  const editChild = (child: Child) => {
    setIsEditing(child.id);
    setIsAdding(true);
  };

  const deleteChild = (id: string) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const cancelAddEdit = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  // Format birthdate to Korean format
  const formatBirthdate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="w-full overflow-y-auto max-h-[90vh]">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-base font-medium">
          등록된 아이 ({children.length}/5)
        </h3>
        <User className="h-4 w-4 text-primary" />
      </div>

      <div className="space-y-3">
        {isAdding ? (
          <ChildRegistration
            onSave={saveChild}
            onCancel={cancelAddEdit}
            initialData={
              isEditing
                ? children.find((child) => child.id === isEditing) || {
                    name: "",
                    birthdate: "",
                    gender: "",
                    notes: "",
                  }
                : { name: "", birthdate: "", gender: "", notes: "" }
            }
          />
        ) : (
          <>
            {children.map((child) => (
              <div
                key={child.id}
                className="p-3 border rounded-md flex justify-between items-start bg-white"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">{child.name}</p>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {calculateAge(child.birthdate)}세
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {child.gender === "male" ? "남" : "여"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBirthdate(child.birthdate)}
                  </p>
                  {child.notes && (
                    <p className="text-xs text-gray-500 mt-1 max-w-[250px]">
                      {child.notes}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => editChild(child)}
                  >
                    <Pencil className="h-3 w-3 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => deleteChild(child.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            {children.length < 5 && (
              <Button
                variant="outline"
                className="w-full h-10 text-sm"
                onClick={addChild}
              >
                <Plus className="h-3 w-3 mr-1" />새 아이 등록 (최대 5명)
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChildManager;
