"use client";
import {QRCodeSVG} from "qrcode.react";

export default function StaffQr({code}:{code:string}){
 const base=typeof window==="undefined"?"https://dhakaiyabites.com":window.location.origin;
 return <div className="qr"><QRCodeSVG value={`${base}/verify/${code.replace("DB-","")}`} size={150} bgColor="#ffffff" fgColor="#991b1b"/><small>Scan to verify {code}</small></div>;
}
