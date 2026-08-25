import Link from "next/link";
export default function NotFound(){return <main className="staff-page"><section className="staff-card"><div className="status inactive">NOT VERIFIED</div><h1>Staff record not found</h1><p>Please check the ID and try again.</p><Link className="verify-home" href="/#verify">Try another Staff ID</Link></section></main>}
