// Pembukuan Haul Alumni AL ALBAB - script.js
const CONFIG={
dashboard:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=476145628&single=true&output=csv",
kasMasuk:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=0&single=true&output=csv",
kasKeluar:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=1232308945&single=true&output=csv",
pengaturan:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=30205368&single=true&output=csv"
};

const fmt=v=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number((v||"0").toString().replace(/[^\d.-]/g,""))||0);

function parseCSV(text){
 const rows=[];let row=[],cell="",q=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c=='"'){ if(q&&text[i+1]=='"'){cell+='"';i++;} else q=!q; continue;}
  if(c==','&&!q){row.push(cell);cell="";continue;}
  if((c=='\n'||c=='\r')&&!q){
    if(c=='\r'&&text[i+1]=='\n')i++;
    row.push(cell);rows.push(row);row=[];cell="";continue;
  }
  cell+=c;
 }
 if(cell.length||row.length){row.push(cell);rows.push(row);}
 return rows;
}
async function loadCSV(url){const t=await fetch(url).then(r=>r.text());return parseCSV(t);}

document.querySelectorAll(".nav-btn").forEach(btn=>{
 btn.onclick=()=>{
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.page).classList.add("active");
 };
});

async function dashboard(){
 const d=await loadCSV(CONFIG.dashboard); const m={};
 d.slice(1).forEach(r=>m[r[0]]=r[1]);
 const ids={
  totalKasMasuk:"Kas Masuk",
  totalKasCash:"Kas Cash",
  totalKasRekening:"Kas Rekening",
  totalKasKeluar:"Kas Keluar",
  totalSaldoKas:"Saldo Kas"
 };
 Object.keys(ids).forEach(id=>{
   const el=document.getElementById(id);
   if(el) el.textContent=fmt(m[ids[id]]);
 });
}

async function renderTable(url,id){
 const data=await loadCSV(url);
 const tb=document.querySelector("#"+id+" tbody");
 if(!tb)return;
 tb.innerHTML="";
 data.slice(1).forEach(r=>{
   const tr=document.createElement("tr");
   r.forEach((c,i)=>{
      const td=document.createElement("td");
      td.textContent=(i===r.length-1&&/^\d/.test(c))?fmt(c):c;
      tr.appendChild(td);
   });
   tb.appendChild(tr);
 });
}
function search(input,table){
 const i=document.getElementById(input);
 if(!i)return;
 i.addEventListener("input",()=>{
   const q=i.value.toLowerCase();
   document.querySelectorAll("#"+table+" tbody tr").forEach(tr=>{
      tr.style.display=tr.innerText.toLowerCase().includes(q)?"":"none";
   });
 });
}
window.addEventListener("DOMContentLoaded",async()=>{
 await dashboard();
 await renderTable(CONFIG.kasMasuk,"tableMasuk");
 await renderTable(CONFIG.kasKeluar,"tableKeluar");
 search("searchMasuk","tableMasuk");
 search("searchKeluar","tableKeluar");
});
