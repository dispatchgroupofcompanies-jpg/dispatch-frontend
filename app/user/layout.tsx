import AppShell from "../components/AppShell";
import AuthGuard from "./auth-guard";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard><AppShell>{children}</AppShell></AuthGuard>;
}
