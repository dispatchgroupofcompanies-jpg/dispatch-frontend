"use client";

import { Form, Input, Button, message, Spin, Checkbox, Typography } from "antd";
import { useState } from "react";
import { signin } from "../route";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("rememberEmail") : null;
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!savedEmail);

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      const res = await signin(values);
      console.log("Login response:", res);

      if (res.success) {
        message.success("Login successful! Redirecting...");

        // Remember Me Logic Handling
        if (rememberMe) {
          localStorage.setItem("rememberEmail", values.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        // 1. STORE TOKEN (Sabse pehle token update hona chahiye)
        if (res.token) {
          localStorage.setItem("token", res.token);
        }

        // 2. DETECT ROLE & STORE DATA
        const accountData = res.admin || res.user;
        const isAdmin = res.admin || (accountData && accountData.role === "admin");

        if (accountData) {
          localStorage.setItem("userData", JSON.stringify(accountData));
        }

        // 3. 🔥 FIX REDIRECTION LOOP (Bypassing Next.js Cache router)
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const customRedirect = urlParams.get("redirect");

          if (customRedirect) {
            console.log("Redirecting to targeted query path...", customRedirect);
            window.location.href = customRedirect; // URL query parameters ka redirection handle karega
          } else if (isAdmin) {
            console.log("Redirecting to Admin Dashboard...");
            window.location.href = "/admin/dashboard"; 
          } else {
            console.log("Redirecting to User Dashboard...");
            window.location.href = "/user";
          }
        }, 800);

      } else {
        message.error(res.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login component error:", error);
      message.error("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <Spin spinning={loading} description="Signing in...">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center overflow-hidden rounded-2xl shadow-2xl">
            
            {/* Left Side - Branding */}
            <div className="order-2 lg:order-1 hidden lg:block">
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-12 h-full flex flex-col justify-center min-h-screen">
                <div className="space-y-6">
                  <div className="text-6xl font-bold text-white">📱</div>
                  <Title level={3} className="!text-white !mb-4 !text-4xl">
                    Dispatch Management System
                  </Title>
                  <Text className="text-blue-50 text-lg block">
                    Manage your dispatch operations efficiently with our modern platform. Real-time tracking, analytics, and seamless integration.
                  </Text>
                  
                  <div className="pt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <Text className="text-white font-semibold block">Fast & Secure</Text>
                        <Text className="text-blue-100">Bank-level security</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <Text className="text-white font-semibold block">Analytics</Text>
                        <Text className="text-blue-100">Real-time insights</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <Text className="text-white font-semibold block">Lightning Fast</Text>
                        <Text className="text-blue-100">Optimized performance</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 min-h-screen flex flex-col justify-center">
                
                {/* Header */}
                <div className="mb-8">
                  <Title level={2} className="!mb-2 !text-3xl text-center lg:text-left">
                    Welcome Back
                  </Title>
                  <Text type="secondary" className="block text-center lg:text-left text-base">
                    Sign in to your account to continue
                  </Text>
                </div>

                {/* Form */}
                <Form 
                  form={form} 
                  layout="vertical" 
                  onFinish={handleFinish}
                  initialValues={{ email: savedEmail || undefined, remember: rememberMe }}
                  requiredMark="optional"
                  scrollToFirstError
                  className="space-y-4"
                >
                  <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300 font-semibold">Email Address</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Please enter a valid email" }
                    ]}
                  >
                    <Input
                      size="large"
                      type="email"
                      placeholder="your@email.com"
                      prefix={<MailOutlined className="text-gray-400" />}
                      className="!rounded-lg"
                      disabled={loading}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300 font-semibold">Password</span>}
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" }
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="••••••••"
                      prefix={<LockOutlined className="text-gray-400" />}
                      className="!rounded-lg"
                      disabled={loading}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <div className="flex items-center justify-between py-2">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="text-gray-600 dark:text-gray-300"
                      >
                        <span className="text-sm">Remember me</span>
                      </Checkbox>
                    </Form.Item>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    className="!h-12 !rounded-lg !bg-gradient-to-r !from-blue-600 !to-cyan-500 hover:!from-blue-700 hover:!to-cyan-600 !font-semibold !text-base mt-4"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Contact your administrator for account access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}