"use client";

import { useState, useEffect } from "react";
import { Select, DatePicker, Input, Button, Space, Tag, Row, Col } from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface FiltersProps {
  companies: string[];
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  setDateRange: (range: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  presetFilter: string | null;
  setPresetFilter: (preset: string | null) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  invoiceStatusFilter: string | null;
  setInvoiceStatusFilter: (status: string | null) => void;
  onClearFilters: () => void;
  isMobile: boolean;
}

export default function CompanyHistoryFilters({
  companies,
  selectedCompany,
  setSelectedCompany,
  dateRange,
  setDateRange,
  presetFilter,
  setPresetFilter,
  searchText,
  setSearchText,
  invoiceStatusFilter,
  setInvoiceStatusFilter,
  onClearFilters,
  isMobile,
}: FiltersProps) {
  const handlePresetFilter = (preset: string) => {
    setPresetFilter(preset);
    const now = dayjs();
    let startDate: dayjs.Dayjs;

    switch (preset) {
      case "week":
        startDate = now.subtract(7, "days");
        break;
      case "month":
        startDate = now.subtract(1, "month");
        break;
      case "quarter":
        startDate = now.subtract(3, "months");
        break;
      case "year":
        startDate = now.subtract(1, "year");
        break;
      default:
        startDate = now.subtract(7, "days");
    }

    setDateRange([startDate, now]);
  };

  const hasActiveFilters =
    selectedCompany ||
    dateRange ||
    presetFilter ||
    invoiceStatusFilter ||
    searchText;

  return (
    <Row
      gutter={[16, 16]}
      align="middle"
      justify="space-between"
      style={{ marginBottom: 16 }}
    >
      <Col xs={24} sm={24} md={12} lg={8}>
        <div>
          <Input
            placeholder="Search by company, VRID, or Load ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            size="large"
            allowClear
          />
        </div>
      </Col>
      <Col xs={24} sm={24} md={12} lg={16}>
        <Space style={{ width: "100%" }} size="middle" wrap>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            size="large"
            style={{ fontWeight: 600 }}
          >
            Apply Filters
          </Button>
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        </Space>
      </Col>
    </Row>
  );
}
