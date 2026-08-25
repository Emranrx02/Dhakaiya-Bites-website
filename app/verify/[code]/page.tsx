import Link from "next/link";
import {notFound} from "next/navigation";
import StaffQr from "@/components/StaffQr";
import {findStaff,staff} from "@/data/staff";

export function generateStaticParams(){return staff.map(s=>({code:s.code.replace("DB-","")}))}

export default async function StaffProfile({params}:{params:Promise<{code:string}>}){
 const {code}=await params; const member=findStaff(code); if(!member)notFound();
 return <main className="staff-page"><Link className="back" href="/">← Dhakaiya Bites</Link><section className="staff-card"><img className="staff-photo" src={member.photo} alt={member.name}/><div className={`status ${member.status}`}>{member.status==="active"?"✓ VERIFIED • ACTIVE":"INACTIVE"}</div><h1>{member.name}</h1><p>{member.role}</p><dl><div><dt>Staff ID</dt><dd>{member.code}</dd></div><div><dt>Joined</dt><dd>{member.joined}</dd></div><div><dt>Status</dt><dd>{member.status.toUpperCase()}</dd></div></dl><p className="staff-note">{member.note}</p><StaffQr code={member.code}/><small className="privacy-note">Only approved work information is displayed. No private personal data is published.</small></section></main>;
}
