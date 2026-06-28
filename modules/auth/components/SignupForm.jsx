"use client";

import { Form, Input, Button, message, Spin, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "../route";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function SignupForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const res = await signup(values);

      if (res.success || res.userId) {
        message.success("Account created successfully! Redirecting to login...");
        form.resetFields();
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        message.error(res.message || "Signup failed!");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <Spin spinning={loading} description="Creating your account...">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center overflow-hidden rounded-2xl shadow-2xl">
            
            {/* Left Side - Branding */}
            <div className="order-2 lg:order-1 hidden lg:block">
              <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-12 h-full flex flex-col justify-center min-h-screen">
                <div className="space-y-6">
                  <div className="text-6xl font-bold text-white">🚀</div>
                  <Title level={3} className="!text-white !mb-4 !text-4xl">
                    Get Started Today
                  </Title>
                  <Text className="text-green-50 text-lg block">
                    Join thousands of users managing their dispatch operations with ease and efficiency.
                  </Text>
                  
                  <div className="pt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <Text className="text-white font-semibold block">Easy Setup</Text>
                        <Text className="text-green-100">Get started in minutes</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <Text className="text-white font-semibold block">Secure</Text>
                        <Text className="text-green-100">Your data is protected</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">👥</span>
                      <div>
                        <Text className="text-white font-semibold block">Support</Text>
                        <Text className="text-green-100">24/7 customer support</Text>
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
                    Create Account
                  </Title>
                  <Text type="secondary" className="block text-center lg:text-left text-base">
                    Join us and start managing your operations
                  </Text>
                </div>

                {/* Form */}
                <Form 
                  form={form} 
                  layout="vertical" 
                  onFinish={handleFinish}
                  requiredMark="optional"
                  scrollToFirstError
                  className="space-y-4"
                >

                  <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300 font-semibold">Full Name</span>}
                    name="name"
                    rules={[
                      { required: true, message: "Name is required" },
                      { min: 2, message: "Name must be at least 2 characters" },
                      { max: 50, message: "Name cannot exceed 50 characters" }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="John Doe"
                      prefix={<UserOutlined className="text-gray-400" />}
                      className="!rounded-lg"
                      disabled={loading}
                    />
                  </Form.Item>

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
                      placeholder="you@example.com"
                      prefix={<MailOutlined className="text-gray-400" />}
                      className="!rounded-lg"
                      disabled={loading}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300 font-semibold">Password</span>}
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" },
                      { min: 6, message: "Password must be at least 6 characters" }
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

                  <Form.Item
                    label={<span className="text-gray-700 dark:text-gray-300 font-semibold">Confirm Password</span>}
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: "Please confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
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

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    className="!h-12 !rounded-lg !bg-gradient-to-r !from-green-600 !to-emerald-500 hover:!from-green-700 hover:!to-emerald-600 !font-semibold !text-base mt-6"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700"
                    >
                      Sign in
                    </Link>
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