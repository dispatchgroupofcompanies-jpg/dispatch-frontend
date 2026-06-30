"use client";

import { Form, Modal, Button, message } from "antd";
import { useMemo, useEffect, useState } from "react";
import dayjs from "dayjs";

import InvoiceDetails from "./InvoiceDetails";
import PayeeDetails from "./PayeeDetails";
import PayToDetails from "./PayToDetails";
import TripSection from "./TripSection";
import SummaryCard from "./SummaryCard";
import { createInvoice, updateInvoice } from "./route";

export default function CreateInvoiceModal({ open, onClose, editData }: { open: boolean; onClose: () => void; editData?: any }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
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
          trips: (editData.trips || []).map((trip: any) => ({
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

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const hstRate = 13;
      const calculatedSubtotal = invoiceSubtotal;
      const hstAmount = (calculatedSubtotal * hstRate) / 100;
      const grandTotal = calculatedSubtotal + hstAmount;

      const formattedTrips = (values.trips || []).map((trip: any) => {
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
        message.error((error as any)?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: window.innerWidth < 640 ? "13px" : "15px", fontWeight: 700 }}>{isEditMode ? "✏️ Edit Invoice Master Log" : "➕ Generate New Bill Statement"}</span>}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={window.innerWidth < 640 ? "98%" : window.innerWidth < 768 ? "95%" : 1300}
      style={{ top: window.innerWidth < 640 ? 0 : 20 }}
      styles={{ body: { padding: { xs: "4px 8px", sm: "6px 12px", md: "8px 16px" }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || "8px 16px" } }}
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
        <div style={{ 
          background: "#f8fafc", 
          padding: { xs: "6px 8px", sm: "8px 12px", md: "10px 14px" }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || "10px 14px", 
          borderRadius: 6, 
          border: "1px solid #e2e8f0", 
          marginBottom: { xs: 6, sm: 8, md: 10 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || 10 
        }}>
          <h3 style={{ 
            fontSize: { xs: 11, sm: 12, md: 13 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || 13, 
            fontWeight: 700, 
            margin: "0 0 8px 0", 
            color: "#1e3a8a" 
          }}>
            📋 Trips — Mode: <span style={{ textTransform: "uppercase", color: "#2563eb" }}>{invoiceType}</span>
          </h3>
          <TripSection form={form} allowMultiple={invoiceType === "multiple" || invoiceType === "Multiple"} />
        </div>
        
        <SummaryCard subtotal={invoiceSubtotal}  />

        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: { xs: 6, sm: 8, md: 8 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || 8, 
          marginTop: { xs: 10, sm: 12, md: 16 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || 16, 
          paddingBottom: { xs: 6, sm: 8, md: 10 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'] || 10 
        }}>
          <Button size={window.innerWidth < 640 ? "small" : "middle"} onClick={() => { form.resetFields(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            size={window.innerWidth < 640 ? "small" : "middle"} 
            type="primary" 
            htmlType="submit" 
            style={{ fontWeight: 600 }} 
            loading={submitting}
          >
            {submitting ? (isEditMode ? "Saving..." : "Sending...") : (isEditMode ? "Save Changes" : "Compile & Send")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}