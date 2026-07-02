"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Card,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Tag,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Appointment {
  _id: string;
  companyId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  state: string;
  postCode: string;
  country: string;
  nsc: string;
  ifta: string;
  gstHst: string;
  qst: string;
  eTransfer: string;
  companyLogo?: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
  status: string;
  createdAt: string;
}

const serviceTypeOptions = [
  { value: "Logistics Consultation", label: "Logistics Consultation" },
  { value: "Freight Quote", label: "Freight Quote" },
  { value: "Pickup Scheduling", label: "Pickup Scheduling" },
  { value: "Delivery Tracking", label: "Delivery Tracking" },
  { value: "Account Setup", label: "Account Setup" },
  { value: "Other", label: "Other" },
];

const timeSlotOptions = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
];

interface Company {
  _id: string;
  companyName: string;
  carrierIdentifier: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postCode: string;
  country: string;
  nsc: string;
  ifta: string;
  gstHst: string;
  qst: string;
  eTransfer: string;
  companyLogo?: string;
}

function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await API.get("/company/company-profile");
      console.log("Companies API Response:", res.data);
      if (res.data?.success && res.data?.data) {
        // Company profile returns single object, convert to array
        const profile = res.data.data;
        const data =
          profile && Object.keys(profile).length > 0 ? [profile] : [];
        setCompanies(data);
        console.log("Companies loaded:", data);
      } else {
        console.log("No companies found in response");
        setCompanies([]);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Handle company selection
  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c._id === companyId);
    if (company) {
      form.setFieldsValue({
        companyId: company._id,
        companyName: company.companyName,
        contactPerson: company.carrierIdentifier,
        email: company.email,
        phone: company.phone,
        province: company.province,
        nsc: company.nsc,
        ifta: company.ifta,
        gstHst: company.gstHst,
        qst: company.qst,
        eTransfer: company.eTransfer,
        companyLogo: company.companyLogo,
        addressLine1: company.addressLine1,
        addressLine2: company.addressLine2,
        city: company.city,
        state: company.province,
        postCode: company.postCode,
        country: company.country,
      });
    }
  };

  // Handle company clear
  const handleCompanyClear = () => {
    form.setFieldsValue({
      companyId: undefined,
      companyName: undefined,
      contactPerson: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
      gstHst: undefined,
    });
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/appointments");
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchCompanies();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const payload = {
        ...values,
        appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
      };

      const res = await API.post("/appointments", payload);

      if (res.data?.success) {
        message.success("Appointment booked successfully!");
        form.resetFields();
        setOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status });
      message.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/appointments/${id}`);
      message.success("Appointment deleted successfully");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete appointment");
    }
  };

  // Download appointment PDF
  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await API.get(`/appointments/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `appointment-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to download PDF");
    }
  };

  // View appointment details
  const openView = (record: Appointment) => {
    setSelectedAppointment(record);
    setViewOpen(true);
  };

  // Open edit modal
  const openEdit = (record: Appointment) => {
    setEditingId(record._id);
    editForm.setFieldsValue({
      appointmentDate: record.appointmentDate
        ? dayjs(record.appointmentDate)
        : null,
    });
    setEditOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        appointmentDate: values.appointmentDate
          ? values.appointmentDate.format("YYYY-MM-DD")
          : null,
      };

      await API.put(`/appointments/${editingId}`, payload);
      message.success("Appointment updated successfully!");
      setEditOpen(false);
      setEditingId(null);
      editForm.resetFields();
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to update appointment");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: "#1e3a8a" }}>{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text: string) => (
        <span style={{ color: "#64748b" }}>{text}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 180,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 150,
      render: (date: string) => (
        <span style={{ color: "#475569" }}>
          {date
            ? new Date(date).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: "default",
          confirmed: "processing",
          completed: "success",
          cancelled: "error",
        };
        return (
          <Tag color={colorMap[status] || "default"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      render: (_: unknown, record: Appointment) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openView(record)}
          >
            View
          </Button>

          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Card
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
        }}
        title={
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              width: "100%",
              gap: isMobile ? "12px" : "0",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Appointment Management
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Book and manage customer appointments
              </p>
            </div>
            <Button
              type="primary"
              size={isMobile ? "middle" : "large"}
              icon={<PlusOutlined />}
              style={{ borderRadius: "8px", fontWeight: 600 }}
              onClick={() => setOpen(true)}
            >
              Book Appointment
            </Button>
          </div>
        }
      >
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            position: "relative",
          }}
        >
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey={(record) => record._id}
            loading={loading}
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              size: isMobile ? "small" : "middle",
            }}
            size="middle"
            scroll={{ x: isMobile ? 1200 : undefined }}
            bordered={false}
          />
        </div>
      </Card>

      {/* Book Appointment Modal */}
      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            📅 Book New Appointment
          </div>
        }
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: "20px" }}
        >
          {/* Company Selection */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="companyId"
                label="Select Company"
                rules={[{ required: true, message: "Please select a company" }]}
              >
                <Select
                  placeholder="Choose company for appointment..."
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  onChange={handleCompanySelect}
                  onClear={handleCompanyClear}
                  allowClear
                  options={companies.map((company) => ({
                    value: company._id,
                    label: company.companyName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Company Details (Auto-filled but Editable) */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1e3a8a",
                margin: "0 0 12px 0",
              }}
            >
              Company Details
            </h4>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Company Name
                  </div>
                  <Form.Item name="companyName" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Carrier Identifier
                  </div>
                  <Form.Item name="contactPerson" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Official Email
                  </div>
                  <Form.Item name="email" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Phone Contact
                  </div>
                  <Form.Item name="phone" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Province/Territory
                  </div>
                  <Form.Item name="province" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    NSC Number
                  </div>
                  <Form.Item name="nsc" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    IFTA
                  </div>
                  <Form.Item name="ifta" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    GST/HST
                  </div>
                  <Form.Item name="gstHst" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    QST (Optional)
                  </div>
                  <Form.Item name="qst" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#2563eb",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    💥 E-Transfer Email
                  </div>
                  <Form.Item name="eTransfer" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Address Line 1
                  </div>
                  <Form.Item name="addressLine1" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Address Line 2 (Optional)
                  </div>
                  <Form.Item name="addressLine2" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    City
                  </div>
                  <Form.Item name="city" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    State/Province
                  </div>
                  <Form.Item name="state" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Postal/ZIP Code
                  </div>
                  <Form.Item name="postCode" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Country
                  </div>
                  <Form.Item name="country" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>

          {/* Appointment Details */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[
                  { required: true, message: "Please select service type" },
                ]}
              >
                <Select
                  placeholder="Select service"
                  size="large"
                  options={serviceTypeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="appointmentDate"
                label="Appointment Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointmentTime"
                label="Appointment Time"
                rules={[{ required: true, message: "Please select time" }]}
              >
                <Select
                  placeholder="Select time"
                  size="large"
                  options={timeSlotOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Notes - Last Field */}
          <Form.Item name="notes" label="Notes">
            <Input.TextArea
              rows={3}
              placeholder="Any additional notes or special requirements..."
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <Button
              size="large"
              onClick={() => {
                form.resetFields();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              style={{
                background: "#2563eb",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              Book Appointment
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Appointment Modal */}
      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            Appointment Details
          </div>
        }
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={
          <Button
            size="large"
            onClick={() => setViewOpen(false)}
            style={{ borderRadius: "6px" }}
          >
            Close
          </Button>
        }
        width={600}
      >
        {selectedAppointment && (
          <div style={{ padding: "20px 0" }}>
            {/* Circular Logo Display */}
            {selectedAppointment.companyLogo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "3px solid #1e3a8a",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <img
                    src={selectedAppointment.companyLogo}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Download PDF Button */}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="large"
                onClick={() => handleDownloadPDF(selectedAppointment._id)}
                style={{
                  background: "#2563eb",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                Download Appointment PDF
              </Button>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Company Name
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e3a8a",
                    }}
                  >
                    {selectedAppointment.companyName}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Email
                  </div>
                  <div style={{ fontSize: "14px", color: "#334155" }}>
                    {selectedAppointment.email}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Phone
                  </div>
                  <div style={{ fontSize: "14px", color: "#334155" }}>
                    {selectedAppointment.phone}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Service Type
                  </div>
                  <Tag color="blue">{selectedAppointment.serviceType}</Tag>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Appointment Date
                  </div>
                  <div style={{ fontSize: "14px", color: "#334155" }}>
                    {new Date(
                      selectedAppointment.appointmentDate,
                    ).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Time
                  </div>
                  <div style={{ fontSize: "14px", color: "#334155" }}>
                    {selectedAppointment.appointmentTime}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Status
                  </div>
                  <Tag
                    color={
                      selectedAppointment.status === "confirmed"
                        ? "success"
                        : selectedAppointment.status === "cancelled"
                          ? "error"
                          : selectedAppointment.status === "completed"
                            ? "success"
                            : "warning"
                    }
                  >
                    {selectedAppointment.status.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              {selectedAppointment.notes && (
                <Col span={24}>
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Notes
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#334155",
                        padding: "8px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "4px",
                      }}
                    >
                      {selectedAppointment.notes}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            ✏️ Edit Appointment
          </div>
        }
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingId(null);
          editForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={false}
          style={{ marginTop: "20px" }}
        >
          {/* Company Details */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1e3a8a",
                margin: "0 0 12px 0",
              }}
            >
              Company Details
            </h4>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Company Name
                  </div>
                  <Form.Item name="companyName" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Carrier Identifier
                  </div>
                  <Form.Item name="contactPerson" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Official Email
                  </div>
                  <Form.Item name="email" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Phone Contact
                  </div>
                  <Form.Item name="phone" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Province/Territory
                  </div>
                  <Form.Item name="province" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    NSC Number
                  </div>
                  <Form.Item name="nsc" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    IFTA
                  </div>
                  <Form.Item name="ifta" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    GST/HST
                  </div>
                  <Form.Item name="gstHst" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    QST (Optional)
                  </div>
                  <Form.Item name="qst" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#2563eb",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    💥 E-Transfer Email
                  </div>
                  <Form.Item name="eTransfer" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Address Line 1
                  </div>
                  <Form.Item name="addressLine1" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Address Line 2 (Optional)
                  </div>
                  <Form.Item name="addressLine2" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    City
                  </div>
                  <Form.Item name="city" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    State/Province
                  </div>
                  <Form.Item name="state" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Postal/ZIP Code
                  </div>
                  <Form.Item name="postCode" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Country
                  </div>
                  <Form.Item name="country" style={{ marginBottom: 0 }}>
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>

          {/* Appointment Details */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[
                  { required: true, message: "Please select service type" },
                ]}
              >
                <Select
                  placeholder="Select service"
                  size="large"
                  options={serviceTypeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="appointmentDate"
                label="Appointment Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointmentTime"
                label="Appointment Time"
                rules={[{ required: true, message: "Please select time" }]}
              >
                <Select
                  placeholder="Select time"
                  size="large"
                  options={timeSlotOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  placeholder="Select status"
                  size="large"
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Any additional notes..." />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <Button
              size="large"
              onClick={() => {
                setEditOpen(false);
                setEditingId(null);
                editForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                background: "#2563eb",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              Update Appointment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

import dynamic from "next/dynamic";

const AppointmentPageDynamic = dynamic(() => Promise.resolve(AppointmentPage), {
  ssr: false,
});

export default AppointmentPageDynamic;
