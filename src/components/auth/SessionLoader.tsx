import LoadingMark from "./LoadingMark";
import styles from "./SessionLoader.module.css";

export default function SessionLoader() {
  return <div className={styles.screen} role="status" aria-label="Loading your workspace" aria-live="polite">
    <LoadingMark size="large" />
    <span className={styles.srOnly}>Loading your workspace</span>
  </div>;
}
