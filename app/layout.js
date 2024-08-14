import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

export default function RootLayout ({ children }) {
    return (
        <html>
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            {/*for OG protocol*/}
            <meta
                property="description"
                content="Next generation frontend for haofenshu.com"
            />
            <meta property="og:title" content="HFS NEXT - 下一代好分数"/>
            <meta
                property="og:description"
                content="Next generation frontend for haofenshu.com"
            />
            <meta property="twitter:card" content="summary_large_image"/>
            <title>HFS NEXT - 下一代好分数</title>
        </head>
        <body>
        {children}
        <Analytics/>
        <SpeedInsights/>
        <Toaster/>
        </body>
        </html>
    );
}
