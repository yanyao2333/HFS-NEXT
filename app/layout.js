import "./globals.css";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";

export default function RootLayout({children}) {
    return (
        <html>
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <title>HFS NEXT - 下一代好分数</title>
        </head>
        <body>
        {children}
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    )
}