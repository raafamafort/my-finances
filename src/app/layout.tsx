'use client'

import React, { useState } from 'react';
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@styles/globals.css";
import Navbar from "@components/Navbar/Navbar";
import Provider from "@components/Provider/Provider";
import Drawer from "@components/Drawer/Drawer";
import { useMediaQuery } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 280;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const isWideScreen = useMediaQuery(`(min-width:960px)`);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main
          className={`main-content`}
          style={{
              flexGrow: 1,
              marginLeft: (open && isWideScreen) ? drawerWidth : 0,
              width: `calc(100% - ${(open && isWideScreen) ? drawerWidth : 0}px)`,
            }}
          >
            <Navbar toggleDrawer={toggleDrawer}/>
            <Drawer open={open}/>
            {children} 
          {open && <div onClick={toggleDrawer} style={{ position: 'fixed', top: 0, left: drawerWidth, width: `calc(100% - ${drawerWidth}px)`, height: '100%', zIndex: 1300 }}></div>}
          </main>
          <ToastContainer toastStyle={{ backgroundColor: "#1E293B" }}/>
        </Provider>
      </body>
    </html>
  );
}
