export type Staff={code:string;name:string;role:string;photo:string;joined:string;status:"active"|"inactive";note:string};

// Add or edit staff here. Keep private data (NID, home address, salary) out of this file.
export const staff:Staff[]=[
 {code:"DB-1024",name:"Md Arif Hasan",role:"Service Team",photo:"/brand/logo.png",joined:"25 August 2026",status:"active",note:"Verified Dhakaiya Bites team member"},
 {code:"DB-1025",name:"Sample Staff",role:"Kitchen Team",photo:"/brand/logo.png",joined:"25 August 2026",status:"inactive",note:"No longer an active team member"}
];

export function findStaff(code:string){return staff.find(s=>s.code===`DB-${code.toUpperCase().replace(/^DB-/,"")}`)}
