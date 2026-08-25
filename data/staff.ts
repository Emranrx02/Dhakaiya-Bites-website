export type Staff={code:string;name:string;role:string;photo:string;joined:string;status:"active"|"inactive";note:string};

// Add or edit staff here. Keep private data (NID, home address, salary) out of this file.
export const staff:Staff[]=[
 {code:"DB-1024",name:"IMRAN HOSSEN",role:"Manager, Dhakaiya Bites",photo:"/brand/logo.png",joined:"14 February 2026",status:"active",note:"Officially verified Manager of Dhakaiya Bites"},
 {code:"DB-1025",name:"Sample Staff",role:"Kitchen Team",photo:"/brand/logo.png",joined:"25 August 2026",status:"inactive",note:"No longer an active team member"}
];

export function findStaff(code:string){return staff.find(s=>s.code===`DB-${code.toUpperCase().replace(/^DB-/,"")}`)}
