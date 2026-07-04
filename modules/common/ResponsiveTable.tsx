"use client";

import { Table, Card } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

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
  columns: any[];
  pagination?: any;
  size?: "small" | "middle" | "large";
  scroll?: { x?: number | string; y?: number | string };
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
}

export default function ResponsiveTable<T extends Record<string, unknown>>({
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
  const [isMobile, setIsMobile] = useState(false);
  const [tableSize, setTableSize] = useState<"small" | "middle" | "large">(
    size || "middle",
  );
  const [scrollWidth, setScrollWidth] = useState<number | string>(
    minScrollWidth,
  );
  const isInitialMount = useRef(true);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const mobile = width < 768;
    const tablet = width < 1024;

    setIsMobile(mobile);
    setTableSize(mobile ? "small" : "middle");

    if (enableHorizontalScroll && !scroll) {
      if (mobile) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setScrollWidth(Math.max(minScrollWidth, width * 1.5));
      } else if (tablet) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setScrollWidth(Math.max(minScrollWidth, width * 1.2));
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setScrollWidth("100%");
      }
    }
  }, [enableHorizontalScroll, minScrollWidth, scroll]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width < 1024;

      // Initial setup - these setState calls are intentional for responsive behavior
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setIsMobile(mobile);
      setTableSize(mobile ? "small" : "middle");

      if (enableHorizontalScroll && !scroll) {
        if (mobile) {
          setScrollWidth(Math.max(minScrollWidth, width * 1.5));
        } else if (tablet) {
          setScrollWidth(Math.max(minScrollWidth, width * 1.2));
        } else {
          setScrollWidth("100%");
        }
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [enableHorizontalScroll, minScrollWidth, scroll, handleResize]);

  const mergedPagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
    size: isMobile ? "small" : "default",
    ...pagination,
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
        pagination={mergedPagination}
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
