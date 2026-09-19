import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Ops Assistant - Gemini 2.5 Flash + HubSpot & Calendar',
  description: 'Asistente de operaciones impulsado por Gemini 2.5 Flash con Function Calling a HubSpot CRM y Google Calendar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
