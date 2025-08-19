"use client";

//import type { Metadata } from "next";
import "./../styles/global.scss";
import { Provider } from "react-redux";
import { store } from "@/shared/store";

// export const metadata: Metadata = {
//   title: "Admin | Детектив Шпаргалкин",
//   description: "Панель администратора",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Provider store={store}>
          <div className="container">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
