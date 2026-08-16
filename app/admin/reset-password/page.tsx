"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
} from "antd";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  resetAdminPassword,
} from "@/src/services/admin/admin";

const { Title } = Typography;

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    try {
      // Validate passwords match
      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match!");
        setLoading(false);
        return;
      }

      const response = await resetAdminPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success(
          "Password reset successful! Please login with your new password.",
        );

        // Clear token and redirect to login
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          router.push("/login");
        }, 2000);
      } else {
        message.error(response.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
        }}
        styles={{ body: { padding: "28px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 38, color: "#2563eb", marginBottom: 10 }}
          />
          <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
            Reset Admin Password
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark="optional"
          size="large"
        >
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Current Password
              </span>
            }
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter current password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700">New Password</span>
            }
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter new password (min 6 characters)"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Confirm New Password
              </span>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Re-enter new password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 18 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<CheckCircleOutlined />}
              style={{
                height: 48,
                borderRadius: 8,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                border: "none",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  );
}
