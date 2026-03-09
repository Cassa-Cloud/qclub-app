import { useState, useEffect, useCallback } from "react";

const TABLES = [
  { id: 1,  name: "C1",   zone: "Console",     capacity: 6, x: 2,  y: 72, w: 13, h: 14 },
  { id: 2,  name: "C2",   zone: "Console",     capacity: 6, x: 2,  y: 30, w: 13, h: 14 },
  { id: 3,  name: "C3",   zone: "Console",     capacity: 6, x: 2,  y: 50, w: 13, h: 14 },
  { id: 4,  name: "P3",   zone: "Perimetrale", capacity: 4, x: 20, y: 82, w: 9,  h: 12 },
  { id: 5,  name: "P4",   zone: "Perimetrale", capacity: 4, x: 30, y: 82, w: 9,  h: 12 },
  { id: 6,  name: "P5",   zone: "Perimetrale", capacity: 4, x: 40, y: 82, w: 9,  h: 12 },
  { id: 7,  name: "P6",   zone: "Perimetrale", capacity: 4, x: 50, y: 82, w: 9,  h: 12 },
  { id: 8,  name: "P7",   zone: "Perimetrale", capacity: 4, x: 60, y: 82, w: 9,  h: 12 },
  { id: 9,  name: "P8",   zone: "Perimetrale", capacity: 4, x: 20, y: 28, w: 12, h: 11 },
  { id: 10, name: "P9",   zone: "Perimetrale", capacity: 4, x: 42, y: 28, w: 13, h: 11 },
  { id: 11, name: "P10a", zone: "Perimetrale", capacity: 4, x: 84, y: 2,  w: 13, h: 10 },
  { id: 12, name: "P10b", zone: "Perimetrale", capacity: 4, x: 84, y: 13, w: 13, h: 10 },
  { id: 13, name: "P11",  zone: "Perimetrale", capacity: 6, x: 84, y: 38, w: 13, h: 18 },
  { id: 14, name: "R1",   zone: "Centrale",    capacity: 4, x: 47, y: 48, w: 11, h: 13 },
  { id: 15, name: "R2",   zone: "Centrale",    capacity: 4, x: 59, y: 48, w: 11, h: 13 },
  { id: 16, name: "R3",   zone: "Centrale",    capacity: 4, x: 47, y: 62, w: 11, h: 13 },
  { id: 17, name: "R4",   zone: "Centrale",    capacity: 4, x: 59, y: 62, w: 11, h: 13 },
  { id: 18, name: "M1",   zone: "Mensola",     capacity: 2, x: 72, y: 5,  w: 6,  h: 10 },
  { id: 19, name: "M2",   zone: "Mensola",     capacity: 2, x: 72, y: 16, w: 6,  h: 10 },
  { id: 20, name: "L1",   zone: "Lounge",      capacity: 4, x: 70, y: 82, w: 8,  h: 12 },
  { id: 21, name: "L2",   zone: "Lounge",      capacity: 4, x: 79, y: 82, w: 8,  h: 12 },
  { id: 22, name: "L3",   zone: "Lounge",      capacity: 4, x: 88, y: 82, w: 8,  h: 12 },
];

const ZONE_META = {
  Console:     { color: "#b45309", bg: "#fef3c7", border: "#fcd34d", dot: "#d97706" },
  Perimetrale: { color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd", dot: "#2563eb" },
  Centrale:    { color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5", dot: "#dc2626" },
  Mensola:     { color: "#6b21a8", bg: "#f3e8ff", border: "#d8b4fe", dot: "#9333ea" },
  Lounge:      { color: "#065f46", bg: "#d1fae5", border: "#6ee7b7", dot: "#059669" },
};

function calcPrCommission(total, pr) {
  if (pr.tier1000 && total >= 1000) return Math.round(total * 20 / 100);
  if (pr.tier250  && total >= 250)  return Math.round(total * 15 / 100);
  return Math.round(total * 10 / 100);
}
function getPrRate(total, pr) {
  if (pr.tier1000 && total >= 1000) return 20;
  if (pr.tier250  && total >= 250)  return 15;
  return 10;
}

const DEFAULT_BOTTLES = [
  { id: "b1", name: "Belvedere",      category: "Vodka",      costPrice: 35, sellPrice: 120, stock: 12 },
  { id: "b2", name: "Grey Goose",     category: "Vodka",      costPrice: 32, sellPrice: 110, stock: 8  },
  { id: "b3", name: "Hendricks",      category: "Gin",        costPrice: 28, sellPrice: 100, stock: 6  },
  { id: "b4", name: "Don Julio",      category: "Tequila",    costPrice: 45, sellPrice: 150, stock: 5  },
  { id: "b5", name: "Moët",           category: "Champagne",  costPrice: 40, sellPrice: 130, stock: 10 },
  { id: "b6", name: "Veuve Clicquot", category: "Champagne",  costPrice: 50, sellPrice: 160, stock: 7  },
  { id: "b7", name: "Jack Daniel's",  category: "Whisky",     costPrice: 22, sellPrice: 80,  stock: 15 },
  { id: "b8", name: "Aperol",         category: "Aperitivo",  costPrice: 12, sellPrice: 45,  stock: 20 },
  { id: "b9", name: "Red Bull",       category: "Analcolico", costPrice: 2,  sellPrice: 8,   stock: 48 },
  { id:"b10", name: "Schweppes",      category: "Analcolico", costPrice: 1,  sellPrice: 5,   stock: 48 },
  { id:"b11", name: "Coca Cola",      category: "Analcolico", costPrice: 1,  sellPrice: 5,   stock: 48 },
  { id:"b12", name: "Acqua",          category: "Analcolico", costPrice: 0,  sellPrice: 3,   stock: 60 },
];

const DEFAULT_PRS = [
  { id: "pr1", name: "Alessandro", tier250: true,  tier1000: false },
  { id: "pr2", name: "Giulia",     tier250: true,  tier1000: true  },
  { id: "pr3", name: "Marco",      tier250: false, tier1000: false },
];

// extras = aggiunte pagate in cambusa: [{ id, descrizione, importo, sconto, ora }]
const EMPTY_RES = {
  clientName: "", tableName: "", guests: "", phone: "",
  caparra: "", caparraPaid: false, bottles: [], prId: "",
  budget: "",   // importo pagato in cassa (sola lettura in cambusa)
  note: "",
  orarioUscita: "",  // orario uscita bottiglie
  chiuso: false,     // tavolo chiuso (tutti pagato)
  extras: [],   // aggiunte pagate in cambusa
};

// Storage keys — per-night keys use nightId prefix
const KEYS = {
  nights:  "qclub-nights",        // lista di tutte le serate [{id,name,date}]
  current: "qclub-current-night", // id serata attiva
  res:  id => `qclub-res-${id}`,
  bot:  id => `qclub-bot-${id}`,
  prs:  id => `qclub-prs-${id}`,
  ts:   id => `qclub-ts-${id}`,
};

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const CREDS = {
  cassa:   { password: "qclub2024",   role: "cassa",   label: "Cassa" },
  cambusa: { password: "cambusa2024", role: "cambusa", label: "Cambusa" },
};

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [show, setShow] = useState(false);
  const go = () => {
    const f = Object.values(CREDS).find(c => c.password === pw.trim());
    if (f) onLogin(f.role, f.label);
    else { setErr("Password errata. Riprova."); setTimeout(() => setErr(""), 2500); }
  };
  return (
    <div style={{ minHeight:"100vh",background:"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:20 }}>
      <div style={{ width:"100%",maxWidth:380 }}>
        <div style={{ textAlign:"center",marginBottom:40 }}>
          <div style={{ width:64,height:64,background:"#f59e0b",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,margin:"0 auto 16px" }}>Q</div>
          <div style={{ fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"0.06em" }}>Q CLUB</div>
          <div style={{ fontSize:12,color:"#64748b",letterSpacing:"0.2em",marginTop:4 }}>GESTIONALE TAVOLI</div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"32px 28px" }}>
          <div style={{ fontSize:14,color:"#94a3b8",marginBottom:20,textAlign:"center" }}>Inserisci la password per accedere</div>
          <div style={{ position:"relative",marginBottom:16 }}>
            <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password..." autoFocus
              style={{ width:"100%",padding:"12px 44px 12px 16px",borderRadius:10,border:`1px solid ${err?"#dc2626":"rgba(255,255,255,0.15)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"Georgia,serif" }} />
            <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16 }}>{show?"🙈":"👁"}</button>
          </div>
          {err && <div style={{ background:"rgba(220,38,38,0.15)",border:"1px solid #dc2626",borderRadius:8,padding:"8px 14px",color:"#fca5a5",fontSize:13,marginBottom:14,textAlign:"center" }}>{err}</div>}
          <button onClick={go} style={{ width:"100%",padding:"13px",borderRadius:10,background:"#f59e0b",color:"#1a1a2e",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif" }}>Accedi</button>
          <div style={{ marginTop:20,padding:"14px",background:"rgba(255,255,255,0.03)",borderRadius:8,fontSize:11,color:"#475569",lineHeight:2 }}>
            <div>🟡 <strong style={{color:"#fcd34d"}}>Cassa</strong> — prenotazioni, prezzi, budget, PR</div>
            <div>🟢 <strong style={{color:"#86efac"}}>Cambusa</strong> — bottiglie, analcolici, aggiunte</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STAMPA LISTA CASSIERE ────────────────────────────────────────────────────
function printCashierList(reservations, bottles) {
  const booked = TABLES.filter(t => reservations[t.id]);
  const date = new Date().toLocaleDateString("it-IT", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  const calcTot = r => {
    const budget = Number(r.budget||0);
    const eTot = (r.extras||[]).reduce((s,e)=>{
      const imp = Number(e.importo||0);
      const sc = Number(e.sconto||0);
      return s + imp - sc;
    },0);
    return budget + eTot;
  };

  const totalIncasso = booked.reduce((s,t)=>s+calcTot(reservations[t.id]),0);

  const rows = booked.map(t => {
    const r = reservations[t.id];
    const bots = (r.bottles||[]).map(b=>{ const bt=bottles.find(x=>x.id===b.bottleId); return bt?`${bt.name}×${b.qty}`:""; }).filter(Boolean).join(", ");
    const total = calcTot(r);
    const extrasStr = (r.extras||[]).map(e=>{
      const sc = Number(e.sconto||0);
      return `${e.descrizione} €${e.importo}${sc>0?` (-€${sc})`:""} (${e.ora})`;
    }).join(" · ");
    return `<tr>
      <td><strong>${r.tableName||t.name}</strong><br><small style="color:#64748b">${t.zone}</small></td>
      <td>${r.clientName}${r.phone?`<br><small style="color:#94a3b8">${r.phone}</small>`:""}</td>
      <td style="text-align:center">${r.guests}</td>
      <td style="text-align:center;color:#2563eb;font-weight:700">${r.budget?`€${r.budget}`:"—"}</td>
      <td style="font-size:11px;color:#64748b">${bots||"—"}<br><small style="color:#2563eb">${bTot>0?"€"+bTot:""}</small></td>

      <td style="text-align:center;font-weight:700;font-size:15px;color:#1a1a2e">€${total}</td>
      <td style="color:#94a3b8;font-size:11px">${r.note||""}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lista Cassiere – Q Club</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;padding:20px;color:#1a1a2e}
  h1{font-size:18px;margin-bottom:2px}.sub{color:#64748b;font-size:11px;margin-bottom:16px}
  table{width:100%;border-collapse:collapse}th{background:#1a1a2e;color:#f59e0b;padding:8px 10px;text-align:left;font-size:11px;letter-spacing:.05em}
  td{padding:8px 10px;border-bottom:1px solid #e5e7eb;vertical-align:top}tr:nth-child(even) td{background:#f8fafc}
  .total-box{background:#1a1a2e;color:#fff;border-radius:8px;padding:10px 18px;display:flex;align-items:center;gap:20px;margin-bottom:14px}
  @media print{body{padding:10px}}</style></head><body>
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
    <div style="width:38px;height:38px;background:#1a1a2e;color:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900">Q</div>
    <div><h1>Lista Cassiere — Q Club</h1><div class="sub">${date} · ${booked.length} tavoli prenotati</div></div>
  </div>
  <div class="total-box">
    <span>💰 Incasso totale: <strong style="font-size:16px;color:#f59e0b">€${totalIncasso.toLocaleString("it-IT")}</strong></span>
    <span style="color:#94a3b8;font-size:11px">Tavoli: ${booked.length} / ${TABLES.length}</span>
  </div>
  <table><thead><tr><th>Tavolo</th><th>Cliente</th><th>Ospiti</th><th>Budget</th><th>Bottiglie</th><th>Totale</th><th>Note</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <div style="text-align:right;font-size:10px;color:#94a3b8;margin-top:12px">Stampato il ${new Date().toLocaleString("it-IT")}</div>
  </body></html>`;
  const w = window.open("","_blank"); w.document.write(html); w.document.close(); w.print();
}

// ─── STAMPA PIANTINA ─────────────────────────────────────────────────────────
function printFloorPlan(reservations) {
  const date = new Date().toLocaleDateString("it-IT", { weekday:"long", day:"numeric", month:"long" });
  const zmP = {
    Console:     { bg:"#fef3c7", border:"#fcd34d", color:"#b45309" },
    Perimetrale: { bg:"#dbeafe", border:"#93c5fd", color:"#1d4ed8" },
    Centrale:    { bg:"#fee2e2", border:"#fca5a5", color:"#b91c1c" },
    Mensola:     { bg:"#f3e8ff", border:"#d8b4fe", color:"#6b21a8" },
    Lounge:      { bg:"#d1fae5", border:"#6ee7b7", color:"#065f46" },
  };
  const tableHTML = TABLES.map(t => {
    const r = reservations[t.id]; const zm = zmP[t.zone];
    return `<div style="position:absolute;left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%;background:${r?zm.bg:"#f8fafc"};border:2px solid ${r?zm.border:"#e2e8f0"};border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden">
      <div style="font-size:9px;font-weight:700;color:${r?zm.color:"#94a3b8"}">${t.name}</div>
      ${r?`<div style="font-size:7px;color:${zm.color};max-width:94%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center">${r.clientName}</div>`:`<div style="font-size:7px;color:#cbd5e1">libero</div>`}
    </div>`;
  }).join("");
  const legend = Object.entries({Console:"#fef3c7",Perimetrale:"#dbeafe",Centrale:"#fee2e2",Mensola:"#f3e8ff",Lounge:"#d1fae5"})
    .map(([z,c])=>`<div style="display:flex;align-items:center;gap:4px"><div style="width:10px;height:10px;background:${c};border:1px solid #ccc;border-radius:2px"></div><span>${z}</span></div>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Piantina Q Club</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:14px;color:#1a1a2e}
  @media print{body{padding:6px}@page{size:A4 landscape;margin:8mm}}</style></head><body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="width:34px;height:34px;background:#1a1a2e;color:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900">Q</div>
      <div><div style="font-size:15px;font-weight:700">Q Club — Piantina Serata</div><div style="font-size:11px;color:#64748b">${date}</div></div>
    </div>
    <div style="display:flex;gap:10px;font-size:10px;align-items:center">${legend}
      <div style="display:flex;align-items:center;gap:4px"><div style="width:10px;height:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:2px"></div><span>Libero</span></div>
    </div>
  </div>
  <div style="position:relative;width:100%;padding-bottom:68%;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
    <div style="position:absolute;left:55%;top:2%;width:16%;height:24%;background:#eff6ff;border:2px solid #93c5fd;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#1d4ed8;font-weight:700">BAR 1</div>
    <div style="position:absolute;left:78%;top:2%;width:5%;height:24%;background:#eff6ff;border:2px solid #93c5fd;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#1d4ed8;writing-mode:vertical-rl">BAR 2</div>
    <div style="position:absolute;left:16%;top:44%;width:12%;height:22%;background:#f8fafc;border:2px solid #e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#94a3b8;writing-mode:vertical-rl;font-weight:700">🎵 CONSOLE</div>
    <div style="position:absolute;left:76%;bottom:2%;width:22%;height:9%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;letter-spacing:.08em">INGRESSO</div>
    ${tableHTML}
  </div>
  <div style="text-align:right;font-size:10px;color:#94a3b8;margin-top:6px">Stampato il ${new Date().toLocaleString("it-IT")}</div>
  </body></html>`;
  const w = window.open("","_blank"); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function App() {
  const [role, setRole]       = useState(null);
  const [roleLabel, setRL]    = useState("");
  const [nightId, setNightId] = useState(null);

  if (!role) return <LoginScreen onLogin={(r,l)=>{ setRole(r); setRL(l); }} />;
  if (!nightId) return <NightSelector role={role} roleLabel={roleLabel} isCassa={role==="cassa"}
    onSelect={id=>setNightId(id)}
    onLogout={()=>setRole(null)} />;
  return <AppInner role={role} roleLabel={roleLabel} isCassa={role==="cassa"}
    nightId={nightId}
    onLogout={()=>setRole(null)}
    onChangeNight={()=>setNightId(null)} />;
}

// ─── NIGHT SELECTOR ───────────────────────────────────────────────────────────
function NightSelector({ role, roleLabel, isCassa, onSelect, onLogout }) {
  const [nights, setNights]     = useState(() => load(KEYS.nights, []));
  const [showNew, setShowNew]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [newDate, setNewDate]   = useState(new Date().toISOString().slice(0,10));
  const [err, setErr]           = useState("");

  const createNight = () => {
    if (!newName.trim()) { setErr("Inserisci il nome della serata"); return; }
    const id = `night_${Date.now()}`;
    const night = { id, name: newName.trim(), date: newDate, createdAt: new Date().toISOString() };
    const updated = [night, ...nights];
    localStorage.setItem(KEYS.nights, JSON.stringify(updated));
    // Init bottles and PRs for new night
    localStorage.setItem(KEYS.bot(id), JSON.stringify(DEFAULT_BOTTLES));
    localStorage.setItem(KEYS.prs(id), JSON.stringify(DEFAULT_PRS));
    setNights(updated);
    onSelect(id);
  };

  const deleteNight = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Eliminare questa serata e tutti i suoi dati?")) return;
    const updated = nights.filter(n=>n.id!==id);
    localStorage.setItem(KEYS.nights, JSON.stringify(updated));
    [KEYS.res(id), KEYS.bot(id), KEYS.prs(id), KEYS.ts(id)].forEach(k=>localStorage.removeItem(k));
    setNights(updated);
  };

  const fmt = dateStr => {
    try { return new Date(dateStr+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}); }
    catch { return dateStr; }
  };

  return (
    <div style={{ minHeight:"100vh",background:"#1a1a2e",fontFamily:"Georgia,serif",padding:20,display:"flex",flexDirection:"column",alignItems:"center" }}>
      {/* Header */}
      <div style={{ width:"100%",maxWidth:620,marginBottom:32,display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:42,height:42,background:"#f59e0b",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#1a1a2e" }}>Q</div>
          <div>
            <div style={{ fontSize:18,fontWeight:700,color:"#fff",letterSpacing:"0.06em" }}>Q CLUB</div>
            <div style={{ fontSize:11,color:"#64748b",letterSpacing:"0.15em" }}>SELEZIONE SERATA</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ fontSize:12,color:isCassa?"#fcd34d":"#86efac",background:"rgba(255,255,255,0.06)",borderRadius:20,padding:"4px 12px",fontWeight:700 }}>
            {roleLabel.toUpperCase()}
          </div>
          <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#64748b",borderRadius:7,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif" }}>Esci</button>
        </div>
      </div>

      <div style={{ width:"100%",maxWidth:620 }}>
        {/* New night button / form */}
        {isCassa && !showNew && (
          <button onClick={()=>{ setShowNew(true); setNewName(""); setNewDate(new Date().toISOString().slice(0,10)); }}
            style={{ width:"100%",padding:"16px",background:"#f59e0b",color:"#1a1a2e",border:"none",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            ✨ Crea Nuova Serata
          </button>
        )}

        {isCassa && showNew && (
          <div style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:24,marginBottom:20 }}>
            <div style={{ fontSize:14,fontWeight:700,color:"#f59e0b",marginBottom:18,letterSpacing:"0.06em" }}>✨ NUOVA SERATA</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:6 }}>NOME SERATA</div>
                <input value={newName} onChange={e=>{setNewName(e.target.value);setErr("");}} placeholder="Es. Sabato Apertura"
                  autoFocus
                  style={{ width:"100%",padding:"11px 14px",borderRadius:9,border:`1px solid ${err?"#dc2626":"rgba(255,255,255,0.15)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Georgia,serif" }} />
              </div>
              <div>
                <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:6 }}>DATA</div>
                <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)}
                  style={{ width:"100%",padding:"11px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Georgia,serif",colorScheme:"dark" }} />
              </div>
            </div>
            {err && <div style={{ color:"#f87171",fontSize:12,marginBottom:10 }}>⚠️ {err}</div>}
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={createNight} style={{ flex:1,padding:"11px",background:"#f59e0b",color:"#1a1a2e",border:"none",borderRadius:9,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif" }}>
                ✓ Crea e Apri
              </button>
              <button onClick={()=>setShowNew(false)} style={{ padding:"11px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",borderRadius:9,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif" }}>
                Annulla
              </button>
            </div>
          </div>
        )}

        {!isCassa && nights.length === 0 && (
          <div style={{ textAlign:"center",color:"#64748b",padding:40 }}>
            <div style={{ fontSize:32,marginBottom:12 }}>🌙</div>
            <div style={{ fontSize:15,color:"#94a3b8" }}>Nessuna serata disponibile.<br/>Chiedi alla Cassa di crearne una.</div>
          </div>
        )}

        {/* List of nights */}
        {nights.length > 0 && (
          <div>
            <div style={{ fontSize:11,color:"#475569",letterSpacing:"0.12em",marginBottom:12 }}>
              {nights.length === 1 ? "1 SERATA DISPONIBILE" : `${nights.length} SERATE DISPONIBILI`}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {nights.map((n,i) => {
                const res = load(KEYS.res(n.id), {});
                const booked = Object.keys(res).length;
                const incasso = Object.values(res).reduce((s,r)=>{
                  const budget = Number(r.budget||0);
                  const eTot = (r.extras||[]).reduce((s2,e)=>s2+Number(e.importo||0)-Number(e.sconto||0),0);
                  return s + budget + eTot;
                },0);
                return (
                  <div key={n.id} onClick={()=>onSelect(n.id)}
                    style={{ background:i===0?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.04)",
                      border:`1px solid ${i===0?"rgba(245,158,11,0.3)":"rgba(255,255,255,0.08)"}`,
                      borderRadius:12,padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
                      transition:"all 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=i===0?"rgba(245,158,11,0.14)":"rgba(255,255,255,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.background=i===0?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.04)"}>
                    <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                      <div style={{ width:44,height:44,borderRadius:10,background:i===0?"#f59e0b":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                        {i===0?"🌙":"📅"}
                      </div>
                      <div>
                        <div style={{ fontSize:16,fontWeight:700,color:i===0?"#f59e0b":"#e2e8f0" }}>{n.name}</div>
                        <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{fmt(n.date)}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10,color:"#475569",letterSpacing:"0.08em" }}>TAVOLI</div>
                        <div style={{ fontSize:18,fontWeight:700,color:"#94a3b8" }}>{booked}</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10,color:"#475569",letterSpacing:"0.08em" }}>INCASSO</div>
                        <div style={{ fontSize:18,fontWeight:700,color:"#f59e0b" }}>€{incasso.toLocaleString("it-IT")}</div>
                      </div>
                      {isCassa && (
                        <button onClick={e=>deleteNight(n.id,e)}
                          style={{ padding:"6px 10px",background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",color:"#f87171",borderRadius:7,cursor:"pointer",fontSize:14,fontFamily:"Georgia,serif" }}>
                          🗑
                        </button>
                      )}
                      <div style={{ fontSize:20,color:"#475569" }}>›</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppInner({ role, roleLabel, isCassa, onLogout, onChangeNight, nightId }) {
  // Get night info
  const nights = load(KEYS.nights, []);
  const currentNight = nights.find(n=>n.id===nightId) || { name:"Serata", date:"" };

  const [tab, setTab]                   = useState("map");
  const [reservations, setReservations] = useState(() => load(KEYS.res(nightId), {}));
  const [bottles, setBottles]           = useState(() => load(KEYS.bot(nightId), DEFAULT_BOTTLES));
  const [prs, setPrs]                   = useState(() => load(KEYS.prs(nightId), DEFAULT_PRS));
  const [lastSync, setLastSync]         = useState(new Date());
  const [lastTs, setLastTs]             = useState(() => localStorage.getItem(KEYS.ts(nightId))||"0");

  // Modal tavolo (cassa: form completo / cambusa: solo bottiglie+extras)
  const [formOpen, setFormOpen]         = useState(false);
  const [selTable, setSelTable]         = useState(null);
  const [form, setForm]                 = useState(EMPTY_RES);
  const [editingId, setEditingId]       = useState(null);
  const [toast, setToast]               = useState(null);

  // Cambusa: form aggiunte
  const [extraDesc, setExtraDesc]       = useState("");
  const [extraImp,  setExtraImp]        = useState("");
  const [extraSc,   setExtraSc]         = useState("");

  // Cassa: gestione catalogo
  const [bottleForm, setBottleForm]     = useState({ name:"",category:"",costPrice:"",sellPrice:"",stock:"" });
  const [prForm, setPrForm]             = useState({ name:"",tier250:false,tier1000:false });

  const [search, setSearch]             = useState("");
  const [filterZone, setFilterZone]     = useState("Tutti");

  // Storico
  const [showAlertScorta, setShowAlertScorta] = useState(false);
  const [showAlertBudget, setShowAlertBudget] = useState(false);

  const sync = useCallback(()=>{
    const ts = localStorage.getItem(KEYS.ts(nightId))||"0";
    if (ts !== lastTs) {
      setReservations(load(KEYS.res(nightId),{}));
      setBottles(load(KEYS.bot(nightId),DEFAULT_BOTTLES));
      setPrs(load(KEYS.prs(nightId),DEFAULT_PRS));
      setLastTs(ts);
    }
    setLastSync(new Date());
  },[lastTs, nightId]);

  useEffect(()=>{
    const iv = setInterval(sync,3000);
    window.addEventListener("storage",sync);
    return ()=>{ clearInterval(iv); window.removeEventListener("storage",sync); };
  },[sync]);

  const toast$ = (msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const setRes  = next=>{ setReservations(next); save(KEYS.res(nightId),next); localStorage.setItem(KEYS.ts(nightId),Date.now()); };
  const setBot  = next=>{ setBottles(next);      save(KEYS.bot(nightId),next); localStorage.setItem(KEYS.ts(nightId),Date.now()); };
  const setPR   = next=>{ setPrs(next);          save(KEYS.prs(nightId),next); localStorage.setItem(KEYS.ts(nightId),Date.now()); };

  // ── Calcolo totale tavolo ──
  // Budget = pagato in cassa (fisso)
  // Bottiglie = aggiunte in cambusa dal catalogo
  // Extras = aggiunte manuali pagate in cambusa (con eventuale sconto)
  const tableTotal = (res, bots) => {
    // Totale = budget cassa + aggiunte cambusa (le bottiglie scalano il budget, non si sommano)
    if (!res) return 0;
    const budget = Number(res.budget||0);
    const eTot   = (res.extras||[]).reduce((s,e)=>s+Number(e.importo||0)-Number(e.sconto||0),0);
    return budget + eTot;
  };

  const bottlesTotalFor = (res, bots) => {
    if (!res) return 0;
    const bl = bots || bottles;
    return (res.bottles||[]).reduce((s,b)=>{ const bt=bl.find(x=>x.id===b.bottleId); return s+(bt?bt.sellPrice*b.qty:0); },0);
  };

  // ── Apri modal tavolo ──
  const openForm = t => {
    setSelTable(t);
    const ex = reservations[t.id];
    if (ex) { setForm({...EMPTY_RES,...ex,extras:ex.extras||[],bottles:ex.bottles||[]}); setEditingId(t.id); }
    else    { setForm({...EMPTY_RES,tableName:t.name}); setEditingId(null); }
    setExtraDesc(""); setExtraImp(""); setExtraSc("");
    setFormOpen(true);
  };

  // ── Salva (cassa: tutto / cambusa: solo bottles + extras) ──
  const saveRes = () => {
    if (isCassa) {
      if (!form.clientName.trim()) { toast$("Inserisci il nome del cliente","err"); return; }
      if (!form.guests||Number(form.guests)<1) { toast$("Inserisci il numero di ospiti","err"); return; }
    }
    setRes({...reservations,[selTable.id]:{
      ...form,
      guests: isCassa ? Number(form.guests) : (reservations[selTable.id]?.guests||form.guests),
      caparra: isCassa ? Number(form.caparra)||0 : (reservations[selTable.id]?.caparra||0),
      caparraPaid: isCassa ? form.caparraPaid : (reservations[selTable.id]?.caparraPaid||false),
      budget: isCassa ? form.budget : (reservations[selTable.id]?.budget||""),
      prId: isCassa ? form.prId : (reservations[selTable.id]?.prId||""),
      extras: form.extras||[],
      bottles: form.bottles||[],
    }});
    toast$(`✓ Salvato`);
    setFormOpen(false);
  };

  const delRes = id=>{ const n={...reservations}; delete n[id]; setRes(n); toast$("Prenotazione eliminata","err"); setFormOpen(false); };

  // ── Bottiglia sul tavolo ──
  const addBot = bid=>{ const ex=form.bottles.find(b=>b.bottleId===bid); if(ex) setForm(f=>({...f,bottles:f.bottles.map(b=>b.bottleId===bid?{...b,qty:b.qty+1}:b)})); else setForm(f=>({...f,bottles:[...f.bottles,{bottleId:bid,qty:1}]})); };
  const subBot = bid=>{ const ex=form.bottles.find(b=>b.bottleId===bid); if(!ex) return; if(ex.qty<=1) setForm(f=>({...f,bottles:f.bottles.filter(b=>b.bottleId!==bid)})); else setForm(f=>({...f,bottles:f.bottles.map(b=>b.bottleId===bid?{...b,qty:b.qty-1}:b)})); };

  // ── Aggiungi extra (cambusa) ──
  const addExtra = () => {
    if (!extraDesc.trim()||!extraImp) { toast$("Inserisci descrizione e importo","err"); return; }
    const imp = Number(extraImp); const sc = Number(extraSc||0);
    if (sc > imp) { toast$("Lo sconto non può superare l'importo","err"); return; }
    const ora = new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
    setForm(f=>({...f,extras:[...(f.extras||[]),{id:`ex${Date.now()}`,descrizione:extraDesc,importo:imp,sconto:sc,ora}]}));
    setExtraDesc(""); setExtraImp(""); setExtraSc("");
    toast$(`✓ Aggiunta €${imp}${sc>0?` (sconto -€${sc})`:""}`);
  };
  const removeExtra = id => setForm(f=>({...f,extras:(f.extras||[]).filter(e=>e.id!==id)}));

  const stats = {
    total:   TABLES.length,
    booked:  Object.keys(reservations).length,
    free:    TABLES.length - Object.keys(reservations).length,
    incasso: Object.values(reservations).reduce((s,r)=>s+tableTotal(r),0),
  };
  const bottleUsage = bottles.map(b=>{ let u=0; Object.values(reservations).forEach(r=>(r.bottles||[]).forEach(rb=>{ if(rb.bottleId===b.id) u+=rb.qty; })); return {...b,used:u,revenue:u*b.sellPrice,cost:u*b.costPrice}; }).filter(b=>b.used>0);
  const prReport    = prs.map(pr=>{ let tables=0,total=0; Object.values(reservations).forEach(r=>{ if(r.prId===pr.id){tables++;total+=tableTotal(r);} }); return {...pr,tables,total,commission:calcPrCommission(total,pr),rate:getPrRate(total,pr)}; });
  const fmt = d => { try { return new Date((d||"")+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}); } catch { return d||""; } };
  const filtered    = TABLES.filter(t=>{ const r=reservations[t.id]; return (filterZone==="Tutti"||t.zone===filterZone)&&(!search||(r&&r.clientName?.toLowerCase().includes(search.toLowerCase()))); });

  // ── Night rename (renames current night in nights list) ──
  const renameCurrentNight = (newName) => {
    const nights = load(KEYS.nights,[]);
    const updated = nights.map(n=>n.id===nightId?{...n,name:newName}:n);
    localStorage.setItem(KEYS.nights, JSON.stringify(updated));
    toast$(`Serata rinominata: ${newName} ✓`);
  };



  // ── Bottiglia budget rimanente per cambusa ──
  const budgetRimanente = () => {
    if (!form.budget) return null;
    const budget = Number(form.budget);
    const speso  = bottlesTotalFor(form) + (form.extras||[]).reduce((s,e)=>s+Number(e.importo||0)-Number(e.sconto||0),0);
    return budget - speso;
  };

  return (
    <div style={{ minHeight:"100vh",background:"#f0f2f5",fontFamily:"Georgia,serif",color:"#1a1a2e" }}>
      {toast&&<div style={{ position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:toast.type==="err"?"#dc2626":"#16a34a",color:"#fff",padding:"11px 28px",borderRadius:50,fontSize:14,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.2)",whiteSpace:"nowrap" }}>{toast.msg}</div>}

      {/* HEADER */}
      <div style={{ background:"#1a1a2e",color:"#fff",padding:"0 20px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:34,height:34,background:"#f59e0b",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900 }}>Q</div>
            <div><div style={{ fontSize:15,fontWeight:700,letterSpacing:"0.06em" }}>Q CLUB</div><div style={{ fontSize:10,color:"#64748b",letterSpacing:"0.15em" }}>GESTIONALE TAVOLI</div></div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end" }}>
              <span style={{ fontSize:13,fontWeight:700,color:"#f59e0b",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{currentNight.name}</span>
              <span style={{ fontSize:10,color:"#64748b" }}>{fmt(currentNight.date)}</span>
            </div>
            <div style={{ width:1,height:30,background:"rgba(255,255,255,0.1)" }} />
            <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"4px 12px" }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:isCassa?"#f59e0b":"#22c55e" }} />
              <span style={{ fontSize:12,color:isCassa?"#fcd34d":"#86efac",fontWeight:700,letterSpacing:"0.08em" }}>{roleLabel.toUpperCase()}</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e" }} />
              <span style={{ fontSize:11,color:"#94a3b8" }}>{lastSync.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
            </div>
            <button onClick={onChangeNight} style={{ background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",color:"#f59e0b",borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:"Georgia,serif" }}>🌙 Serate</button>
            <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer" }}>Esci</button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background:"#fff",borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)" }}>
          {[{label:"Totali",value:stats.total,color:"#64748b",icon:"🪑"},{label:"Prenotati",value:stats.booked,color:"#d97706",icon:"✅"},{label:"Liberi",value:stats.free,color:"#16a34a",icon:"⭕"},{label:"Incasso",value:`€${stats.incasso.toLocaleString("it-IT")}`,color:"#2563eb",icon:"💰"}].map((s,i)=>(
            <div key={s.label} style={{ padding:"14px 20px",textAlign:"center",borderRight:i<3?"1px solid #f1f5f9":"none" }}>
              <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:4 }}>{s.icon} {s.label.toUpperCase()}</div>
              <div style={{ fontSize:22,fontWeight:700,color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:"#fff",borderBottom:"2px solid #e5e7eb",overflowX:"auto" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex" }}>
          {[{key:"map",label:"🗺 Mappa"},{key:"list",label:"📋 Tavoli"},{key:"bottles",label:"🍾 Bottiglie"},{key:"prs",label:"👤 PR"},{key:"report",label:"📊 Report"},{key:"history",label:"🌙 Serata"},{key:"cambusa",label:"🧊 Riepilogo Cambusa"}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ padding:"12px 18px",border:"none",background:"none",whiteSpace:"nowrap",borderBottom:tab===t.key?"3px solid #f59e0b":"3px solid transparent",color:tab===t.key?"#1a1a2e":"#94a3b8",fontWeight:tab===t.key?700:400,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",marginBottom:-2 }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"24px 20px" }}>

        {/* ── MAPPA ── */}
        {tab==="map"&&(
          <div>
            <div style={{ display:"flex",gap:10,marginBottom:16,justifyContent:"space-between",flexWrap:"wrap",alignItems:"center" }}>
              <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
                {[
                  {bg:"#fff",border:"#e2e8f0",label:"Libero"},
                  {bg:"#fef9c3",border:"#fde047",label:"Prenotato"},
                  {bg:"#dcfce7",border:"#86efac",label:"Cambusa aggiornata"},
                  {bg:"#fee2e2",border:"#f87171",label:"Uscito"},
                ].map(x=>(
                  <div key={x.label} style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#64748b" }}>
                    <div style={{ width:12,height:12,borderRadius:3,background:x.bg,border:`2px solid ${x.border}` }} />{x.label}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                <button onClick={()=>printCashierList(reservations,bottles)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600 }}>🖨 Lista Cassiere</button>
                <button onClick={()=>printFloorPlan(reservations)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600 }}>🗺 Piantina</button>
              </div>
            </div>
            <div style={{ position:"relative",width:"100%",paddingBottom:"72%",background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ position:"absolute",left:"55%",top:"2%",width:"16%",height:"24%",background:"#dbeafe",border:"2px solid #93c5fd",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#1d4ed8",fontWeight:700 }}>BAR 1</div>
              <div style={{ position:"absolute",left:"78%",top:"2%",width:"5%",height:"24%",background:"#dbeafe",border:"2px solid #93c5fd",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#1d4ed8",writingMode:"vertical-rl" }}>BAR 2</div>
              <div style={{ position:"absolute",left:"16%",top:"44%",width:"12%",height:"22%",background:"#f8fafc",border:"2px solid #e2e8f0",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#94a3b8",writingMode:"vertical-rl",fontWeight:700 }}>🎵 CONSOLE</div>
              <div style={{ position:"absolute",left:"76%",bottom:"2%",width:"22%",height:"10%",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#94a3b8",letterSpacing:"0.1em" }}>INGRESSO</div>
              {TABLES.map(t=>{
                const r=reservations[t.id];
                const botsCount=(r?.bottles||[]).reduce((s,b)=>s+b.qty,0);
                // Color logic: white=free, yellow=booked, green=cambusa updated, red=uscito
                const mapColor = !r
                  ? { bg:"#fff", border:"#e2e8f0", text:"#94a3b8", nameColor:"#94a3b8" }
                  : r.uscito
                    ? { bg:"#fee2e2", border:"#f87171", text:"#dc2626", nameColor:"#dc2626" }
                    : botsCount>0
                      ? { bg:"#dcfce7", border:"#86efac", text:"#15803d", nameColor:"#15803d" }
                      : { bg:"#fef9c3", border:"#fde047", text:"#854d0e", nameColor:"#854d0e" };
                return (
                  <div key={t.id} onClick={()=>openForm(t)}
                    style={{ position:"absolute",left:`${t.x}%`,top:`${t.y}%`,width:`${t.w}%`,height:`${t.h}%`,background:mapColor.bg,border:`2px solid ${mapColor.border}`,borderRadius:8,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,transition:"all 0.15s",boxShadow:r?"0 2px 8px rgba(0,0,0,0.12)":"none" }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.zIndex=10; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)";e.currentTarget.style.zIndex=1; }}>
                    <div style={{ fontSize:14,fontWeight:900,color:mapColor.nameColor,letterSpacing:"0.03em",lineHeight:1 }}>{r?.tableName||t.name}</div>
                    {r?<>
                      <div style={{ fontSize:10,color:mapColor.text,maxWidth:"94%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center",fontWeight:700,marginTop:2 }}>{r.clientName}</div>
                      {botsCount>0&&<div style={{ fontSize:9,color:mapColor.text,fontWeight:600 }}>🍾×{botsCount}</div>}
                      {r.uscito&&<div style={{ fontSize:9,fontWeight:800,color:"#dc2626",letterSpacing:"0.05em" }}>USCITO</div>}
                      {r.chiuso&&!r.uscito&&<div style={{ fontSize:9,fontWeight:700,color:"#15803d" }}>🔒</div>}
                    </>:<div style={{ fontSize:10,color:"#d1d5db",fontWeight:500 }}>libero</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign:"center",color:"#94a3b8",fontSize:12,marginTop:10 }}>Clicca un tavolo per aprirlo · sync ogni 3 secondi</div>
          </div>
        )}

        {/* ── LISTA OSPITI ── */}
        {tab==="list"&&(
          <div>
            <div style={{ display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ display:"flex",gap:10,flex:1,flexWrap:"wrap" }}>
                <input placeholder="🔍 Cerca cliente..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ flex:1,minWidth:180,padding:"9px 14px",borderRadius:8,background:"#fff",border:"1px solid #e2e8f0",fontSize:13,outline:"none" }} />
                <select value={filterZone} onChange={e=>setFilterZone(e.target.value)}
                  style={{ padding:"9px 14px",borderRadius:8,background:"#fff",border:"1px solid #e2e8f0",fontSize:13,cursor:"pointer" }}>
                  <option>Tutti</option>
                  {Object.keys(ZONE_META).map(z=><option key={z}>{z}</option>)}
                </select>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>printCashierList(reservations,bottles)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600 }}>🖨 Cassiere</button>
                <button onClick={()=>printFloorPlan(reservations)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600 }}>🗺 Piantina</button>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {filtered.map(t=>{
                const r=reservations[t.id]; const zm=ZONE_META[t.zone]; const tot=tableTotal(r);
                const pr=r?.prId?prs.find(p=>p.id===r.prId):null;
                const extrasTotal=(r?.extras||[]).reduce((s,e)=>s+Number(e.importo||0)-Number(e.sconto||0),0);
                const botsTotal=bottlesTotalFor(r);
                return (
                  <div key={t.id} style={{ background:"#fff",border:`1px solid ${r?zm.border:"#e5e7eb"}`,borderLeft:`4px solid ${r?zm.dot:"#e5e7eb"}`,borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:38,height:38,borderRadius:8,background:zm.bg,border:`2px solid ${zm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:zm.color }}>{t.name}</div>
                      <div>
                        <div style={{ fontSize:11,color:zm.color,letterSpacing:"0.08em",marginBottom:2 }}>{t.zone}</div>
                        {r?<div style={{ fontSize:15,fontWeight:700 }}>{r.clientName}</div>:<div style={{ fontSize:13,color:"#94a3b8" }}>Libero</div>}
                      </div>
                    </div>
                    {r&&<div style={{ display:"flex",gap:10,fontSize:12,color:"#64748b",flexWrap:"wrap",alignItems:"center" }}>
                      <span>👥 {r.guests}</span>
                      {r.budget&&<span style={{ background:"#fef9c3",color:"#854d0e",borderRadius:5,padding:"2px 8px",fontWeight:700 }}>💶 €{r.budget}</span>}
                      {r.caparra>0&&<span style={{ color:r.caparraPaid?"#16a34a":"#dc2626",fontWeight:600 }}>{r.caparraPaid?"✓":"✗"} cap.€{r.caparra}</span>}
                      {botsTotal>0&&(()=>{ const rim=Number(r.budget||0)-botsTotal-(r.extras||[]).reduce((s,e)=>s+e.importo-e.sconto,0); return <span style={{ color:rim>=0?"#9333ea":"#dc2626",fontWeight:600 }}>🍾 €{botsTotal} · rimane €{rim}</span>; })()}
                      {extrasTotal>0&&<span style={{ color:"#d97706" }}>+€{extrasTotal} extra</span>}
                      {tot>0&&<span style={{ color:"#2563eb",fontWeight:700,fontSize:14 }}>tot €{tot}</span>}
                      {pr&&<span>PR: {pr.name}</span>}
                      {r.note&&<span style={{ color:"#d97706" }}>📝 {r.note}</span>}
                      {r.chiuso&&<span style={{ background:"#dcfce7",color:"#16a34a",borderRadius:5,padding:"2px 8px",fontWeight:700 }}>🔒 Chiuso</span>}
                      {r.uscito&&<span style={{ background:"#fee2e2",color:"#dc2626",borderRadius:5,padding:"2px 8px",fontWeight:700 }}>🔴 Uscito</span>}
                    </div>}
                    <button onClick={()=>openForm(t)} style={{ padding:"7px 16px",borderRadius:6,background:r?zm.bg:"#f0fdf4",border:`1px solid ${r?zm.border:"#86efac"}`,color:r?zm.color:"#16a34a",fontSize:12,cursor:"pointer",fontWeight:600 }}>{r?"Apri":"+ Prenota"}</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BOTTIGLIE ── */}
        {tab==="bottles"&&(
          <div>
            <h2 style={{ fontSize:18,fontWeight:700,marginBottom:16 }}>🍾 Catalogo Bottiglie</h2>
            {isCassa&&(
              <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:20,marginBottom:20 }}>
                <div style={{ fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.12em",marginBottom:14 }}>AGGIUNGI AL CATALOGO <span style={{ color:"#f59e0b",fontSize:10 }}>(solo Cassa)</span></div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10 }}>
                  {[{k:"name",l:"Nome",p:"Es. Belvedere"},{k:"category",l:"Categoria",p:"Es. Vodka"},{k:"costPrice",l:"Costo €",p:"35",t:"number"},{k:"sellPrice",l:"Vendita €",p:"120",t:"number"},{k:"stock",l:"Stock",p:"10",t:"number"}].map(f=>(
                    <div key={f.k}><div style={{ fontSize:10,color:"#94a3b8",marginBottom:4 }}>{f.l}</div>
                    <input type={f.t||"text"} placeholder={f.p} value={bottleForm[f.k]} onChange={e=>setBottleForm(p=>({...p,[f.k]:e.target.value}))}
                      style={{ width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box" }} /></div>
                  ))}
                </div>
                <button onClick={()=>{ if(!bottleForm.name.trim()){toast$("Inserisci il nome","err");return;} setBot([...bottles,{id:`b${Date.now()}`,name:bottleForm.name,category:bottleForm.category,costPrice:Number(bottleForm.costPrice),sellPrice:Number(bottleForm.sellPrice),stock:Number(bottleForm.stock)}]); setBottleForm({name:"",category:"",costPrice:"",sellPrice:"",stock:""}); toast$("Bottiglia aggiunta ✓"); }} style={{ marginTop:12,padding:"9px 24px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600 }}>+ Aggiungi</button>
              </div>
            )}
            {!isCassa&&<div style={{ background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#92400e" }}>📋 Puoi vedere il catalogo ma solo la Cassa può aggiungere o rimuovere prodotti</div>}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12 }}>
              {bottles.map(b=>{
                const used=Object.values(reservations).reduce((s,r)=>s+((r.bottles||[]).find(rb=>rb.bottleId===b.id)?.qty||0),0);
                return (
                  <div key={b.id} style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:16 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                      <div><div style={{ fontWeight:700,fontSize:15 }}>{b.name}</div><div style={{ fontSize:12,color:"#94a3b8" }}>{b.category}</div></div>
                      {isCassa&&<button onClick={()=>{setBot(bottles.filter(x=>x.id!==b.id));toast$("Rimossa","err");}} style={{ background:"none",border:"none",color:"#fca5a5",cursor:"pointer",fontSize:16 }}>✕</button>}
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12 }}>
                      {[{l:"Costo",v:`€${b.costPrice}`,c:"#dc2626"},{l:"Vendita",v:`€${b.sellPrice}`,c:"#2563eb"},{l:"Margine",v:`€${b.sellPrice-b.costPrice}`,c:"#16a34a"}].map(x=>(
                        <div key={x.l} style={{ textAlign:"center",background:"#f8fafc",borderRadius:6,padding:"6px 4px" }}>
                          <div style={{ fontSize:10,color:"#94a3b8" }}>{x.l}</div>
                          <div style={{ fontSize:14,fontWeight:700,color:x.c }}>{x.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:"#64748b" }}>
                      <span>Stock: <b>{b.stock}</b></span><span>Usate: <b style={{ color:used>0?"#d97706":"#94a3b8" }}>{used}</b></span><span>Rimaste: <b style={{ color:(b.stock-used)<3?"#dc2626":"#16a34a" }}>{b.stock-used}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PR ── */}
        {tab==="prs"&&(
          <div>
            <h2 style={{ fontSize:18,fontWeight:700,marginBottom:10 }}>👤 Gestione PR</h2>
            <div style={{ background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:8,padding:"10px 16px",marginBottom:20,fontSize:12,color:"#92400e",lineHeight:1.7 }}>
              <strong>Scaglioni:</strong> base <strong>10%</strong> · &gt;€250 → <strong>15%</strong> · &gt;€1000 → <strong>20%</strong>
            </div>
            {isCassa&&<div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:20,marginBottom:20 }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.12em",marginBottom:14 }}>AGGIUNGI PR</div>
              <div style={{ display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end" }}>
                <div style={{ flex:2,minWidth:160 }}>
                  <div style={{ fontSize:10,color:"#94a3b8",marginBottom:4 }}>Nome</div>
                  <input placeholder="Es. Alessandro" value={prForm.name} onChange={e=>setPrForm(p=>({...p,name:e.target.value}))}
                    style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box" }} />
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  <div style={{ fontSize:10,color:"#94a3b8" }}>Scaglioni</div>
                  <label style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer" }}><input type="checkbox" checked={prForm.tier250} onChange={e=>setPrForm(p=>({...p,tier250:e.target.checked}))} />15% &gt;€250</label>
                  <label style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer" }}><input type="checkbox" checked={prForm.tier1000} onChange={e=>setPrForm(p=>({...p,tier1000:e.target.checked}))} />20% &gt;€1000</label>
                </div>
                <button onClick={()=>{ if(!prForm.name.trim()){toast$("Inserisci il nome","err");return;} setPR([...prs,{id:`pr${Date.now()}`,name:prForm.name,tier250:prForm.tier250,tier1000:prForm.tier1000}]); setPrForm({name:"",tier250:false,tier1000:false}); toast$("PR aggiunto ✓"); }} style={{ padding:"9px 24px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600 }}>+ Aggiungi</button>
              </div>
            </div>}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12 }}>
              {prs.map(pr=>{
                const rep=prReport.find(r=>r.id===pr.id)||{};
                return (
                  <div key={pr.id} style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:18 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                      <div>
                        <div style={{ fontWeight:700,fontSize:16 }}>{pr.name}</div>
                        <div style={{ display:"flex",gap:5,marginTop:6,flexWrap:"wrap" }}>
                          <span style={{ fontSize:11,background:"#f1f5f9",borderRadius:4,padding:"2px 8px",color:"#64748b" }}>10% base</span>
                          {pr.tier250&&<span style={{ fontSize:11,background:"#fef3c7",borderRadius:4,padding:"2px 8px",color:"#b45309",fontWeight:600 }}>15% &gt;€250</span>}
                          {pr.tier1000&&<span style={{ fontSize:11,background:"#dcfce7",borderRadius:4,padding:"2px 8px",color:"#16a34a",fontWeight:600 }}>20% &gt;€1000</span>}
                        </div>
                      </div>
                      {isCassa&&<div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end" }}>
                        <button onClick={()=>{setPR(prs.filter(x=>x.id!==pr.id));toast$("PR rimosso","err");}} style={{ background:"none",border:"none",color:"#fca5a5",cursor:"pointer",fontSize:16 }}>✕</button>
                        <label style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer",color:"#64748b" }}><input type="checkbox" checked={!!pr.tier250} onChange={e=>setPR(prs.map(p=>p.id===pr.id?{...p,tier250:e.target.checked}:p))} />15%</label>
                        <label style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer",color:"#64748b" }}><input type="checkbox" checked={!!pr.tier1000} onChange={e=>setPR(prs.map(p=>p.id===pr.id?{...p,tier1000:e.target.checked}:p))} />20%</label>
                      </div>}
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                      {[{l:"Tavoli",v:rep.tables||0,c:"#d97706"},{l:"Incasso",v:`€${rep.total||0}`,c:"#2563eb"},{l:`${rep.rate||10}%`,v:`€${rep.commission||0}`,c:"#16a34a"}].map(x=>(
                        <div key={x.l} style={{ textAlign:"center",background:"#f8fafc",borderRadius:6,padding:"8px 4px" }}>
                          <div style={{ fontSize:10,color:"#94a3b8" }}>{x.l}</div>
                          <div style={{ fontSize:15,fontWeight:700,color:x.c }}>{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REPORT ── */}
        {tab==="report"&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10 }}>
              <h2 style={{ fontSize:18,fontWeight:700,margin:0 }}>📊 Report Fine Serata</h2>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                <button onClick={()=>printCashierList(reservations,bottles)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600 }}>🖨 Lista Cassiere</button>
                <button onClick={()=>printFloorPlan(reservations)} style={{ padding:"8px 14px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600 }}>🗺 Piantina</button>
                <button onClick={onChangeNight} style={{ padding:"8px 16px",background:"#f59e0b",color:"#1a1a2e",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"Georgia,serif" }}>🌙 Cambia Serata</button>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24 }}>
              {[{l:"Incasso Totale",v:`€${stats.incasso.toLocaleString("it-IT")}`,c:"#2563eb",bg:"#dbeafe"},{l:"Tavoli Serviti",v:stats.booked,c:"#d97706",bg:"#fef3c7"},{l:"Costo Bottiglie",v:`€${bottleUsage.reduce((s,b)=>s+b.cost,0)}`,c:"#dc2626",bg:"#fee2e2"}].map(x=>(
                <div key={x.l} style={{ background:x.bg,borderRadius:12,padding:18,textAlign:"center" }}>
                  <div style={{ fontSize:11,color:x.c,letterSpacing:"0.1em",marginBottom:6 }}>{x.l.toUpperCase()}</div>
                  <div style={{ fontSize:26,fontWeight:700,color:x.c }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:20,marginBottom:20 }}>
              <div style={{ fontSize:13,fontWeight:700,marginBottom:14,borderBottom:"1px solid #f1f5f9",paddingBottom:10 }}>🍾 BOTTIGLIE CONSUMATE</div>
              {bottleUsage.length===0?<div style={{ color:"#94a3b8",textAlign:"center",padding:20 }}>Nessuna bottiglia</div>:(
                <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                  <thead><tr style={{ borderBottom:"2px solid #f1f5f9" }}>{["Prodotto","Categoria","Qt.","Rimaste","Costo","Ricavo","Margine"].map(h=><th key={h} style={{ padding:"8px 10px",textAlign:"left",fontSize:11,color:"#94a3b8" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {bottleUsage.map(b=>(
                      <tr key={b.id} style={{ borderBottom:"1px solid #f8fafc" }}>
                        <td style={{ padding:"9px 10px",fontWeight:600 }}>{b.name}</td>
                        <td style={{ padding:"9px 10px",color:"#64748b" }}>{b.category}</td>
                        <td style={{ padding:"9px 10px",fontWeight:700,color:"#d97706" }}>{b.used}</td>
                        <td style={{ padding:"9px 10px",fontWeight:700,color:(b.stock-b.used)<3?"#dc2626":"#16a34a" }}>{b.stock-b.used}</td>
                        <td style={{ padding:"9px 10px",color:"#dc2626" }}>€{b.cost}</td>
                        <td style={{ padding:"9px 10px",color:"#2563eb",fontWeight:600 }}>€{b.revenue}</td>
                        <td style={{ padding:"9px 10px",color:"#16a34a",fontWeight:700 }}>€{b.revenue-b.cost}</td>
                      </tr>
                    ))}
                    <tr style={{ background:"#f8fafc",fontWeight:700 }}>
                      <td colSpan={4} style={{ padding:"9px 10px",color:"#64748b",fontSize:11 }}>TOTALE</td>
                      <td style={{ padding:"9px 10px",color:"#dc2626" }}>€{bottleUsage.reduce((s,b)=>s+b.cost,0)}</td>
                      <td style={{ padding:"9px 10px",color:"#2563eb" }}>€{bottleUsage.reduce((s,b)=>s+b.revenue,0)}</td>
                      <td style={{ padding:"9px 10px",color:"#16a34a" }}>€{bottleUsage.reduce((s,b)=>s+b.revenue-b.cost,0)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:20 }}>
              <div style={{ fontSize:13,fontWeight:700,marginBottom:14,borderBottom:"1px solid #f1f5f9",paddingBottom:10 }}>👤 PROVVIGIONI PR</div>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                <thead><tr style={{ borderBottom:"2px solid #f1f5f9" }}>{["PR","Scaglioni","Tavoli","Incasso","% App.","Provvigione"].map(h=><th key={h} style={{ padding:"8px 10px",textAlign:"left",fontSize:11,color:"#94a3b8" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {prReport.map(pr=>(
                    <tr key={pr.id} style={{ borderBottom:"1px solid #f8fafc" }}>
                      <td style={{ padding:"9px 10px",fontWeight:600 }}>{pr.name}</td>
                      <td style={{ padding:"9px 10px" }}><div style={{ display:"flex",gap:4 }}><span style={{ fontSize:10,background:"#f1f5f9",borderRadius:3,padding:"1px 6px",color:"#64748b" }}>10%</span>{pr.tier250&&<span style={{ fontSize:10,background:"#fef3c7",borderRadius:3,padding:"1px 6px",color:"#b45309" }}>15%</span>}{pr.tier1000&&<span style={{ fontSize:10,background:"#dcfce7",borderRadius:3,padding:"1px 6px",color:"#16a34a" }}>20%</span>}</div></td>
                      <td style={{ padding:"9px 10px",color:"#d97706",fontWeight:700 }}>{pr.tables}</td>
                      <td style={{ padding:"9px 10px",color:"#2563eb" }}>€{pr.total}</td>
                      <td style={{ padding:"9px 10px",color:"#9333ea",fontWeight:700 }}>{pr.rate}%</td>
                      <td style={{ padding:"9px 10px",fontWeight:700,fontSize:15,color:"#16a34a" }}>€{pr.commission}</td>
                    </tr>
                  ))}
                  <tr style={{ background:"#f8fafc",fontWeight:700 }}>
                    <td colSpan={5} style={{ padding:"9px 10px",color:"#64748b",fontSize:11 }}>TOTALE</td>
                    <td style={{ padding:"9px 10px",color:"#16a34a",fontSize:16 }}>€{prReport.reduce((s,p)=>s+p.commission,0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STORICO / INFO SERATA ── */}
        {tab==="history"&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10 }}>
              <h2 style={{ fontSize:18,fontWeight:700,margin:0 }}>🌙 Serata Corrente</h2>
            </div>
            {/* Info serata attiva */}
            <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:24,marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14 }}>
                <div>
                  <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:6 }}>SERATA IN CORSO</div>
                  <div style={{ fontSize:22,fontWeight:700 }}>{currentNight.name}</div>
                  <div style={{ fontSize:13,color:"#64748b",marginTop:4 }}>{fmt(currentNight.date)}</div>
                </div>
                {isCassa&&(()=>{
                  const [editing,setEditing] = [false,()=>{}];
                  return null; // handled below
                })()}
              </div>
              {isCassa&&<div style={{ marginTop:16,paddingTop:16,borderTop:"1px solid #f1f5f9" }}>
                <div style={{ fontSize:11,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:8 }}>RINOMINA SERATA</div>
                <div style={{ display:"flex",gap:10 }}>
                  <input id="rename-night-input" defaultValue={currentNight.name}
                    style={{ flex:1,padding:"9px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:14,outline:"none" }} />
                  <button onClick={()=>{ const v=document.getElementById("rename-night-input").value; if(v.trim()) renameCurrentNight(v.trim()); }}
                    style={{ padding:"9px 18px",background:"#1a1a2e",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Georgia,serif" }}>✓ Salva</button>
                </div>
              </div>}
            </div>
            {/* Stats serata */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16 }}>
              {[{l:"Tavoli Prenotati",v:stats.booked,c:"#d97706",bg:"#fef3c7"},{l:"Tavoli Liberi",v:stats.free,c:"#16a34a",bg:"#dcfce7"},{l:"Incasso",v:`€${stats.incasso.toLocaleString("it-IT")}`,c:"#2563eb",bg:"#dbeafe"}].map(x=>(
                <div key={x.l} style={{ background:x.bg,borderRadius:12,padding:16,textAlign:"center" }}>
                  <div style={{ fontSize:10,color:x.c,letterSpacing:"0.1em",marginBottom:6 }}>{x.l.toUpperCase()}</div>
                  <div style={{ fontSize:22,fontWeight:700,color:x.c }}>{x.v}</div>
                </div>
              ))}
            </div>
            {/* Go to nights */}
            <button onClick={onChangeNight}
              style={{ width:"100%",padding:"16px",background:"#1a1a2e",color:"#f59e0b",border:"2px solid rgba(245,158,11,0.3)",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
              🌙 Vai alla Lista Serate
            </button>
          </div>
        )}

        {/* ── RIEPILOGO CAMBUSA ── */}
        {tab==="cambusa"&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10 }}>
              <h2 style={{ fontSize:18,fontWeight:700,margin:0 }}>🧊 Riepilogo Cambusa</h2>
              <div style={{ fontSize:12,color:"#64748b" }}>Ordina per orario · spunta i tavoli usciti</div>
            </div>

            {/* ── ALERT SCORTA BOTTIGLIE ── */}
            {(()=>{
              const scorta = bottles.filter(b => {
                const used = Object.values(reservations).reduce((s,r)=>s+((r.bottles||[]).find(rb=>rb.bottleId===b.id)?.qty||0),0);
                return (b.stock - used) <= 2 && b.stock > 0;
              });
              if (scorta.length === 0) return null;
              return (
                <div style={{ marginBottom:10 }}>
                  <button onClick={()=>setShowAlertScorta(s=>!s)}
                    style={{ display:"flex",alignItems:"center",gap:10,background:"#fff7ed",border:"2px solid #fb923c",borderRadius:10,padding:"10px 16px",cursor:"pointer",width:"100%",fontFamily:"Georgia,serif",textAlign:"left" }}>
                    <span style={{ fontSize:16 }}>⚠️</span>
                    <span style={{ fontSize:13,fontWeight:700,color:"#c2410c",flex:1 }}>Scorta Bassa</span>
                    <span style={{ background:"#fb923c",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700 }}>{scorta.length}</span>
                    <span style={{ fontSize:12,color:"#c2410c" }}>{showAlertScorta?"▲":"▼"}</span>
                  </button>
                  {showAlertScorta&&<div style={{ background:"#fff7ed",border:"2px solid #fb923c",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:8 }}>
                    {scorta.map(b=>{
                      const used=Object.values(reservations).reduce((s,r)=>s+((r.bottles||[]).find(rb=>rb.bottleId===b.id)?.qty||0),0);
                      const rim=b.stock-used;
                      return <div key={b.id} style={{ background:rim<=0?"#fee2e2":"#fef3c7",border:`1px solid ${rim<=0?"#fca5a5":"#fcd34d"}`,borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:700,color:rim<=0?"#dc2626":"#b45309" }}>{b.name}: {rim<=0?"ESAURITA":`${rim} rimaste`}</div>;
                    })}
                  </div>}
                </div>
              );
            })()}

            {/* ── ALERT BUDGET SUPERATO ── */}
            {(()=>{
              const sforamenti = TABLES.filter(t => {
                const r = reservations[t.id];
                if (!r || !r.budget) return false;
                const bTot = (r.bottles||[]).reduce((s,b)=>{ const bt=bottles.find(x=>x.id===b.bottleId); return s+(bt?bt.sellPrice*b.qty:0); },0);
                return bTot > Number(r.budget);
              });
              if (sforamenti.length === 0) return null;
              return (
                <div style={{ marginBottom:10 }}>
                  <button onClick={()=>setShowAlertBudget(s=>!s)}
                    style={{ display:"flex",alignItems:"center",gap:10,background:"#fef2f2",border:"2px solid #f87171",borderRadius:10,padding:"10px 16px",cursor:"pointer",width:"100%",fontFamily:"Georgia,serif",textAlign:"left" }}>
                    <span style={{ fontSize:16 }}>🚨</span>
                    <span style={{ fontSize:13,fontWeight:700,color:"#b91c1c",flex:1 }}>Budget Superato</span>
                    <span style={{ background:"#ef4444",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700 }}>{sforamenti.length}</span>
                    <span style={{ fontSize:12,color:"#b91c1c" }}>{showAlertBudget?"▲":"▼"}</span>
                  </button>
                  {showAlertBudget&&<div style={{ background:"#fef2f2",border:"2px solid #f87171",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:8 }}>
                    {sforamenti.map(t=>{
                      const r=reservations[t.id];
                      const bTot=(r.bottles||[]).reduce((s,b)=>{ const bt=bottles.find(x=>x.id===b.bottleId); return s+(bt?bt.sellPrice*b.qty:0); },0);
                      const diff=bTot-Number(r.budget);
                      return <div key={t.id} style={{ background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:700,color:"#dc2626" }}>{t.name} {r.clientName}: bottiglie €{bTot} · budget €{r.budget} · <span style={{color:"#991b1b"}}>+€{diff} oltre</span></div>;
                    })}
                  </div>}
                </div>
              );
            })()}

            {/* ── TAVOLI DA PREPARARE ── */}
            {(()=>{
              const tutti = TABLES
                .filter(t => reservations[t.id] && (reservations[t.id].bottles||[]).length > 0)
                .map(t => ({ ...t, res: reservations[t.id] }))
                .sort((a,b) => {
                  const oa = a.res.orarioUscita||"99:99";
                  const ob = b.res.orarioUscita||"99:99";
                  return oa.localeCompare(ob);
                });

              const daFare = tutti.filter(t => !t.res.uscito);
              const completati = tutti.filter(t => t.res.uscito);

              const toggleUscito = (tableId, res) => {
                setRes({ ...reservations, [tableId]: { ...res, uscito: !res.uscito } });
              };

              if (tutti.length === 0) return (
                <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:40,textAlign:"center",color:"#94a3b8" }}>
                  <div style={{ fontSize:32,marginBottom:12 }}>🍾</div>
                  <div style={{ fontSize:15,fontWeight:600 }}>Nessuna bottiglia assegnata ai tavoli</div>
                </div>
              );

              const TavoloCard = ({t, completed}) => {
                const r = t.res;
                const zm = ZONE_META[t.zone];
                const bots = (r.bottles||[]).map(b => { const bt=bottles.find(x=>x.id===b.bottleId); return bt?{...bt,qty:b.qty}:null; }).filter(Boolean);
                const alcol = bots.filter(b=>b.category!=="Analcolico");
                const analc = bots.filter(b=>b.category==="Analcolico");
                const bTot = bots.reduce((s,b)=>s+b.sellPrice*b.qty,0);
                const overBudget = r.budget && bTot > Number(r.budget);
                return (
                  <div style={{ background:completed?"#f0fdf4":"#fff", border:`2px solid ${completed?"#86efac":overBudget?"#f87171":r.orarioUscita?zm.border:"#e2e8f0"}`, borderRadius:12, overflow:"hidden", opacity:completed?0.75:1 }}>
                    <div style={{ background:completed?"#dcfce7":r.orarioUscita?zm.bg:"#f8fafc", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                        <div style={{ width:40,height:40,borderRadius:9,background:zm.bg,border:`2px solid ${zm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:zm.color }}>{t.name}</div>
                        <div>
                          <div style={{ fontSize:16,fontWeight:700,textDecoration:completed?"line-through":"none",color:completed?"#64748b":"#1a1a2e" }}>{r.clientName}</div>
                          <div style={{ fontSize:12,color:"#64748b" }}>{t.zone} · 👥 {r.guests}{r.orarioUscita?` · 🕐 ${r.orarioUscita}`:""}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        {/* Orario modificabile */}
                        <div style={{ display:"flex",alignItems:"center",gap:6,background:"#fff",border:"2px solid",borderColor:r.orarioUscita?"#f59e0b":"#e2e8f0",borderRadius:10,padding:"7px 12px" }}>
                          <span>🕐</span>
                          <input value={r.orarioUscita||""} onChange={e=>setRes({...reservations,[t.id]:{...r,orarioUscita:e.target.value}})} placeholder="01:30"
                            style={{ fontSize:16,fontWeight:700,color:r.orarioUscita?"#d97706":"#94a3b8",border:"none",outline:"none",width:52,background:"transparent",fontFamily:"Georgia,serif" }} />
                        </div>
                        {r.budget&&<div style={{ background:overBudget?"#fee2e2":"#dbeafe",border:`1px solid ${overBudget?"#fca5a5":"#93c5fd"}`,borderRadius:8,padding:"6px 10px",textAlign:"center" }}>
                          <div style={{ fontSize:9,color:overBudget?"#dc2626":"#1d4ed8",letterSpacing:"0.08em" }}>{overBudget?"🚨 SFORATO":"BUDGET"}</div>
                          <div style={{ fontSize:14,fontWeight:700,color:overBudget?"#dc2626":"#1d4ed8" }}>€{r.budget}</div>
                        </div>}
                        {/* Bottone USCITO */}
                        <button onClick={()=>toggleUscito(t.id,r)}
                          style={{ padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"Georgia,serif",
                            background:completed?"#dcfce7":"#1a1a2e",color:completed?"#16a34a":"#fff",
                            boxShadow:completed?"none":"0 2px 8px rgba(0,0,0,0.2)" }}>
                          {completed?"✓ Uscito":"Segna Uscito"}
                        </button>
                      </div>
                    </div>
                    {!completed&&<div style={{ padding:"14px 18px" }}>
                      {alcol.length>0&&<div style={{ marginBottom:analc.length>0?12:0 }}>
                        <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.12em",marginBottom:8 }}>🍾 ALCOLICI</div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                          {alcol.map(b=>(
                            <div key={b.id} style={{ background:"#fef3c7",border:"2px solid #fcd34d",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10 }}>
                              <div><div style={{ fontSize:13,fontWeight:700 }}>{b.name}</div><div style={{ fontSize:10,color:"#92400e" }}>€{b.sellPrice}</div></div>
                              <div style={{ fontSize:26,fontWeight:900,color:"#d97706" }}>×{b.qty}</div>
                            </div>
                          ))}
                        </div>
                      </div>}
                      {analc.length>0&&<div>
                        <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.12em",marginBottom:8 }}>🥤 ANALCOLICI</div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                          {analc.map(b=>(
                            <div key={b.id} style={{ background:"#dbeafe",border:"2px solid #93c5fd",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10 }}>
                              <div><div style={{ fontSize:13,fontWeight:700 }}>{b.name}</div><div style={{ fontSize:10,color:"#1d4ed8" }}>€{b.sellPrice}</div></div>
                              <div style={{ fontSize:26,fontWeight:900,color:"#2563eb" }}>×{b.qty}</div>
                            </div>
                          ))}
                        </div>
                      </div>}
                      {overBudget&&<div style={{ marginTop:12,background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,padding:"8px 14px",fontSize:13,color:"#dc2626",fontWeight:600 }}>
                        🚨 Bottiglie (€{bTot}) superano il budget di €{bTot-Number(r.budget)}
                      </div>}
                    </div>}
                  </div>
                );
              };

              return (
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {/* Tavoli da fare */}
                  {daFare.length>0&&(
                    <>
                      <div style={{ fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.12em",marginBottom:4 }}>DA PREPARARE ({daFare.length})</div>
                      {daFare.map(t=><TavoloCard key={t.id} t={t} completed={false}/>)}
                    </>
                  )}

                  {/* Totale da preparare */}
                  {daFare.length>0&&(
                    <div style={{ background:"#1a1a2e",borderRadius:12,padding:18,margin:"4px 0" }}>
                      <div style={{ fontSize:12,fontWeight:700,color:"#f59e0b",letterSpacing:"0.1em",marginBottom:12 }}>📦 TOTALE DA PREPARARE</div>
                      {(()=>{
                        const totMap = {};
                        daFare.forEach(t=>(t.res.bottles||[]).forEach(b=>{ const bt=bottles.find(x=>x.id===b.bottleId); if(!bt)return; if(!totMap[b.bottleId])totMap[b.bottleId]={...bt,totQty:0}; totMap[b.bottleId].totQty+=b.qty; }));
                        return <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>{Object.values(totMap).sort((a,b)=>a.category.localeCompare(b.category)).map(b=>(
                          <div key={b.id} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8 }}>
                            <div><div style={{ fontSize:12,fontWeight:700,color:"#fff" }}>{b.name}</div><div style={{ fontSize:10,color:"#64748b" }}>{b.category}</div></div>
                            <div style={{ fontSize:24,fontWeight:900,color:"#f59e0b" }}>×{b.totQty}</div>
                          </div>
                        ))}</div>;
                      })()}
                    </div>
                  )}

                  {/* Tavoli completati */}
                  {completati.length>0&&(
                    <>
                      <div style={{ fontSize:11,fontWeight:700,color:"#16a34a",letterSpacing:"0.12em",marginTop:8,marginBottom:4 }}>✅ TAVOLI USCITI ({completati.length})</div>
                      {completati.map(t=><TavoloCard key={t.id} t={t} completed={true}/>)}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}


            {/* ── MODAL TAVOLO ── */}
      {formOpen&&selTable&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}
          onClick={e=>e.target===e.currentTarget&&setFormOpen(false)}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,width:"100%",maxWidth:580,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11,color:ZONE_META[selTable.zone].color,fontWeight:700,letterSpacing:"0.12em",marginBottom:4 }}>{selTable.zone.toUpperCase()}</div>
                <h2 style={{ margin:0,fontSize:20 }}>{selTable.name} {form.clientName?`— ${form.clientName}`:""}</h2>
              </div>
              <button onClick={()=>setFormOpen(false)} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#94a3b8" }}>✕</button>
            </div>

            {/* ─ SEZIONE CASSA (sola lettura per cambusa) ─ */}
            <div style={{ background:isCassa?"#fff":"#f8fafc",border:"1px solid",borderColor:isCassa?"#e2e8f0":"#e2e8f0",borderRadius:12,padding:16,marginBottom:16 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:"#f59e0b" }} />
                <div style={{ fontSize:11,fontWeight:700,color:"#b45309",letterSpacing:"0.12em" }}>SEZIONE CASSA {!isCassa&&"— sola lettura"}</div>
              </div>
              {isCassa ? (
                <>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
                    <F label="Nome Cliente *" value={form.clientName} set={v=>setForm(f=>({...f,clientName:v}))} ph="Es. Mario Rossi" />
                    <F label="Telefono" value={form.phone} set={v=>setForm(f=>({...f,phone:v}))} ph="333-1234567" t="tel" />
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12 }}>
                    <F label="Nome Tavolo" value={form.tableName} set={v=>setForm(f=>({...f,tableName:v}))} ph={selTable.name} />
                    <F label="N° Ospiti *" value={form.guests} set={v=>setForm(f=>({...f,guests:v}))} ph="4" t="number" />
                    <F label="Budget Cassa €" value={form.budget} set={v=>setForm(f=>({...f,budget:v}))} ph="300" t="number" />
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:12,marginBottom:12,alignItems:"end" }}>
                    <div>
                      <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:5 }}>PR</div>
                      <select value={form.prId} onChange={e=>setForm(f=>({...f,prId:e.target.value}))} style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,outline:"none" }}>
                        <option value="">— Nessun PR —</option>
                        {prs.map(pr=><option key={pr.id} value={pr.id}>{pr.name}</option>)}
                      </select>
                    </div>
                    <F label="Caparra €" value={form.caparra} set={v=>setForm(f=>({...f,caparra:v}))} ph="100" t="number" />
                    <div>
                      <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.08em",marginBottom:8 }}>RICEVUTA</div>
                      <div onClick={()=>setForm(f=>({...f,caparraPaid:!f.caparraPaid}))} style={{ width:48,height:26,borderRadius:13,background:form.caparraPaid?"#16a34a":"#e2e8f0",position:"relative",cursor:"pointer",transition:"background 0.2s" }}>
                        <div style={{ position:"absolute",top:3,left:form.caparraPaid?25:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                    <F label="Note" value={form.note} set={v=>setForm(f=>({...f,note:v}))} ph="Compleanno, VIP..." />
                    <F label="🕐 Orario Uscita" value={form.orarioUscita} set={v=>setForm(f=>({...f,orarioUscita:v}))} ph="Es. 01:30" />
                  </div>
                </>
              ) : (
                // Cambusa: mostra dati in sola lettura
                <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
                  {[
                    {l:"Cliente",    v:form.clientName||"—"},
                    {l:"Ospiti",     v:form.guests||"—"},
                    {l:"Budget €",   v:form.budget?`€${form.budget}`:"—", highlight:true},
                    {l:"Caparra",    v:form.caparra>0?(form.caparraPaid?"✓ ":"✗ ")+"€"+form.caparra:"—"},
                    {l:"PR",         v:form.prId?prs.find(p=>p.id===form.prId)?.name||"—":"—"},
                    {l:"Note",       v:form.note||"—"},
                  ].map(x=>(
                    <div key={x.l} style={{ background:x.highlight?"#dbeafe":"#f8fafc",borderRadius:8,padding:"10px 12px",border:x.highlight?"1px solid #93c5fd":"1px solid #f1f5f9" }}>
                      <div style={{ fontSize:10,color:"#94a3b8",marginBottom:3 }}>{x.l}</div>
                      <div style={{ fontSize:14,fontWeight:x.highlight?700:500,color:x.highlight?"#1d4ed8":"#1a1a2e" }}>{x.v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Budget rimanente (cambusa) */}
            {!isCassa&&form.budget&&(()=>{
              const rim = budgetRimanente();
              return (
                <div style={{ background:rim>=0?"#dcfce7":"#fee2e2",border:`1px solid ${rim>=0?"#86efac":"#fca5a5"}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:11,color:rim>=0?"#16a34a":"#dc2626",fontWeight:700,letterSpacing:"0.1em" }}>BUDGET RIMANENTE</div>
                    <div style={{ fontSize:22,fontWeight:700,color:rim>=0?"#16a34a":"#dc2626" }}>€{rim}</div>
                  </div>
                  <div style={{ fontSize:12,color:"#64748b",textAlign:"right" }}>
                    <div>Budget totale: €{form.budget}</div>
                    <div>Speso: €{Number(form.budget)-rim}</div>
                  </div>
                </div>
              );
            })()}

            {/* ─ SEZIONE CAMBUSA: bottiglie ─ */}
            <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:16,marginBottom:16 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:"#22c55e" }} />
                  <div style={{ fontSize:11,fontWeight:700,color:"#15803d",letterSpacing:"0.12em" }}>BOTTIGLIE &amp; ANALCOLICI</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:8,background:"#f8fafc",border:`2px solid ${form.orarioUscita?"#f59e0b":"#e2e8f0"}`,borderRadius:10,padding:"7px 12px" }}>
                  <span style={{ fontSize:14 }}>🕐</span>
                  <div>
                    <div style={{ fontSize:9,color:"#94a3b8",letterSpacing:"0.1em" }}>ORARIO USCITA</div>
                    <input value={form.orarioUscita||""} onChange={e=>setForm(f=>({...f,orarioUscita:e.target.value}))} placeholder="Es. 01:30"
                      style={{ fontSize:16,fontWeight:700,color:form.orarioUscita?"#d97706":"#94a3b8",border:"none",outline:"none",width:70,background:"transparent",fontFamily:"Georgia,serif" }} />
                  </div>
                </div>
              </div>

              {/* Raggruppa per categoria */}
              {Array.from(new Set(bottles.map(b=>b.category))).map(cat=>(
                <div key={cat} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:8 }}>{cat.toUpperCase()}</div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8 }}>
                    {bottles.filter(b=>b.category===cat).map(b=>{
                      const inOrd=form.bottles.find(x=>x.bottleId===b.id);
                      return (
                        <div key={b.id} style={{ border:`2px solid ${inOrd?"#fcd34d":"#e2e8f0"}`,background:inOrd?"#fef3c7":"#f8fafc",borderRadius:8,padding:"8px 10px" }}>
                          <div style={{ fontSize:11,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{b.name}</div>
                          <div style={{ fontSize:10,color:"#2563eb",fontWeight:600 }}>€{b.sellPrice}</div>
                          <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:6,justifyContent:"center" }}>
                            <button onClick={()=>subBot(b.id)} style={{ width:24,height:24,borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1,fontWeight:700 }}>−</button>
                            <span style={{ fontSize:15,fontWeight:700,color:inOrd?"#d97706":"#94a3b8",minWidth:18,textAlign:"center" }}>{inOrd?.qty||0}</span>
                            <button onClick={()=>addBot(b.id)} style={{ width:24,height:24,borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1,fontWeight:700 }}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {form.bottles.length>0&&(
                <div style={{ background:"#dbeafe",borderRadius:8,padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontSize:13,color:"#1d4ed8" }}>Totale bottiglie</span>
                  <span style={{ fontSize:16,fontWeight:700,color:"#1d4ed8" }}>€{bottlesTotalFor(form)}</span>
                </div>
              )}
            </div>

            {/* ─ SEZIONE CAMBUSA: aggiunte/extra ─ */}
            <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:16,marginBottom:20 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:"#9333ea" }} />
                <div style={{ fontSize:11,fontWeight:700,color:"#7e22ce",letterSpacing:"0.12em" }}>AGGIUNTE CAMBUSA</div>
                <span style={{ fontSize:10,color:"#94a3b8" }}>pagamenti extra effettuati in cambusa</span>
              </div>

              {/* Lista aggiunte esistenti */}
              {(form.extras||[]).length>0&&(
                <div style={{ marginBottom:14 }}>
                  {(form.extras||[]).map(e=>(
                    <div key={e.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:8,marginBottom:6 }}>
                      <div>
                        <div style={{ fontSize:13,fontWeight:600,color:"#1a1a2e" }}>{e.descrizione}</div>
                        <div style={{ fontSize:11,color:"#94a3b8" }}>🕐 {e.ora}</div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:14,fontWeight:700,color:"#9333ea" }}>€{e.importo}</div>
                          {e.sconto>0&&<div style={{ fontSize:11,color:"#dc2626" }}>sconto -€{e.sconto}</div>}
                          {e.sconto>0&&<div style={{ fontSize:12,fontWeight:700,color:"#16a34a" }}>netto €{e.importo-e.sconto}</div>}
                        </div>
                        <button onClick={()=>removeExtra(e.id)} style={{ background:"none",border:"none",color:"#fca5a5",cursor:"pointer",fontSize:18 }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ background:"#f3e8ff",borderRadius:8,padding:"8px 14px",display:"flex",justifyContent:"space-between" }}>
                    <span style={{ fontSize:13,color:"#7e22ce" }}>Totale aggiunte (netto sconti)</span>
                    <span style={{ fontSize:15,fontWeight:700,color:"#7e22ce" }}>€{(form.extras||[]).reduce((s,e)=>s+e.importo-e.sconto,0)}</span>
                  </div>
                </div>
              )}

              {/* Form nuova aggiunta */}
              <div style={{ background:"#f9fafb",borderRadius:8,padding:12 }}>
                <div style={{ fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:10 }}>NUOVA AGGIUNTA</div>
                <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:10,color:"#94a3b8",marginBottom:4 }}>Descrizione</div>
                    <input value={extraDesc} onChange={e=>setExtraDesc(e.target.value)} placeholder="Es. Vodka extra, Tavolo VIP..." style={{ width:"100%",padding:"9px 10px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize:10,color:"#94a3b8",marginBottom:4 }}>Importo €</div>
                    <input type="number" value={extraImp} onChange={e=>setExtraImp(e.target.value)} placeholder="200" style={{ width:"100%",padding:"9px 10px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize:10,color:"#dc2626",marginBottom:4 }}>Sconto € (opz.)</div>
                    <input type="number" value={extraSc} onChange={e=>setExtraSc(e.target.value)} placeholder="0" style={{ width:"100%",padding:"9px 10px",borderRadius:7,border:"1px solid #fca5a5",fontSize:13,outline:"none",boxSizing:"border-box" }} />
                  </div>
                </div>
                {extraImp&&extraSc&&Number(extraSc)>0&&(
                  <div style={{ background:"#dcfce7",border:"1px solid #86efac",borderRadius:6,padding:"7px 12px",marginBottom:8,fontSize:13,color:"#16a34a",fontWeight:600 }}>
                    Netto dopo sconto: €{Number(extraImp)-Number(extraSc)}
                  </div>
                )}
                <button onClick={addExtra} style={{ width:"100%",padding:"10px",background:"#7e22ce",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700 }}>+ Aggiungi</button>
              </div>
            </div>

            {/* Riepilogo totale */}
            {(form.budget||(form.extras||[]).length>0)&&(
              <div style={{ background:"#1a1a2e",borderRadius:12,padding:"14px 18px",marginBottom:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:form.bottles.length>0?12:0 }}>
                  <div>
                    <div style={{ fontSize:11,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:4 }}>TOTALE TAVOLO</div>
                    <div style={{ fontSize:24,fontWeight:700,color:"#f59e0b" }}>€{tableTotal(form)}</div>
                  </div>
                  <div style={{ fontSize:12,color:"#64748b",textAlign:"right",lineHeight:2 }}>
                    {form.budget&&<div style={{color:"#94a3b8"}}>Budget cassa: <span style={{color:"#fff",fontWeight:600}}>€{form.budget}</span></div>}
                    {(form.extras||[]).length>0&&<div style={{color:"#94a3b8"}}>Aggiunte: <span style={{color:"#f59e0b",fontWeight:600}}>+€{(form.extras||[]).reduce((s,e)=>s+e.importo-e.sconto,0)}</span></div>}
                  </div>
                </div>
                {form.bottles.length>0&&(()=>{
                  const bTot = bottlesTotalFor(form);
                  const budget = Number(form.budget||0);
                  const eTot = (form.extras||[]).reduce((s,e)=>s+e.importo-e.sconto,0);
                  const eTotForm = (form.extras||[]).reduce((s,e)=>s+e.importo-e.sconto,0);
                  const rim = budget - bTot - eTotForm;
                  return (
                    <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <div style={{ fontSize:12,color:"#94a3b8" }}>🍾 Bottiglie: <span style={{color:"#c084fc",fontWeight:700}}>€{bTot}</span> scalati dal budget</div>
                      <div style={{ fontSize:13,fontWeight:700,color:rim>=0?"#86efac":"#f87171" }}>
                        Rimane: €{rim}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* FLAG TAVOLO CHIUSO */}
            <div onClick={()=>setForm(f=>({...f,chiuso:!f.chiuso}))}
              style={{ display:"flex",alignItems:"center",gap:14,background:form.chiuso?"#dcfce7":"#f8fafc",border:`2px solid ${form.chiuso?"#86efac":"#e2e8f0"}`,borderRadius:12,padding:"14px 18px",marginBottom:14,cursor:"pointer",userSelect:"none" }}>
              <div style={{ width:26,height:26,borderRadius:6,background:form.chiuso?"#16a34a":"#fff",border:`2px solid ${form.chiuso?"#16a34a":"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>
                {form.chiuso?"✓":""}
              </div>
              <div>
                <div style={{ fontSize:14,fontWeight:700,color:form.chiuso?"#15803d":"#1a1a2e" }}>🔒 Tavolo Chiuso</div>
                <div style={{ fontSize:11,color:"#64748b" }}>Tutti gli ospiti sono entrati e hanno pagato</div>
              </div>
            </div>

            <div style={{ display:"flex",gap:10 }}>
              <button onClick={saveRes} style={{ flex:1,padding:"12px",borderRadius:8,background:isCassa?"#1a1a2e":"#16a34a",color:"#fff",border:"none",fontSize:14,cursor:"pointer",fontWeight:700 }}>✓ Salva</button>
              {isCassa&&editingId&&<button onClick={()=>delRes(editingId)} style={{ padding:"12px 18px",borderRadius:8,background:"#fee2e2",border:"1px solid #fca5a5",color:"#dc2626",fontSize:13,cursor:"pointer",fontWeight:600 }}>🗑 Elimina</button>}
            </div>
            {!isCassa&&<div style={{ textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:8 }}>Solo la Cassa può eliminare prenotazioni o modificare prezzi e ospiti</div>}
          </div>
        </div>
      )}

      <style>{`input:focus,select:focus{border-color:#f59e0b!important;box-shadow:0 0 0 3px rgba(245,158,11,0.12)}`}</style>
    </div>
  );
}

function F({label,value,set,ph,t}){
  const type = t||"text";
  return <div style={{marginBottom:4}}>
    <div style={{fontSize:10,color:"#94a3b8",letterSpacing:"0.1em",marginBottom:5}}>{label}</div>
    <input type={type} value={value} placeholder={ph} onChange={e=>set(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:13,color:"#1a1a2e",boxSizing:"border-box",fontFamily:"Georgia,serif",outline:"none"}}/>
  </div>;
}

export default App;
