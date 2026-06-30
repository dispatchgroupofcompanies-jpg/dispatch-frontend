"use client";

import { Form, Modal, Button, message } from "antd";
import { useMemo, useEffect } from "react";
import dayjs from "dayjs";

import InvoiceDetails from "./InvoiceDetails";
import PayeeDetails from "./PayeeDetails";
import PayToDetails from "./PayToDetails";
import TripSection from "./TripSection";
import SummaryCard from "./SummaryCard";
import { createInvoice, updateInvoice } from "./route";

export default function CreateInvoiceModal({ open, onClose, editData }) {
  const [form] = Form.useForm();
  
  const trips = Form.useWatch("trips", form);
  const invoiceType = Form.useWatch("invoiceType", form);
  const isEditMode = !!editData;

  useEffect(() => {
    if (open) {
      if (editData) {
        const formattedEditData = {
          ...editData,
          invoicePeriod: editData.invoicePeriod?.startDate ? [
            dayjs(editData.invoicePeriod.startDate),
            dayjs(editData.invoicePeriod.endDate)
          ] : null,
          trips: (editData.trips || []).map((trip) => ({
            ...trip,
            tripDate: trip.tripDate ? dayjs(trip.tripDate) : null,
          })),
        };
        form.setFieldsValue(formattedEditData);
      } else {
        form.resetFields();
      }
    }
  }, [open, editData, form]);

  const invoiceSubtotal = useMemo(() => {
    if (!trips || !Array.isArray(trips)) return 0;
    return trips.reduce((total, trip) => total + Number(trip?.totalCharges || 0), 0);
  }, [trips]);

  const handleSubmit = async (values) => {
    try {
      const hstRate = 13;
      const calculatedSubtotal = invoiceSubtotal;
      const hstAmount = (calculatedSubtotal * hstRate) / 100;
      const grandTotal = calculatedSubtotal + hstAmount;

      const formattedTrips = (values.trips || []).map((trip) => {
        const tCharges = Number(trip?.totalCharges || 0);
        const dPercent = Number(trip?.dispatchPercent || 0);
        return {
          ...trip,
          dispatchPercent: dPercent,
          totalCharges: tCharges,
          dispatchAmount: (tCharges * dPercent) / 100,
        };
      });

      let invoicePeriod = null;
      if (values.invoicePeriod && Array.isArray(values.invoicePeriod)) {
        invoicePeriod = [
          values.invoicePeriod[0].toISOString(),
          values.invoicePeriod[1].toISOString()
        ];
      }

      const finalPayload = {
        ...values,
        invoicePeriod,
        trips: formattedTrips,
        subtotal: calculatedSubtotal,
        tax: hstAmount,
        grandTotal: grandTotal,
      };

      if (isEditMode) {
        await updateInvoice(editData._id, finalPayload);
        message.success("Invoice Updated Successfully");
      } else {
        await createInvoice(finalPayload);
        message.success("Invoice Dispatched Successfully");
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: "15px", fontWeight: 700 }}>{isEditMode ? "✏️ Edit Invoice Master Log" : "➕ Generate New Bill Statement"}</span>}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={1300}
      style={{ top: 20 }}
      styles={{ body: { padding: "8px 16px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        size="small"
        onFinish={handleSubmit}
        requiredMark={false}
        initialValues={{
          invoiceType: "single",
          currency: "CAD",
          trips: [{ dispatchPercent: 10, totalCharges: 0 }],
        }}
      >
        <InvoiceDetails />
        <PayeeDetails />
        <PayToDetails />
        
        {/* Dynamic Trips Container */}
        <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 6, border: "1px solid #e2e8f0", marginBottom: 10 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", color: "#1e3a8a" }}>
            📋 Trips Segment Entry — Mode: <span style={{ textTransform: "uppercase", color: "#2563eb" }}>{invoiceType}</span>
          </h3>
          <TripSection form={form} allowMultiple={invoiceType === "multiple" || invoiceType === "Multiple"} />
        </div>
        
        <SummaryCard subtotal={invoiceSubtotal}  />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16, paddingBottom: 10 }}>
          <Button size="middle" onClick={() => { form.resetFields(); onClose(); }}>
            Cancel
          </Button>
          <Button size="middle" type="primary" htmlType="submit" style={{ fontWeight: 600 }}>
            {isEditMode ? "Save Changes" : "Compile & Email Broadcast"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}