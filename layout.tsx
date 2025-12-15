import type { Metadata } from "next";
import "./globals.css"; // Asegúrate de que este archivo exista, si no, borra esta línea

export const metadata: Metadata = {
    title: "Huelva Late",
    description: "Agenda cultural de la Sierra de Huelva",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                {children}
            </body>
        </html>
    );
}