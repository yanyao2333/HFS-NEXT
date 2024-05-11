import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html className="h-full bg-white">
        <body className="h-full">{children}</body>
        </html>
    )
}