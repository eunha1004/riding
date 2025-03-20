import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  Input,
  Modal,
  Form,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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

const AntLocationManager = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [form] = Form.useForm();

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

  const showAddModal = () => {
    setEditingLocation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (location: Location) => {
    setEditingLocation(location);
    form.setFieldsValue({
      name: location.name,
      address: location.address,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingLocation) {
        // Update existing location
        setLocations(
          locations.map((loc) =>
            loc.id === editingLocation.id
              ? {
                  ...loc,
                  name: values.name,
                  address: values.address,
                }
              : loc,
          ),
        );
      } else {
        // Add new location
        const thumbnail = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200&q=80`;
        setLocations([
          ...locations,
          {
            id: `loc${locations.length + 1}`,
            name: values.name,
            address: values.address,
            thumbnail,
          },
        ]);
      }
      setIsModalVisible(false);
    });
  };

  const deleteLocation = (id: string) => {
    Modal.confirm({
      title: "위치 삭제",
      content: "이 위치를 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        setLocations(locations.filter((loc) => loc.id !== id));
      },
    });
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      <Card className="w-full shadow-[4px_4px_24px_0px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center mb-4">
          <Space>
            <EnvironmentOutlined />
            <Title level={5} style={{ margin: 0 }}>
              등록된 주소 ({locations.length}/8)
            </Title>
          </Space>
        </div>

        <List
          dataSource={locations}
          renderItem={(location) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  size="small"
                  onClick={() => showEditModal(location)}
                />,
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  size="small"
                  danger
                  onClick={() => deleteLocation(location.id)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  location.thumbnail && (
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <img
                        src={location.thumbnail}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                }
                title={<Text strong>{location.name}</Text>}
                description={
                  <Text type="secondary" ellipsis>
                    {location.address}
                  </Text>
                }
              />
            </List.Item>
          )}
        />

        {locations.length < 8 && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className="w-full mt-4"
          >
            새 주소 추가 (최대 8개)
          </Button>
        )}
      </Card>

      <Modal
        title={editingLocation ? "주소 수정" : "새 주소 추가"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={editingLocation ? "수정" : "추가"}
        cancelText="취소"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="위치 이름"
            rules={[{ required: true, message: "위치 이름을 입력해주세요" }]}
          >
            <Input placeholder="예: 집, 학교, 학원" />
          </Form.Item>
          <Form.Item
            name="address"
            label="주소"
            rules={[{ required: true, message: "주소를 입력해주세요" }]}
          >
            <Input placeholder="주소 입력" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AntLocationManager;
