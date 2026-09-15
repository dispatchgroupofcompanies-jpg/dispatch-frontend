"use client";

import type { ReactNode } from "react";
import { ConfigProvider } from "antd";
import LoadingMark from "./LoadingMark";

export default function LoadingProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider
    spin={{ indicator: <LoadingMark /> }}
    button={{ loadingIcon: <LoadingMark size="small" /> }}
    select={{ loadingIcon: <LoadingMark size="small" /> }}>
    {children}
  </ConfigProvider>;
}
