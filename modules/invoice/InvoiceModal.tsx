"use client";

import { Form, Modal, Button, message, Row, Col } from "antd";
import { useMemo, useEffect, useState } from "react";
import dayjs from "dayjs";

import InvoiceDetails from "./InvoiceDetails";
import PayeeDetails from "./PayeeDetails";
import PayToDetails from "./PayToDetails";
import TripSection from "./TripSection";
import SummaryCard from "./SummaryCard";
import { createInvoice, updateInvoice } from "./route";
import { getCompanyProfile } from "../../modules/company/route";
import type { CompanyProfile } from "../../src/types/company";
import type { InvoiceFormValues, TripForm } from "../../src/types/invoiceForm";
import type { Invoice } from "../../src/types/invoice";

export default function CreateInvoiceModal({
  open,
  onClose,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  editData?: Invoice | (InvoiceFormValues & { _id?: string });
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);

  const trips = Form.useWatch("trips", form);
  const invoiceType = Form.useWatch("invoiceType", form);
  const isEditMode = !!editData;

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const fetchCompaniesList = async () => {
      try {
        const res = await getCompanyProfile();
        console.log("Fetched Companies List:", res);
        if (isMounted && res && res.success && res.data) {
          const data = Array.isArray(res.data)
            ? (res.data as CompanyProfile[])
            : [res.data as CompanyProfile];
          setCompanies(data);
        }
      } catch (err) {
        console.error("Error loading profile dataset:", err);
      }
    };

    fetchCompaniesList();

    return () => {
      isMounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (open && editData) {
      const period = editData.invoicePeriod;

      // Explicitly check that period is an object containing 'startDate' and not an array
      const hasObjectDates =
        period &&
        !Array.isArray(period) &&
        typeof period === "object" &&
        "startDate" in period;

      const formattedEditData = {
        ...editData,
        invoicePeriod: hasObjectDates
          ? [
              dayjs((period as { startDate: string }).startDate),
              dayjs((period as { endDate: string }).endDate),
            ]
          : null,
        trips: (editData.trips || []).map((trip: TripForm) => ({
          ...trip,
          tripDate: trip.tripDate ? dayjs(trip.tripDate) : null,
        })),
      };
      form.setFieldsValue(formattedEditData);
    } else if (open && !editData) {
      form.resetFields();
    }
  }, [open, editData, form]);

  const invoiceSubtotal = useMemo(() => {
    if (!trips || !Array.isArray(trips)) return 0;
    return trips.reduce(
      (total: number, trip: TripForm) =>
        total + Number(trip?.totalCharges || 0),
      0,
    );
  }, [trips]);

  const handleSubmit = async (values: InvoiceFormValues) => {
    try {
      setSubmitting(true);
      const hstRate = 13;
      const calculatedSubtotal = invoiceSubtotal;
      const hstAmount = (calculatedSubtotal * hstRate) / 100;
      const grandTotal = calculatedSubtotal + hstAmount;

      // Debug: Log form values to see if customer data is present
      console.log(
        "📤 FORM VALUES BEING SUBMITTED:",
        JSON.stringify(values, null, 2),
      );
      console.log(
        "📤 CUSTOMER DATA:",
        JSON.stringify(values.customer, null, 2),
      );

      const formattedTrips = (values.trips || []).map((trip: TripForm) => {
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
          values.invoicePeriod[1].toISOString(),
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

      // TypeScript Fixed Condition block below
      if (isEditMode && editData?._id) {
        await updateInvoice(editData._id, finalPayload);
        message.success("Invoice Updated Successfully");
      } else if (!isEditMode) {
        await createInvoice(finalPayload);
        message.success("Invoice Dispatched Successfully");
      } else {
        throw new Error(
          "Unable to update: Unique document identification ID is missing.",
        );
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error(
        (error as unknown as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Operation failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            paddingBottom: "4px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
            {isEditMode
              ? "✏️ Edit Invoice Master Log"
              : "➕ Generate New Bill Statement"}
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={1200}
      style={{ top: 15 }}
      styles={{
        body: { padding: "0px 8px 8px 8px" },
      }}
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
          trips: [
            {
              dispatchPercent: 10,
              totalCharges: 0,
              loadId1: "",
              loadId2: "",
              driverName: "",
            },
          ],
        }}
      >
        {/* Top Metadata */}
        <div
          style={{
            background: "#ffffff",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            marginBottom: 8,
          }}
        >
          <InvoiceDetails />
        </div>

        <Row gutter={[12, 12]} style={{ marginBottom: 8 }}>
          <Col
            xs={24}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <PayeeDetails formInstance={form} companiesList={companies} />
          </Col>

          <Col
            xs={24}
            md={12}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <PayToDetails formInstance={form} companiesList={companies} />
          </Col>
        </Row>

        <div
          style={{
            background: "#f8fafc",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              margin: "0 0 6px 0",
              color: "#1e3a8a",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            📋 Trips Ledger &mdash; Mode:
            <span
              style={{
                textTransform: "uppercase",
                color: "#2563eb",
                background: "#dbeafe",
                padding: "1px 6px",
                borderRadius: 3,
                fontSize: 10,
              }}
            >
              {invoiceType || "single"}
            </span>
          </h3>
          <TripSection
            form={form}
            allowMultiple={
              invoiceType === "multiple" || invoiceType === "Multiple"
            }
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <SummaryCard subtotal={invoiceSubtotal} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 6,
            marginTop: 10,
          }}
        >
          <Button
            size="small"
            style={{ borderRadius: 4, fontWeight: 500, minWidth: 80 }}
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="small"
            loading={submitting}
            style={{
              fontWeight: 600,
              borderRadius: 4,
              minWidth: 120,
              background: "#2563eb",
            }}
          >
            {submitting
              ? isEditMode
                ? "Saving..."
                : "Sending..."
              : isEditMode
                ? "Update"
                : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
