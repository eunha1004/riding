import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChildRegistrationProps {
  onSave?: (child: {
    name: string;
    birthdate: string;
    gender: string;
    notes: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
    birthdate: string;
    gender: string;
    notes: string;
  };
}

const ChildRegistration = ({
  onSave = () => {},
  onCancel = () => {},
  initialData = { name: "", birthdate: "", gender: "", notes: "" },
}: ChildRegistrationProps) => {
  const [childName, setChildName] = useState(initialData.name);
  const [birthdate, setBirthdate] = useState(initialData.birthdate);
  const [gender, setGender] = useState(initialData.gender || "male");
  const [notes, setNotes] = useState(initialData.notes);

  const handleSave = () => {
    if (childName && birthdate) {
      onSave({ name: childName, birthdate, gender, notes });
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg">
      <div className="space-y-2">
        <label className="text-base font-medium">아이 이름</label>
        <Input
          placeholder="아이 이름을 입력해주세요"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium">생년월일</label>
        <Input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium">성별</label>
        <RadioGroup
          value={gender}
          onValueChange={setGender}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">남자</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">여자</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium">추가 요청 사항</label>
        <Textarea
          placeholder="아이를 이해하기에 좋은 참고사항등을 입력해 주세요."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          취소
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!childName || !birthdate}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default ChildRegistration;
