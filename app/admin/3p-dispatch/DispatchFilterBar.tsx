"use client";

import React, { useMemo, useEffect } from "react";
import { Input, Select, Space, Typography, Grid, Button } from "antd";
import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { generateRelayWeeklyRanges } from "@/utils/dateRanges";

const { Title } = Typography;
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

    const weekRanges = useMemo(() => {
      return generateRelayWeeklyRanges("2026-07-19");
    }, []);

    const weekOptions = useMemo(() => {
      const allOption = weekRanges.find((r) => r.value === "all");
      const weekly = weekRanges.filter((r) => r.value !== "all").reverse();
      return allOption ? [allOption, ...weekly] : weekly;
    }, [weekRanges]);

    useEffect(() => {
      if (!selectedWeekRange && weekRanges.length > 0) {
        const defaultIndex =
          weekRanges.length > 1 ? weekRanges.length - 1 : 0;
        onWeekFilterChange(weekRanges[defaultIndex].value);
      }
    }, [selectedWeekRange, weekRanges, onWeekFilterChange]);

    const activeIndex = useMemo(() => {
      if (!selectedWeekRange) return -1;
      return weekRanges.findIndex((r) => r.value === selectedWeekRange);
    }, [weekRanges, selectedWeekRange]);

    const handlePreviousWeek = () => {
      if (activeIndex > 1) {
        onWeekFilterChange(weekRanges[activeIndex - 1].value);
      }
    };

    const handleNextWeek = () => {
      if (activeIndex >= 1 && activeIndex < weekRanges.length - 1) {
        onWeekFilterChange(weekRanges[activeIndex + 1].value);
      }
    };

    const isAllSelected = selectedWeekRange === "all";
    const isPrevDisabled = isAllSelected || activeIndex <= 1;
    const isNextDisabled =
      isAllSelected || activeIndex === -1 || activeIndex >= weekRanges.length - 1;

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
        </div>

        <Space direction={isMobile ? "vertical" : "horizontal"} size={12}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePreviousWeek}
              disabled={isPrevDisabled}
              style={{ borderColor: "#a7f3d0", color: "#047857" }}
            />

            <Select
              placeholder="Select Settlement Week"
              value={selectedWeekRange}
              onChange={onWeekFilterChange}
              style={{ width: isMobile ? "100%" : 260 }}
              options={weekOptions.map((w) => ({ label: w.label, value: w.value }))}
              suffixIcon={<CalendarOutlined style={{ color: "#10b981" }} />}
            />

            <Button
              icon={<RightOutlined />}
              onClick={handleNextWeek}
              disabled={isNextDisabled}
              style={{ borderColor: "#a7f3d0", color: "#047857" }}
            />
          </div>

          <Select
            placeholder="Filter by Status"
            allowClear
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: isMobile ? "100%" : 150 }}
            options={FILTER_STATUS_OPTIONS}
          />

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