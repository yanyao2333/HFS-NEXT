import "./globals.css";

export default function RootLayout({children}) {
    return (
        <html>
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <title>HFS NEXT - 下一代好分数</title>
        </head>
        <body>{children}</body>
        </html>
    )
}