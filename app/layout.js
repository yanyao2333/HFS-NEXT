import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html>
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <title>HFS NEXT</title>
        </head>
        <body>{children}</body>
        </html>
    )
}