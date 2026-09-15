import type { ReactNode } from "react";
import styles from "./AdminPages.module.css";

export default function AdminPageHeader({ title, description, section, actions }: {
  title: string;
  description: string;
  section: string;
  actions?: ReactNode;
}) {
  return <header className={styles.hero}>
    <div className={styles.heroCopy}>
      <div className={styles.eyebrow}><span /> ADMIN WORKSPACE / {section}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {actions && <div className={styles.heroActions}>{actions}</div>}
  </header>;
}
