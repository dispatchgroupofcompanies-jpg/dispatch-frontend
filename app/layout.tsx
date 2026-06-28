import "./globals.css";

export const metadata = {
  title: "Dispatch App",
  description: "Auth system with Next.js + Express",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-black">
        {children}
      </body>
    </html>
  );
}