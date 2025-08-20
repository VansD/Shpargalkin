// frontend/app/layout.tsx
import "./globals.css";
import { Navbar } from "@/shared/ui/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
