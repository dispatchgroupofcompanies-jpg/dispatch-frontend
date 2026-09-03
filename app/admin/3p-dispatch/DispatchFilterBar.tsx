"use client";

import React, { useMemo, useEffect } from "react";
import { Input, Select, Space, Typography, Grid, Button } from "antd";
import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import  {generateRelayWeeklyRanges}  from "../../../utils/dateRanges";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface DispatchFilterBarProps {
  searchText?: string;
  statusFilter?: string;
  selectedWeekRange?: string;
  onSearchChange?: (text: string) => void;
  onStatusFilterChange?: (status?: string) => void;
  onWeekFilterChange?: (range?: string) => void;
}

const FILTER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Generated", value: "generated" },
];

export const DispatchFilterBar: React.FC<DispatchFilterBarProps> = React.memo(
  ({
    searchText = "",
    statusFilter,
    selectedWeekRange,
    onSearchChange = () => {},
    onStatusFilterChange = () => {},
    onWeekFilterChange = () => {},
  }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.lg;

    // 1. Generate chronological week list (Index 0 = Week starting July 19)
    const weekRanges = useMemo(() => {
      return generateRelayWeeklyRanges("2026-07-19");
    }, []);

    const weekOptions = useMemo(() => {
      // Show newest week at top of dropdown
      return [...weekRanges].reverse().map((r) => ({
        label: r.label,
        value: r.value,
      }));
    }, [weekRanges]);

    // 2. Set default to 1 week before current week on mount
    useEffect(() => {
      if (!selectedWeekRange && weekRanges.length > 0) {
        const defaultIndex =
          weekRanges.length > 1 ? weekRanges.length - 2 : weekRanges.length - 1;
        onWeekFilterChange(weekRanges[defaultIndex].value);
      }
    }, [selectedWeekRange, weekRanges, onWeekFilterChange]);

    // 3. Current selection index in chronological array
    const activeIndex = useMemo(() => {
      if (!selectedWeekRange) return -1;
      return weekRanges.findIndex((r) => r.value === selectedWeekRange);
    }, [weekRanges, selectedWeekRange]);

    // 4. Strict Navigation Controls
    const handlePreviousWeek = () => {
      if (activeIndex > 0) {
        onWeekFilterChange(weekRanges[activeIndex - 1].value);
      }
    };

    const handleNextWeek = () => {
      if (activeIndex >= 0 && activeIndex < weekRanges.length - 1) {
        onWeekFilterChange(weekRanges[activeIndex + 1].value);
      }
    };

    // 5. Strict Disabling Boundaries (Prevents Looping)
    const isPrevDisabled = activeIndex <= 0;
    const isNextDisabled =
      activeIndex === -1 || activeIndex >= weekRanges.length - 1;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 12,
          padding: "16px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: "#065f46" }}>
            3P Dispatch Records
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Manage and review weekly settlement invoices
          </Text>
        </div>

        <Space direction={isMobile ? "vertical" : "horizontal"} size={12}>
          {/* Step Navigator */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePreviousWeek}
              disabled={isPrevDisabled}
              title={
                isPrevDisabled ? "Reached start week (July 19)" : "Previous Week"
              }
              style={{ borderColor: "#a7f3d0", color: "#047857" }}
            />

            <Select
              placeholder="Select Settlement Week"
              value={selectedWeekRange}
              onChange={onWeekFilterChange}
              style={{ width: isMobile ? "100%" : 260 }}
              options={weekOptions}
              suffixIcon={<CalendarOutlined style={{ color: "#10b981" }} />}
            />

            <Button
              icon={<RightOutlined />}
              onClick={handleNextWeek}
              disabled={isNextDisabled}
              title={isNextDisabled ? "Reached latest week" : "Next Week"}
              style={{ borderColor: "#a7f3d0", color: "#047857" }}
            />
          </div>

          {/* Status Filter */}
          <Select
            placeholder="Filter by Status"
            allowClear
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: isMobile ? "100%" : 150 }}
            options={FILTER_STATUS_OPTIONS}
          />

          {/* Search Input */}
          <Input
            placeholder="Search Company or Dispatcher..."
            prefix={<SearchOutlined style={{ color: "#10b981" }} />}
            allowClear
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: isMobile ? "100%" : 240,
              borderRadius: 8,
              borderColor: "#a7f3d0",
            }}
          />
        </Space>
      </div>
    );
  }
);

DispatchFilterBar.displayName = "DispatchFilterBar";