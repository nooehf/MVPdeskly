import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deskly Executive AI Assistant',
  description: 'Asistente ejecutivo de operaciones, finanzas, clientes y CRM.',
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
