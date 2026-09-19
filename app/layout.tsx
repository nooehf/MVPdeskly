import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deskly | Asistente Ejecutivo & Operativo',
  description: 'Plataforma ejecutiva de operaciones, catálogo de distribución, finanzas y CRM.',
  icons: {
    icon: '/deskly-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#080E1E] text-slate-100 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
