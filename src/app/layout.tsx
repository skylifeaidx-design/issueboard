import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "스카이라이프-단랩 SLA 관리",
    description: "스카이라이프와 단랩 간 홈페이지 유지보수 ITO SLA 평가 관리 시스템",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={inter.variable}>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
