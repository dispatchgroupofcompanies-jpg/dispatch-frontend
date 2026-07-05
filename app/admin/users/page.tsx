"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Table,
  message,
} from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  createUserApi,
  getAllUsersApi,
  updateUserApi,
  deleteUserApi,
} from "@/src/services/addUserService";

interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
}

export default function AddUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 🔄 1. Data load karne ka function (GET API)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      if (res.success) {
        setUsers(res.data || res); // Agar backend response wrap hoke aata hai to res.data, nahi to direct res
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : "Users list load karne mein error aaya.";
      message.error(errorMessage || "Users list load karne mein error aaya.");
    } finally {
      setLoading(false);
    }
  };

  // Component mount hote hi data load karein
  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };
    loadUsers();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 💾 2. Form submission hander (POST API)
  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    address: string;
  }) => {
    setSubmitLoading(true);
    try {
      const res = await createUserApi(values);
      if (res.success || res) {
        message.success("User successfully add ho gaya!");
        setIsModalOpen(false);
        form.resetFields();
        fetchUsers(); // Naya user dikhane ke liye table auto-refresh
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : "User add karne mein koi problem aayi.";
      message.error(errorMessage || "User add karne mein koi problem aayi.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✏️ Edit user handler
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      address: user.address,
    });
    setIsEditModalOpen(true);
  };

  // 🗑️ Delete user handler
  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // ✅ Confirm delete
  const confirmDelete = async () => {
    if (!deletingUser?._id) return;

    try {
      const res = await deleteUserApi(deletingUser._id);
      if (res.success) {
        message.success("User deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        fetchUsers();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : "User delete karne mein error aaya.";
      message.error(errorMessage || "User delete karne mein error aaya.");
    }
  };

  // 💾 Update user handler
  const onEditFinish = async (values: {
    name: string;
    email: string;
    password?: string;
    address: string;
  }) => {
    if (!editingUser?._id) return;

    setSubmitLoading(true);
    try {
      const updateData = { ...values };
      // Agar password empty hai to remove karein
      if (!updateData.password) {
        delete updateData.password;
      }

      const res = await updateUserApi(editingUser._id, updateData);
      if (res.success) {
        message.success("User updated successfully!");
        setIsEditModalOpen(false);
        setEditingUser(null);
        form.resetFields();
        fetchUsers();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response: { data: { message?: string } } }).response
              ?.data?.message
          : "User update karne mein error aaya.";
      message.error(errorMessage || "User update karne mein error aaya.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Ant Design Table Columns Config
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <strong style={{ color: "#1e293b" }}>{text}</strong>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Street Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true, // Zyada lamba address hone par dots (...) show karega
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            style={{ background: "#2563eb" }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Header Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Users Directory
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
            Manage and onboard system users.
          </p>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={showModal}
          size="middle"
          style={{
            background: "#2563eb",
            borderRadius: "6px",
          }}
        >
          Add User
        </Button>
      </div>

      <hr
        style={{
          border: "0",
          borderTop: "1px solid #e2e8f0",
          marginBottom: "16px",
        }}
      />

      {/* 📊 Placeholder block hata kar actual Ant Design Table lagayi hai */}
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id" // MongoDB mapping target identification key
        loading={loading}
        pagination={{ pageSize: 8, size: "small" }}
        size="small"
        style={{
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      />

      {/* Responsive Input Modal Form */}
      <Modal
        title={
          <Space>
            <UserAddOutlined style={{ color: "#2563eb" }} />
            <span>Create New User Profile</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={650}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
          requiredMark="optional"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Aaqib Bashir"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="johndoe@example.com"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please secure with a password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="••••••••"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[
                  {
                    required: true,
                    message: "Please provide structural address info",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="123 Logistics Way, Suite 100..."
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitLoading}
              style={{ background: "#2563eb" }}
            >
              Save User
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ✏️ Edit User Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: "#2563eb" }} />
            <span>Edit User Profile</span>
          </Space>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={650}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onEditFinish}
          style={{ marginTop: "20px" }}
          requiredMark="optional"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Aaqib Bashir"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="johndoe@example.com"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please secure with a password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Enter new password"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[
                  {
                    required: true,
                    message: "Please provide structural address info",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="123 Logistics Way, Suite 100..."
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
                form.resetFields();
              }}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitLoading}
              style={{ background: "#2563eb" }}
            >
              Update User
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal
        title={
          <Space>
            <DeleteOutlined style={{ color: "#ff4d4f" }} />
            <span>Delete User</span>
          </Space>
        }
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setDeletingUser(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            onClick={confirmDelete}
            loading={submitLoading}
          >
            Delete
          </Button>,
        ]}
        width={450}
      >
        <div style={{ padding: "20px 0" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>
            Are you sure you want to delete this user?
          </p>
          {deletingUser && (
            <div
              style={{
                background: "#f5f5f5",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "12px",
              }}
            >
              <p style={{ margin: "4px 0", fontWeight: 500 }}>
                <strong>Name:</strong> {deletingUser.name}
              </p>
              <p style={{ margin: "4px 0", fontWeight: 500 }}>
                <strong>Email:</strong> {deletingUser.email}
              </p>
            </div>
          )}
          <p style={{ color: "#8c8c8c", marginTop: "12px", marginBottom: 0 }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
