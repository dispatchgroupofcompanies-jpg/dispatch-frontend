"use client";

import Image from "next/image";
import SessionLoader from "@/src/components/auth/SessionLoader";
import { useEffect, useState } from "react";
import { signin } from "../route";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState(() => typeof window === "undefined" ? "" : localStorage.getItem("rememberEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(() => typeof window !== "undefined" && Boolean(localStorage.getItem("rememberEmail")));
  const [showPassword, setShowPassword] = useState(false);
  const [deviceId, setDeviceId] = useState(() => typeof window === "undefined" ? null : localStorage.getItem("deviceId"));
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    if (deviceId) return;

    let active = true;
    import("@fingerprintjs/fingerprintjs")
      .then((module) => module.load())
      .then((fingerprint) => fingerprint.get())
      .then((result) => {
        if (!active) return;
        localStorage.setItem("deviceId", result.visitorId);
        setDeviceId(result.visitorId);
      })
      .catch(() => {
        if (active) setError("Could not identify this device. Please refresh and try again.");
      });

    return () => { active = false; };
  }, [deviceId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let currentDeviceId = deviceId || localStorage.getItem("deviceId");
      if (!currentDeviceId) {
        try {
          const fingerprint = await import("@fingerprintjs/fingerprintjs").then((module) => module.load());
          currentDeviceId = (await fingerprint.get()).visitorId;
          localStorage.setItem("deviceId", currentDeviceId);
          setDeviceId(currentDeviceId);
        } catch {
          setError("Could not identify this device. Please refresh and try again.");
          return;
        }
      }

      const result = await signin({
        email: email.trim(),
        password,
        deviceId: currentDeviceId,
      });

      if (!result.success) {
        const messages = {
          pending_approval: "This device is awaiting administrator approval.",
          access_denied: "This device was denied access. Contact your administrator.",
          device_id_required: "Device identification is required. Please refresh and try again.",
        };
        setError(messages[result.status] || result.message || "Sign in failed. Please try again.");
        return;
      }

      if (rememberEmail) localStorage.setItem("rememberEmail", email.trim());
      else localStorage.removeItem("rememberEmail");

      // Only a local path for this user's role may override the destination.
      const isAdmin = (result.admin || result.user)?.role === "admin";
      const requestedPath = new URLSearchParams(window.location.search).get("redirect");
      const safePath = requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//") && !requestedPath.includes("\\") &&
        requestedPath.startsWith(isAdmin ? "/admin/" : "/user/");
      setRedirecting(true);
      window.location.assign(safePath ? requestedPath : isAdmin ? "/admin/dashboard" : "/user/loadboard");
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) return <SessionLoader />;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.brandPanel} aria-label="XCDGOC dispatch platform">
          <div className={styles.brandTop}>
            <span className={styles.brandMark}>X</span>
            <span className={styles.brandName}>XCDGOC <span>Dispatch</span></span>
          </div>
          <div className={styles.brandBody}>
            <span className={styles.eyebrow}>DISPATCH OPERATIONS PLATFORM</span>
            <h1>Clarity for every mile.</h1>
            <p>One secure workspace for your team, your loads, and every important decision along the way.</p>
            <div className={styles.featureList}>
              <div><span>01</span> Manage dispatch and load boards</div>
              <div><span>02</span> Track invoices and payments</div>
              <div><span>03</span> Keep your team connected</div>
            </div>
          </div>
          <div className={styles.brandFoot}>
            <Image src="/logo.jpeg" alt="XCDGOC Pvt Ltd" width={108} height={108} className={styles.logo} priority />
            <span>Built for the people who keep freight moving.</span>
          </div>
        </section>

        <section className={styles.formPanel} aria-labelledby="sign-in-title">
          <div className={styles.formContent}>
            <div className={styles.mobileBrand}><span className={styles.brandMark}>X</span><span>XCDGOC Dispatch</span></div>
            <span className={styles.formEyebrow}>WELCOME BACK</span>
            <h2 id="sign-in-title">Sign in to your workspace</h2>
            <p className={styles.intro}>Enter your credentials to continue to your dashboard.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />

              <label htmlFor="login-password">Password</label>
              <div className={styles.passwordField}>
                <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
              </div>

              <label className={styles.remember}><input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} /> Remember my email</label>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={styles.submit} type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<span aria-hidden="true">→</span></button>
            </form>

          </div>
          <footer className={styles.footer}>© {new Date().getFullYear()} XCDGOC Pvt Ltd <span>•</span> Secure dispatch workspace</footer>
        </section>
      </div>
    </main>
  );
}
