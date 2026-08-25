import type {Metadata} from "next";
import "./globals.css";
import "./brand-update.css";
import "./verification.css";

export const metadata:Metadata={
 title:"Dhakaiya Bites | Fast Bites. Big Flavour.",
 description:"Burgers, rice bowls, hot chicken, seafood, pasta and more in Mirpur 10.",
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"),
 openGraph:{title:"Dhakaiya Bites",description:"Every craving, one place.",images:["/og.png"]}
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="bn"><body>{children}</body></html>;
}
