// src/app/layout.tsx
'use client'; // Mark as client component

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='dark'>
        <UserProvider>
          <main className="main-content">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
