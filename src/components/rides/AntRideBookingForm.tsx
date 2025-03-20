import React from "react";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";

const { Option } = Select;

const AntRideBookingForm: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="Child's Name"
        name="childName"
        rules={[{ required: true, message: "Please enter the child's name" }]}
      >
        <Input placeholder="Enter child's name" />
      </Form.Item>

      <Form.Item
        label="Pickup Location"
        name="pickup"
        rules={[{ required: true, message: "Please select a pickup location" }]}
      >
        <Select placeholder="Select pickup location">
          <Option value="home">Home</Option>
          <Option value="school">School</Option>
          <Option value="gym">Gym</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Drop-off Location"
        name="dropoff"
        rules={[
          { required: true, message: "Please select a drop-off location" },
        ]}
      >
        <Select placeholder="Select drop-off location">
          <Option value="home">Home</Option>
          <Option value="school">School</Option>
          <Option value="gym">Gym</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Date & Time" required>
        <DatePicker placeholder="Select date" style={{ width: "100%" }} />
        <TimePicker
          use12Hours
          format="h:mm a"
          placeholder="Select time"
          style={{ width: "100%", marginTop: "8px" }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Book Ride
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AntRideBookingForm;
