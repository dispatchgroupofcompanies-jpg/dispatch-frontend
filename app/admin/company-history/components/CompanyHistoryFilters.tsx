"use client";

import type { ReactNode } from "react";
import { Select, Input, Button, Row, Col } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface FiltersProps {
  companies: string[];
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  onClearFilters: () => void;
  isMobile: boolean;
  exportControl: ReactNode;
}

export default function CompanyHistoryFilters({
  companies,
  selectedCompany,
  setSelectedCompany,
  searchText,
  setSearchText,
  onClearFilters,
  isMobile,
  exportControl,
}: FiltersProps) {
  const hasActiveFilters = selectedCompany || searchText;

  return (
    <Row
      gutter={[16, 16]}
      align="middle"
      justify="space-between"
      style={{ marginBottom: 0 }}
    >
      <Col xs={24} lg={10}>
        <Input
          placeholder="Search company, VRID, or Load ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          size="large"
          allowClear
        />
      </Col>
      <Col xs={24} lg={14}>
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "stretch" : "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Select
            aria-label="Filter by company"
            placeholder="All companies"
            value={selectedCompany ?? undefined}
            onChange={(value) => setSelectedCompany(value ?? null)}
            options={companies.map((company) => ({
              value: company,
              label: company,
            }))}
            allowClear
            showSearch
            optionFilterProp="label"
            size="large"
            style={{ minWidth: isMobile ? "100%" : 230, flex: isMobile ? 1 : undefined }}
          />
          {exportControl}
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </Button>
        </div>
      </Col>
    </Row>
  );
}
