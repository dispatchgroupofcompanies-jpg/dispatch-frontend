import type { HTMLAttributes } from "react";
import styles from "./LoadingMark.module.css";

export default function LoadingMark({ size, className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { size?: "small" | "large" }) {
  return <span {...props} data-workspace-loader="x" aria-hidden="true"
    className={`${styles.mark} ${size === "small" ? styles.small : size === "large" ? styles.large : ""} ${className}`}>X</span>;
}
