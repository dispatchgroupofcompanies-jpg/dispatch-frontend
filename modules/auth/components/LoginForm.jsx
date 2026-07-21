"use client";

import { Form, Input, Button, message, Spin, Checkbox, Typography, Alert, Card } from "antd";
import { useState, useEffect } from "react";
import { signin } from "../route";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, SafetyCertificateOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("rememberEmail") : null;
  const savedDeviceId = typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!savedEmail);
  const [deviceId, setDeviceId] = useState(savedDeviceId);
  const [deviceGenerated, setDeviceGenerated] = useState(!!savedDeviceId);
  
  // Auto-generate device ID on mount if not present
  useEffect(() => {
    const initDeviceId = async () => {
      // If device ID already exists in state or localStorage, skip
      if (deviceId || (typeof window !== "undefined" && localStorage.getItem("deviceId"))) {
        return;
      }
      
      // Auto-generate device ID
      try {
        const FP = await import("@fingerprintjs/fingerprintjs");
        const fp = await FP.load();
        const result = await fp.get();
        const newDeviceId = result.visitorId;
        
        setDeviceId(newDeviceId);
        setDeviceGenerated(true);
        
        if (typeof window !== "undefined") {
          localStorage.setItem("deviceId", newDeviceId);
        }
        
        console.log("Device ID auto-generated on mount:", newDeviceId);
      } catch (error) {
          console.error("Failed to auto-generate device ID:", error);
      }
    };
    
    initDeviceId();
  }, []);



  const handleFinish = async (values) => {
    setLoading(true);

    try {
      // Get deviceId from multiple sources
      let currentDeviceId = deviceId;
      
      // If not in state, try localStorage
      if (!currentDeviceId && typeof window !== "undefined") {
        currentDeviceId = localStorage.getItem("deviceId");
      }
      
      // If still not found, try to generate it automatically
      if (!currentDeviceId) {
        console.log("No device ID found, attempting to generate...");
        try {
          const FP = await import("@fingerprintjs/fingerprintjs");
          const fp = await FP.load();
          const result = await fp.get();
          currentDeviceId = result.visitorId;
          
          // Save to state and localStorage
          setDeviceId(currentDeviceId);
          setDeviceGenerated(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("deviceId", currentDeviceId);
          }
          console.log("Device ID generated automatically:", currentDeviceId);
        } catch (error) {
          console.error("Failed to auto-generate device ID:", error);
        }
      }
      
      
      // Add deviceId and userAgent to login data
      const loginData = {
        ...values,
        deviceId: currentDeviceId,
        userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
      };

      const res = await signin(loginData);

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
            window.location.href = customRedirect; // URL query parameters ka redirection handle karega
          } else if (isAdmin) {
            window.location.href = "/admin/dashboard"; 
          } else {
            window.location.href = "/user";
          }
        }, 800);

      } else if (res.status === "device_id_required") {
        // Device ID required
        message.warning({
          content: "Please generate your device ID first. Click 'Generate Device ID' button below.",
          duration: 10,
        });
      } else if (res.status === "pending_approval") {
        // Device pending approval
        message.warning({
          content: "Please wait for admin approval.",
          duration: 10,
        });
      } else if (res.status === "access_denied") {
        // Device access denied
        message.error({
          content: "This device was denied access. Contact admin.",
          duration: 10,
        });
      } else if (res.status === "device_id_mismatch") {
        // Device ID mismatch
        message.error({
          content: "Device ID not matched. You can only login from the approved device.",
          duration: 10,
        });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Spin spinning={loading} description="Signing in...">
        <div className="w-full max-w-5xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block p-12">
              <div className="space-y-8">
                {/* Logo */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                    <span className="text-5xl">📱</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                {/* Title */}
                <div>
                  <Title level={2} className="!text-white !mb-3 !text-5xl !font-bold !leading-tight">
                    Dispatch Management System
                  </Title>
                  <Text className="text-gray-300 text-lg block leading-relaxed">
                    Manage your dispatch operations efficiently with our modern platform. Real-time tracking, analytics, and seamless integration.
                  </Text>
                </div>

                {/* Features */}
                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div>
                      <Text className="text-white font-bold text-lg block mb-1">Fast & Secure</Text>
                      <Text className="text-gray-400">Bank-level security with end-to-end encryption</Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <Text className="text-white font-bold text-lg block mb-1">Analytics</Text>
                      <Text className="text-gray-400">Real-time insights and comprehensive reporting</Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <Text className="text-white font-bold text-lg block mb-1">Lightning Fast</Text>
                      <Text className="text-gray-400">Optimized performance for seamless experience</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-gray-800/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl rounded-none lg:rounded-l-2xl">
                
                {/* Mobile Logo */}
                <div className="lg:hidden mb-6 text-center">
                  <div className="inline-block relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl">
                      <span className="text-3xl">📱</span>
                    </div>
                  </div>
                  <Title level={3} className="!text-white !mt-3 !text-xl lg:!hidden">
                    Dispatch Management
                  </Title>
                </div>

                {/* Header */}
                <div className="mb-6">
                  <Title level={2} className="!mb-2 !text-2xl !font-bold text-white">
                    Welcome Back
                  </Title>
                  <Text className="text-gray-300 text-sm">
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
                    label={<span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 12 }}>Email Address</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Please enter a valid email" }
                    ]}
                  >
                    <Input
                      size="middle"
                      type="email"
                      placeholder="your@email.com"
                      prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
                      style={{ 
                        borderRadius: 8, 
                        backgroundColor: "#374151", 
                        borderColor: "#4b5563",
                        color: "#ffffff"
                      }}
                      disabled={loading}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 12 }}>Password</span>}
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" }
                    ]}
                  >
                    <Input.Password
                      size="middle"
                      placeholder="••••••••"
                      prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
                      style={{ 
                        borderRadius: 8, 
                        backgroundColor: "#374151", 
                        borderColor: "#4b5563",
                        color: "#ffffff"
                      }}
                      disabled={loading}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <div className="flex items-center justify-between py-1">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="text-gray-300"
                      >
                        <span className="text-xs">Remember me</span>
                      </Checkbox>
                    </Form.Item>
                  </div>

                  {/* Device ID Status - Only show if needed */}
                  {!deviceGenerated && (
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <LoadingOutlined className="text-blue-400" />
                      <span>Generating device ID...</span>
                    </div>
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="middle"
                    block
                    loading={loading}
                    className="!h-10 !rounded-lg !bg-gradient-to-r !from-blue-600 !to-cyan-500 hover:!from-blue-700 hover:!to-cyan-600 !font-semibold !text-sm !shadow-lg hover:!shadow-xl !transition-all"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-center text-xs text-gray-400">
                    Contact your administrator for account access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Force white text in all inputs */
        .ant-input,
        .ant-input-password input,
        .ant-input-affix-wrapper input {
          color: #ffffff !important;
        }
        
        .ant-input::placeholder,
        .ant-input-password input::placeholder,
        .ant-input-affix-wrapper input::placeholder {
          color: #9ca3af !important;
        }
        
        /* Override Ant Design input styles */
        .ant-input {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        
        .ant-input-affix-wrapper {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        
        .ant-input-affix-wrapper input {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
}