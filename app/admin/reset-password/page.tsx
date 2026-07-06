"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
  Space,
  Alert,
} from "antd";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  resetAdminPassword,
  getAdminProfile,
} from "@/src/services/admin/admin";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAdminProfile();
        if (response.success && response.admin) {
          setAdminEmail(response.admin.email);
          // Check if password is still hardcoded (first time user)
          // We'll show a special message for first-time users
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SafetyCertificateOutlined
            style={{ fontSize: 48, color: "#2563eb", marginBottom: 16 }}
          />
          <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
            Reset Admin Password
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Secure your account with a new password
          </Text>
        </div>

        {adminEmail && (
          <Alert
            message={`Logged in as: ${adminEmail}`}
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        <Alert
          message="Security Notice"
          description="After resetting your password, you will need to login again with your new password. The old password will no longer work."
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />

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
              placeholder="Enter current password (default: 111111)"
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

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
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

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Remember your password?{" "}
            <Button
              type="link"
              onClick={() => router.push("/admin/dashboard")}
              style={{ padding: 0, height: "auto", fontWeight: 600 }}
            >
              Go to Dashboard
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
}
