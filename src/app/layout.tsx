import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@styles/globals.css";
import Navbar from "@components/Navbar/Navbar";
import Provider from "@components/Provider/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyFinances",
  description: "created by raslow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children} 
          <ToastContainer toastStyle={{ backgroundColor: "#1E293B" }}/>
        </Provider>
      </body>
    </html>
  );
}
