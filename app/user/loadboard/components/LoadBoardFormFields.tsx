"use client";

import { Form, Input, InputNumber, Checkbox, Row, Col } from "antd";
import type { Dayjs } from "dayjs";
import type { LoadBoardRecord } from "../types";

interface FormFieldsProps {
  form: any;
  isMobile: boolean;
  currentVrid: string;
  record: LoadBoardRecord | null;
}

export default function LoadBoardFormFields({
  form,
  isMobile,
  currentVrid,
  record,
}: FormFieldsProps) {
  return (
    <Row gutter={[isMobile ? 12 : 16, isMobile ? 8 : 12]}>
      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Carrier Name <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="carrierName"
          rules={[{ required: true, message: "Please enter carrier name" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter carrier name"
            size={isMobile ? "large" : "middle"}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              3P Carrier Name <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="thirdPartyCarrierName"
          rules={[{ required: true, message: "Please enter 3P carrier name" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter 3P carrier name"
            size={isMobile ? "large" : "middle"}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Date <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="date"
          rules={[{ required: true, message: "Please select date" }]}
          style={{ marginBottom: 0 }}
        >
          <Input type="date" size={isMobile ? "large" : "middle"} />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              MG Charges
            </span>
          }
          name="mgCharges"
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            placeholder="0.00"
            min={0}
            precision={2}
            style={{ width: "100%" }}
            size={isMobile ? "large" : "middle"}
            prefix="$"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              VRID <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="vrid"
          rules={[{ required: true, message: "Please enter VRID" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter VRID (starts with T = 2 loads)"
            size={isMobile ? "large" : "middle"}
          />
        </Form.Item>
      </Col>

      {currentVrid?.toLowerCase().startsWith("t") && (
        <>
          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: 13,
                  }}
                >
                  Load 1 ID <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="load1Id"
              rules={[{ required: true, message: "Please enter Load 1 ID" }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter Load 1 ID"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: 13,
                  }}
                >
                  Load 2 ID <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="load2Id"
              rules={[{ required: true, message: "Please enter Load 2 ID" }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter Load 2 ID"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>
        </>
      )}

      {!currentVrid?.toLowerCase().startsWith("t") && (
        <Col xs={24} md={8}>
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
                Load 1 ID <span style={{ color: "#ef4444" }}>*</span>
              </span>
            }
            name="load1Id"
            rules={[{ required: true, message: "Please enter Load 1 ID" }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Enter Load 1 ID"
              size={isMobile ? "large" : "middle"}
            />
          </Form.Item>
        </Col>
      )}

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Trip Charges <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="tripCharges"
          rules={[{ required: true, message: "Please enter trip charges" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            placeholder="0.00"
            min={0}
            precision={2}
            style={{ width: "100%" }}
            size={isMobile ? "large" : "middle"}
            prefix="$"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Dispatcher <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="dispatcher"
          rules={[{ required: true, message: "Please enter dispatcher name" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter dispatcher name"
            size={isMobile ? "large" : "middle"}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Driver Name <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="driverName"
          rules={[{ required: true, message: "Please enter driver name" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter driver name"
            size={isMobile ? "large" : "middle"}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              Dispatch Charges <span style={{ color: "#ef4444" }}>*</span>
            </span>
          }
          name="dispatchCharges"
          rules={[{ required: true, message: "Please enter dispatch charges" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            placeholder="0.00"
            min={0}
            precision={2}
            style={{ width: "100%" }}
            size={isMobile ? "large" : "middle"}
            prefix="$"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
              TONU
            </span>
          }
          name="tonu"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Checkbox>TONU (Truck Ordered Not Used)</Checkbox>
        </Form.Item>
      </Col>
    </Row>
  );
}
