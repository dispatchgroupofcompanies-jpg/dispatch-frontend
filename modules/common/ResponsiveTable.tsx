"use client";

import { Table, Card } from "antd";
import type { TableProps } from "antd";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";

interface ResponsiveTableProps<T> {
  cardTitle?: React.ReactNode;
  cardProps?: {
    style?: React.CSSProperties;
    borderRadius?: string;
    boxShadow?: string;
  };
  tableContainerStyle?: React.CSSProperties;
  enableHorizontalScroll?: boolean;
  minScrollWidth?: number;
  dataSource: T[];
  columns: TableProps<T>["columns"];
  pagination?: TableProps<T>["pagination"];
  size?: "small" | "middle" | "large";
  scroll?: { x?: number | string; y?: number | string };
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
}

export default function ResponsiveTable<T extends object>({
  cardTitle,
  cardProps,
  tableContainerStyle,
  enableHorizontalScroll = true,
  minScrollWidth = 800,
  dataSource,
  columns,
  pagination,
  size,
  scroll,
  rowKey,
  loading,
}: ResponsiveTableProps<T>) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const tableSize = size || (isMobile ? "small" : "middle");
  const scrollWidth = minScrollWidth;

  const mergedPagination: Exclude<TableProps<T>["pagination"], false | undefined> = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
    size: isMobile ? "small" : "middle",
    ...(pagination || {}),
  };

  const mergedScroll = {
    x: scrollWidth,
    ...scroll,
  };

  const tableElement = (
    <div
      style={{
        width: "100%",
        overflowX: enableHorizontalScroll ? "auto" : "hidden",
        ...tableContainerStyle,
      }}
    >
      <Table<T>
        dataSource={dataSource}
        columns={columns}
        pagination={pagination === false ? false : mergedPagination}
        size={tableSize}
        scroll={mergedScroll}
        bordered={false}
        rowKey={rowKey || "_id"}
        loading={loading}
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );

  if (cardTitle) {
    return (
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#1e3a8a",
            }}
          >
            {cardTitle}
          </div>
        }
        style={{
          borderRadius: cardProps?.borderRadius || "12px",
          boxShadow: cardProps?.boxShadow || "0 2px 8px rgba(0,0,0,0.08)",
          ...cardProps?.style,
        }}
      >
        {tableElement}
      </Card>
    );
  }

  return tableElement;
}
