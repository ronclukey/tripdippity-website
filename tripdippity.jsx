import { useState, useRef, useEffect } from "react";

/* ── DESIGN TOKENS ── */
const C = {
  bg:"#FFFBF5", surface:"#FFF8EE", card:"#FFFFFF", cardHover:"#FFF3E0",
  border:"#1E2D45", borderHover:"#FFB74D",
  accent:"#FF6B35", accentDim:"rgba(255,107,53,0.1)", accentBorder:"rgba(255,107,53,0.35)",
  gold:"#FF9500", goldDim:"rgba(255,149,0,0.12)",
  green:"#00C896", blue:"#7C5CFC", purple:"#FF3CAC",
  text:"#1A1A2E", muted:"#8A7A6E", faint:"#FFF3E0", selected:"rgba(255,107,53,0.08)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:${C.bg};color:${C.text};font-family:'Nunito',sans-serif;min-height:100vh}
::selection{background:${C.accent};color:#fff}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#FFF8EE}
::-webkit-scrollbar-thumb{background:#FFB74D;border-radius:3px}

.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(255,107,53,0.04) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,107,53,0.04) 1px,transparent 1px);
  background-size:80px 80px}
.grain{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.008;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes popIn{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,.4)}70%{box-shadow:0 0 0 8px rgba(232,100,42,0)}}

.anim-fadeup{animation:fadeUp .5s ease forwards}
.anim-fadein{animation:fadeIn .4s ease forwards}

.btn{border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:500;transition:all .18s;display:inline-flex;align-items:center;gap:8px;border-radius:5px}
.btn-primary{background:linear-gradient(135deg,${C.accent},#FF3CAC);color:#fff;padding:13px 28px;font-size:15px;letter-spacing:0.3px}
.btn-primary:hover{background:#FF8C5A;transform:translateY(-1px);box-shadow:0 8px 24px rgba(255,107,53,.35)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-outline{background:#FFFFFF;color:${C.text};border:1px solid ${C.border};padding:10px 20px;font-size:13px}
.btn-outline:hover{border-color:${C.accent};color:${C.accent};background:#FFF3E0}
.btn-ghost{background:transparent;color:${C.muted};padding:8px 14px;font-size:13px}
.btn-ghost:hover{color:${C.accent}}

.inp{width:100%;background:#FFFFFF;border:1px solid ${C.border};color:${C.text};font-family:'Nunito',sans-serif;font-size:15px;padding:13px 16px;border-radius:5px;outline:none;transition:border .2s}
.inp:focus{border-color:${C.accent}}
.inp::placeholder{color:${C.muted}}
.sel{appearance:none;cursor:pointer}
.lbl{font-size:10px;font-family:'DM Mono',monospace;letter-spacing:1.5px;text-transform:uppercase;color:${C.accent};margin-bottom:8px;display:block;opacity:0.7}

.chip{display:inline-flex;align-items:center;gap:6px;background:${C.surface};border:1px solid ${C.border};padding:7px 14px;border-radius:20px;font-size:13px;cursor:pointer;transition:all .15s;color:${C.muted};white-space:nowrap}
.chip:hover,.chip.on{border-color:${C.accent};color:${C.accent};background:${C.accentDim}}

.arr-btn{flex:1;min-width:90px;padding:14px 10px;border-radius:8px;border:1px solid ${C.border};background:${C.surface};cursor:pointer;transition:all .2s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:7px}
.arr-btn:hover{border-color:${C.borderHover};background:${C.card}}
.arr-btn.on{border-color:${C.accent};background:${C.accentDim}}
.arr-btn .arr-icon{font-size:24px;line-height:1}
.arr-btn .arr-label{font-size:10px;color:${C.muted};font-family:'DM Mono',monospace;letter-spacing:.5px;text-transform:uppercase}
.arr-btn.on .arr-label{color:${C.accent}}

.tr-option{display:flex;align-items:flex-start;gap:14px;padding:14px;border-radius:8px;border:1px solid ${C.border};background:#FFFFFF;position:relative;overflow:hidden}
.tr-option.best::before{content:'BEST VALUE';position:absolute;top:0;right:0;background:${C.green};color:#fff;font-size:9px;font-family:'DM Mono',monospace;padding:3px 8px;letter-spacing:1px;border-bottom-left-radius:6px}
.tr-option.fastest::before{content:'FASTEST';position:absolute;top:0;right:0;background:${C.blue};color:#fff;font-size:9px;font-family:'DM Mono',monospace;padding:3px 8px;letter-spacing:1px;border-bottom-left-radius:6px}
.tr-option.comfort::before{content:'MOST COMFORT';position:absolute;top:0;right:0;background:${C.purple};color:#fff;font-size:9px;font-family:'DM Mono',monospace;padding:3px 8px;letter-spacing:1px;border-bottom-left-radius:6px}
.tr-icon-wrap{width:46px;height:46px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}

/* hotel cards */
.hotel-card{background:${C.card};border:1px solid ${C.border};border-radius:10px;overflow:hidden;transition:all .2s}
.hotel-card:hover{border-color:${C.borderHover};transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,107,53,.15)}
.hotel-card.recommended{border-color:${C.gold};background:linear-gradient(160deg,rgba(201,168,76,.06),${C.card})}
.hotel-badge{position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:20px;font-size:9px;font-family:'DM Mono',monospace;letter-spacing:1px;text-transform:uppercase}
.hotel-type-icon{width:52px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}

/* map */
#wandr-map{width:100%;height:480px;border-radius:10px;border:1px solid ${C.border};overflow:hidden;position:relative;z-index:1}
.map-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:12px}
.legend-item{display:flex;align-items:center;gap:6px;font-size:12px;color:${C.muted}}
.legend-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}

/* map tabs */
.map-tab{padding:8px 18px;border-radius:20px;font-size:12px;cursor:pointer;transition:all .15s;border:1px solid ${C.border};background:transparent;color:${C.muted};font-family:'DM Mono',monospace;letter-spacing:.5px}
.map-tab.on{background:linear-gradient(135deg,${C.accent},#FF3CAC);color:#fff;border-color:${C.accent}}

.card{background:#FFFFFF;border:1px solid ${C.border};border-radius:8px}
.act-card{position:relative;background:#FFFFFF;border:1px solid ${C.border};border-radius:8px;padding:16px;cursor:pointer;transition:all .2s}
.act-card:hover{background:#FFF8EE;border-color:${C.borderHover}}
.act-card.sel{background:${C.selected};border-color:${C.accent}}
.act-card .check{position:absolute;top:12px;right:12px;width:22px;height:22px;border-radius:50%;border:1.5px solid ${C.border};display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:11px}
.act-card.sel .check{background:${C.accent};border-color:${C.accent};color:#fff;animation:popIn .25s ease}

.stars{display:inline-flex;gap:2px;font-size:11px}
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:10px;font-family:'DM Mono',monospace;letter-spacing:1px;text-transform:uppercase}
.tag-orange{background:${C.accentDim};color:${C.accent};border:1px solid ${C.accentBorder}}
.tag-gold{background:${C.goldDim};color:${C.gold};border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(76,175,125,.1);color:${C.green};border:1px solid rgba(76,175,125,.25)}
.tag-blue{background:rgba(76,143,202,.1);color:${C.blue};border:1px solid rgba(76,143,202,.25)}
.tag-purple{background:rgba(155,127,232,.1);color:${C.purple};border:1px solid rgba(155,127,232,.25)}
.tag-gray{background:#FFF3E0;color:#8A7A6E;border:1px solid #FFE0B2}

.day-card{background:#FFFFFF;border:1px solid ${C.border};border-radius:8px;overflow:hidden;animation:fadeUp .4s ease both}
.day-head{background:linear-gradient(135deg,rgba(255,107,53,.1),rgba(255,60,172,.05));border-bottom:1px solid ${C.border};padding:16px 22px;display:flex;align-items:center;gap:14px}
.day-num{width:40px;height:40px;border-radius:50%;background:${C.accent};color:#fff;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:13px;flex-shrink:0}
.act-row{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid ${C.faint};align-items:flex-start}
.act-row:last-child{border-bottom:none}
.time-pill{font-family:'DM Mono',monospace;font-size:10px;color:${C.accent};background:${C.accentDim};padding:3px 8px;border-radius:3px;white-space:nowrap;flex-shrink:0;margin-top:2px}
.transport-badge{display:flex;align-items:center;gap:12px;background:#FFF8EE;border:1px solid ${C.border};border-radius:6px;padding:12px 16px}

.div{height:1px;background:${C.border};margin:32px 0}
.steps{display:flex;align-items:center}
.step-d{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-family:'DM Mono',monospace;transition:all .3s;flex-shrink:0}
.step-d.done{background:${C.accent};color:#fff}
.step-d.active{background:rgba(255,107,53,.12);border:1px solid ${C.accent};color:${C.accent}}
.step-d.idle{background:${C.faint};color:${C.muted}}
.step-ln{width:48px;height:1px;background:${C.border}}
.step-ln.done{background:${C.accent}}

.ld-bar{height:2px;background:${C.faint};border-radius:2px;overflow:hidden;width:280px}
.ld-fill{height:100%;background:linear-gradient(90deg,${C.accent},#FF3CAC);animation:shimmer 1.6s infinite;background-size:400px 100%}

.rev-bar-bg{flex:1;height:4px;background:${C.faint};border-radius:2px;overflow:hidden}
.rev-bar-fill{height:100%;background:${C.gold};border-radius:2px}
.sec-label{font-size:10px;font-family:'DM Mono',monospace;letter-spacing:2px;text-transform:uppercase;color:${C.accent}}

/* custom activity search */
.search-bar{display:flex;gap:10px;align-items:center;background:#FFFFFF;border:1px solid ${C.border};border-radius:8px;padding:6px 6px 6px 16px;transition:border .2s}
.search-bar:focus-within{border-color:${C.accent}}
.search-bar input{flex:1;background:transparent;border:none;outline:none;color:${C.text};font-family:'Nunito',sans-serif;font-size:14px}
.search-bar input::placeholder{color:${C.muted}}
.btn-add{background:${C.accent};color:#fff;border:none;cursor:pointer;padding:9px 18px;border-radius:5px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;transition:all .18s;flex-shrink:0}
.btn-add:hover{background:#FF8C5A}
.btn-add:disabled{opacity:.4;cursor:not-allowed}
.act-card.custom{border-color:rgba(76,175,125,.35);background:rgba(76,175,125,.04)}
.act-card.custom.sel{border-color:${C.green};background:rgba(76,175,125,.1)}
.custom-badge{position:absolute;top:10px;left:10px;background:${C.green};color:#000;font-size:8px;font-family:'DM Mono',monospace;padding:2px 7px;border-radius:10px;letter-spacing:1px;text-transform:uppercase;font-weight:600}
.remove-btn{position:absolute;bottom:10px;right:10px;background:transparent;border:none;color:${C.muted};cursor:pointer;font-size:11px;font-family:'DM Mono',monospace;padding:3px 7px;border-radius:3px;transition:all .15s}
.remove-btn:hover{color:#ff6b6b;background:rgba(255,107,107,.1)}
.adding-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}

/* edit a day */
.day-card.regenerating{opacity:.5;pointer-events:none;filter:blur(1px)}
.day-card.just-updated{animation:highlightDay .8s ease forwards}
@keyframes highlightDay{0%{border-color:${C.green};box-shadow:0 0 0 3px rgba(76,175,125,.2)}100%{border-color:${C.border};box-shadow:none}}
.edit-day-panel{background:${C.surface};border-top:1px solid ${C.border};padding:14px 22px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.edit-day-input{flex:1;min-width:180px;background:${C.bg};border:1px solid ${C.border};color:${C.text};font-family:'Nunito',sans-serif;font-size:13px;padding:9px 13px;border-radius:5px;outline:none;transition:border .2s}
.edit-day-input:focus{border-color:${C.accent}}
.edit-day-input::placeholder{color:${C.muted}}
.btn-regen{background:${C.green};color:#000;border:none;cursor:pointer;padding:9px 16px;border-radius:5px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:all .18s;white-space:nowrap}
.btn-regen:hover{background:#5dd494;transform:translateY(-1px)}
.btn-regen:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-edit-toggle{background:transparent;border:1px solid ${C.border};color:${C.muted};cursor:pointer;padding:6px 13px;border-radius:5px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.5px;transition:all .15s;white-space:nowrap}
.btn-edit-toggle:hover{border-color:${C.accent};color:${C.accent}}
.btn-edit-toggle.active{border-color:${C.green};color:${C.green};background:rgba(76,175,125,.08)}

/* weather strip */
.weather-strip{display:flex;gap:0;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.weather-strip::-webkit-scrollbar{display:none}
.weather-day{flex:0 0 auto;min-width:80px;padding:14px 10px;text-align:center;border-right:1px solid ${C.border};position:relative}
.weather-day:last-child{border-right:none}
.weather-day.today{background:${C.accentDim}}
.weather-icon{font-size:24px;margin-bottom:6px;display:block}
.weather-temp{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:${C.text}}
.weather-lo{font-family:'DM Mono',monospace;font-size:10px;color:${C.muted}}
.weather-label{font-size:10px;color:${C.muted};margin-top:3px;letter-spacing:.3px}
.weather-cond{font-size:10px;color:${C.muted};margin-top:2px}

/* chat */
.chat-panel{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
.chat-bubble-btn{width:52px;height:52px;border-radius:50%;background:${C.accent};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 20px rgba(255,107,53,.4);transition:all .2s}
.chat-bubble-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(232,100,42,.5)}
.chat-window{width:340px;max-height:480px;background:#FFFFFF;border:1px solid ${C.border};border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 16px 48px rgba(0,0,0,.6);animation:fadeUp .25s ease}
.chat-header{padding:14px 18px;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;background:linear-gradient(120deg,rgba(255,107,53,.1),rgba(255,60,172,.05))}
.chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:0;max-height:320px}
.chat-messages::-webkit-scrollbar{width:3px}
.chat-messages::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
.msg{padding:10px 13px;border-radius:10px;font-size:13px;line-height:1.6;max-width:88%;animation:fadeUp .2s ease}
.msg.user{background:${C.accent};color:#fff;align-self:flex-end;border-bottom-right-radius:3px}
.msg.ai{background:#FFF3E0;color:${C.text};align-self:flex-start;border:1px solid #FFE0B2;border-bottom-left-radius:3px}
.msg.typing{background:#FFF3E0;border:1px solid #FFE0B2;align-self:flex-start;padding:12px 16px}
.typing-dots{display:flex;gap:4px;align-items:center}
.typing-dot{width:6px;height:6px;border-radius:50%;background:${C.muted};animation:typingPulse 1.2s ease-in-out infinite}
.typing-dot:nth-child(2){animation-delay:.2s}
.typing-dot:nth-child(3){animation-delay:.4s}
@keyframes typingPulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.chat-input-row{padding:10px 12px;border-top:1px solid ${C.border};display:flex;gap:8px;align-items:center}
.chat-inp{flex:1;background:#FFF8EE;border:1px solid ${C.border};color:${C.text};font-family:'Nunito',sans-serif;font-size:13px;padding:9px 12px;border-radius:6px;outline:none;transition:border .2s}
.chat-inp:focus{border-color:${C.accent}}
.chat-inp::placeholder{color:${C.muted}}
.chat-send{background:${C.accent};border:none;color:#fff;width:34px;height:34px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;transition:all .15s}
.chat-send:hover{background:#FF8C5A}
.chat-send:disabled{opacity:.4;cursor:not-allowed}

/* share modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:998;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;backdrop-filter:blur(4px)}
.modal{background:#FFFFFF;border:1px solid ${C.border};border-radius:14px;padding:32px;max-width:440px;width:100%;animation:fadeUp .25s ease;position:relative}
.share-link-box{background:#FFF8EE;border:1px solid ${C.border};border-radius:6px;padding:11px 14px;font-family:'DM Mono',monospace;font-size:12px;color:${C.muted};word-break:break-all;margin-bottom:16px;line-height:1.6}
.copy-btn{background:${C.accent};color:#fff;border:none;cursor:pointer;padding:10px 20px;border-radius:5px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:500;transition:all .18s;display:inline-flex;align-items:center;gap:7px}
.copy-btn:hover{background:#FF8C5A}
.copy-btn.copied{background:${C.green};color:#000}
.share-opt{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid ${C.border};border-radius:8px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.share-opt:hover{border-color:${C.accent};background:rgba(255,107,53,.08)}
.share-opt-icon{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.toggle-wrap{width:44px;height:24px;border-radius:12px;cursor:pointer;transition:background .2s;position:relative;flex-shrink:0}
.toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s}
.acc-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:14px 18px;border-radius:8px;transition:background .2s;user-select:none}
.acc-header:hover{background:${C.faint}}

/* Leaflet dark overrides */
.leaflet-container{background:#E8F4FD !important;font-family:'Nunito',sans-serif}
.leaflet-tile{filter:saturate(1.1) brightness(1.0)}
.leaflet-popup-content-wrapper{background:#FFFFFF;color:${C.text};border:1px solid ${C.border};border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.6)}
.leaflet-popup-tip{background:#FFFFFF}
.leaflet-popup-content{margin:12px 16px;font-family:'Nunito',sans-serif;font-size:13px}
.leaflet-control-zoom a{background:#FFFFFF !important;color:#1A1A2E !important;border-color:#FFE0B2 !important}
.leaflet-control-attribution{background:rgba(255,251,245,.9) !important;color:#8A7A6E !important;font-size:9px}
.leaflet-control-attribution a{color:${C.muted} !important}

/* ── MOBILE FIRST ── */
@media(max-width:640px){
  /* body */
  body{font-size:15px}

  /* header */
  header{padding:0 16px !important}
  header .logo-text{display:none}

  /* hero */
  [ref="topRef"]{padding:32px 16px 24px !important}
  h1{font-size:clamp(28px,8vw,42px) !important;letter-spacing:-1px !important}
  p{font-size:14px !important}

  /* body container */
  [style*="maxWidth:980"]{padding-left:16px !important;padding-right:16px !important}

  /* form grids - stack to single col */
  [style*="gridTemplateColumns:\"1fr 1fr\""]{grid-template-columns:1fr !important}
  [style*="gridTemplateColumns:'1fr 1fr'"]{grid-template-columns:1fr !important}

  /* arrival type buttons - wrap tightly */
  .arr-btn{min-width:64px !important;padding:10px 6px !important}
  .arr-btn .arr-icon{font-size:20px !important}
  .arr-btn .arr-label{font-size:9px !important}

  /* activity grid - full width cards */
  .act-card{padding:14px !important}

  /* hotel cards - full width */
  .hotel-card{margin-bottom:0}

  /* day cards */
  .day-head{padding:14px 16px !important}
  [style*="padding:\"16px 22px\""]{padding:14px 16px !important}

  /* transport badges */
  .transport-badge{flex-wrap:wrap;gap:8px !important}

  /* map */
  #wandr-map{height:300px !important}
  .map-legend{gap:10px !important}

  /* extras grid - stack */
  [style*="gridTemplateColumns:\"1fr 1fr\""]{grid-template-columns:1fr !important}

  /* chat panel - full width on mobile */
  .chat-panel{bottom:16px;right:12px}
  .chat-window{width:calc(100vw - 24px) !important;max-height:65vh !important}

  /* share modal */
  .modal{padding:20px !important;margin:12px !important}
  .modal-overlay{padding:12px !important}

  /* step bar */
  .steps{gap:0}
  .step-ln{width:28px !important}

  /* pricing extras */
  .price-card{padding:22px !important}

  /* action buttons */
  [style*="display:\"flex\",gap:10,flexWrap:\"wrap\""]{gap:8px !important}
  .btn-primary,.btn-outline{padding:12px 18px !important;font-size:14px !important}

  /* weather strip */
  .weather-day{min-width:68px !important;padding:10px 6px !important}
  .weather-icon{font-size:20px !important}

  /* step indicator text */
  [style*="fontSize:13"]{font-size:12px !important}

  /* hotel buttons stack */
  [style*="display:\"flex\",gap:8"]:has(a){flex-direction:column}
}

@media(max-width:480px){
  /* extra small - tighten further */
  h1{font-size:26px !important}
  .day-num{width:36px !important;height:36px !important;font-size:11px !important}
  .hotel-type-icon{width:40px !important;height:40px !important;font-size:18px !important}
  .tr-icon-wrap{width:38px !important;height:38px !important;font-size:17px !important}
  .arr-btn{min-width:56px !important}
  #wandr-map{height:260px !important}
  .chat-window{max-height:70vh !important}
}

/* touch targets - min 44px */
.btn,.btn-primary,.btn-outline,.btn-ghost,.btn-regen,.btn-add,.price-btn,
.arr-btn,.chip,.act-card,.share-opt,.faq-q{min-height:44px}
.inp,.sel,.edit-day-input,.chat-inp,.cta-input{min-height:48px;font-size:16px !important}

/* smooth scrolling on mobile */
@media(max-width:640px){
  .weather-strip{-webkit-overflow-scrolling:touch}
  .chat-messages{-webkit-overflow-scrolling:touch}
}
`;

/* ── CONSTANTS ── */
const VIBES = ["Culture & History","Food & Drink","Nature & Outdoors","Nightlife","Art & Museums","Hidden Gems","Local Markets","Architecture","Adventure Sports","Wellness & Spa"];
const PACES = [{v:"Relaxed",e:"☕"},{v:"Balanced",e:"⚖️"},{v:"Action-Packed",e:"⚡"}];
const BUDGETS = ["Budget-Friendly","Mid-Range","Splurge-Worthy"];
const ARRIVAL_TYPES = [
  {id:"airport",icon:"✈️",label:"Airport"},
  {id:"train",icon:"🚂",label:"Train Stn"},
  {id:"ferry",icon:"⛴️",label:"Ferry Port"},
  {id:"cruise",icon:"🛳️",label:"Cruise Port"},
  {id:"bus",icon:"🚌",label:"Bus Station"},
];
const HOTEL_TYPES = [
  {id:"any",label:"Any"},
  {id:"boutique",label:"Boutique"},
  {id:"hotel",label:"Hotel"},
  {id:"hostel",label:"Hostel"},
  {id:"apartment",label:"Apartment"},
  {id:"resort",label:"Resort"},
];

/* ── LEAFLET MAP COMPONENT ── */
function TripMap({ destination, hotels, activities, days }) {
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);
  const [filter, setFilter] = useState("all"); // all | hotels | activities
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => { setLoaded(true); };
      document.head.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || leafletRef.current) return;
    const L = window.L;

    // geocode destination to get center coords
    const geocode = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`);
        const data = await res.json();
        if (!data.length) return;
        const { lat, lon } = data[0];
        const map = L.map(mapRef.current, { zoomControl:true, attributionControl:true });
        leafletRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom:19
        }).addTo(map);

        map.setView([parseFloat(lat), parseFloat(lon)], 13);

        // Add hotel markers
        if (hotels?.length) {
          for (const h of hotels) {
            if (!h.lat || !h.lng) continue;
            const icon = L.divIcon({
              html:`<div style="background:${C.gold};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>`,
              iconSize:[14,14], iconAnchor:[7,7], className:""
            });
            L.marker([h.lat, h.lng], {icon}).addTo(map)
              .bindPopup(`<strong style="color:${C.gold}">🏨 ${h.name}</strong><br/><span style="color:${C.muted};font-size:11px">${h.type} · ${h.pricePerNight}/night</span>`);
          }
        }

        // Add activity markers from selected days
        const allActivities = activities || [];
        const colors = ["#E8642A","#4CAF7D","#4C8FCA","#9B7FE8","#E84C8C"];
        for (let di = 0; di < (days||[]).length; di++) {
          const day = days[di];
          const col = colors[di % colors.length];
          for (const act of (day.activities||[])) {
            if (!act.lat || !act.lng) continue;
            const icon = L.divIcon({
              html:`<div style="background:${col};width:11px;height:11px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>`,
              iconSize:[11,11], iconAnchor:[5.5,5.5], className:""
            });
            L.marker([act.lat, act.lng], {icon}).addTo(map)
              .bindPopup(`<strong>Day ${day.day}: ${act.name}</strong><br/><span style="color:${C.muted};font-size:11px">${act.time}</span>`);
          }
        }
      } catch(e) { console.error("Map error", e); }
    };
    geocode();

    return () => {
      if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }
    };
  }, [loaded, destination]);

  return (
    <div style={{marginBottom:40}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div className="sec-label">◆ Interactive Map</div>
        <div style={{display:"flex",gap:6"}}>
          {["all","hotels","activities"].map(f=>(
            <button key={f} className={`map-tab ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All Pins":f==="hotels"?"🏨 Hotels":"📍 Activities"}
            </button>
          ))}
        </div>
      </div>

      <div id="wandr-map" ref={mapRef}>
        {!loaded && (
          <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10,animation:"spin 2s linear infinite",display:"inline-block",color:C.accent}}>✦</div>
              <div style={{color:C.muted,fontSize:13}}>Loading map…</div>
            </div>
          </div>
        )}
      </div>

      <div className="map-legend">
        <div className="legend-item"><div className="legend-dot" style={{background:C.gold}}/> Hotels</div>
        {[["Day 1","#E8642A"],["Day 2","#4CAF7D"],["Day 3","#4C8FCA"],["Day 4","#9B7FE8"],["Day 5+","#E84C8C"]].map(([l,c])=>(
          <div key={l} className="legend-item"><div className="legend-dot" style={{background:c}}/>{l}</div>
        ))}
      </div>
    </div>
  );
}

/* ── ACCOMMODATION SECTION ── */
function AccommodationSection({ hotels, budget }) {
  const [open, setOpen] = useState(true);
  if (!hotels?.length) return null;

  const typeIcon = { boutique:"🏡", hotel:"🏨", hostel:"🛏", apartment:"🏠", resort:"🌴", guesthouse:"🏘" };

  return (
    <div style={{marginBottom:36}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div>
          <div className="sec-label" style={{marginBottom:4}}>◆ Where to Stay</div>
          <div style={{fontSize:13,color:C.muted}}>{hotels.length} hand-picked options · {budget}</div>
        </div>
        <span style={{color:C.muted,fontSize:18,transition:"transform .3s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
      </div>

      {open && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(280px,100%),1fr))",gap:16,animation:"slideDown .25s ease"}}>
          {hotels.map((h,i)=>(
            <div key={i} className={`hotel-card ${h.recommended?"recommended":""}`} style={{position:"relative"}}>
              {h.recommended && (
                <div className="hotel-badge" style={{background:C.gold,color:"#000"}}>★ Tripdippity Pick</div>
              )}

              {/* color band top */}
              <div style={{height:4,background: h.recommended ? `linear-gradient(90deg,${C.gold},${C.accent})` : C.faint}}/>

              <div style={{padding:"16px"}}>
                {/* header */}
                <div style={{display:"flex",gap:12,marginBottom:12,paddingTop: h.recommended?28:0}}>
                  <div className="hotel-type-icon" style={{background: h.recommended ? C.goldDim : C.accentDim}}>
                    {typeIcon[h.type?.toLowerCase()]||"🏨"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:15,lineHeight:1.3,marginBottom:3}}>{h.name}</div>
                    <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",letterSpacing:.5,textTransform:"uppercase"}}>{h.type} · {h.neighborhood}</div>
                  </div>
                </div>

                {/* rating + price */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="stars">{[1,2,3,4,5].map(s=><span key={s} style={{color:s<=Math.round(h.rating)?C.gold:C.faint,fontSize:11}}>★</span>)}</span>
                    <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:C.gold}}>{h.rating?.toFixed(1)}</span>
                    <span style={{fontSize:11,color:C.muted}}>({h.reviewCount?.toLocaleString()})</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:600,color: h.recommended?C.gold:C.text}}>{h.pricePerNight}</div>
                    <div style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>per night</div>
                  </div>
                </div>

                {/* description */}
                <p style={{fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:10}}>{h.description}</p>

                {/* amenities */}
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                  {(h.amenities||[]).slice(0,4).map((a,j)=>(
                    <span key={j} className="tag tag-gray" style={{fontSize:9}}>{a}</span>
                  ))}
                </div>

                {/* insider tip */}
                {h.tip && (
                  <div style={{fontSize:12,color:C.gold,fontStyle:"italic",display:"flex",gap:6,borderTop:`1px solid ${C.faint}`,paddingTop:10,marginBottom:12}}>
                    <span style={{flexShrink:0}}>★</span>{h.tip}
                  </div>
                )}

                {/* book buttons */}
                <div style={{display:"flex",gap:8}}>
                  {h.bookingLink && (
                    <a href={h.bookingLink} target="_blank" rel="noopener noreferrer"
                      style={{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 12px",background:C.accent,color:"#fff",textDecoration:"none",borderRadius:5,fontSize:12,fontWeight:500,transition:"all .2s"}}>
                      Book on Booking.com ↗
                    </a>
                  )}
                  {h.airbnbLink && (
                    <a href={h.airbnbLink} target="_blank" rel="noopener noreferrer"
                      style={{padding:"9px 12px",background:C.surface,color:C.muted,textDecoration:"none",borderRadius:5,fontSize:12,border:`1px solid ${C.border}`,transition:"all .2s"}}>
                      Airbnb ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── ARRIVAL GUIDE ── */
function ArrivalGuide({ data }) {
  const [open, setOpen] = useState(true);
  if (!data?.options?.length) return null;
  const badgeMap = {best:"tag-green",fastest:"tag-blue",comfort:"tag-purple"};
  const iconBg = {"🚇":"rgba(76,143,202,.15)","🚌":"rgba(201,168,76,.12)","🚖":"rgba(232,100,42,.12)","🚗":"rgba(232,100,42,.12)","🚐":"rgba(155,127,232,.15)","🛺":"rgba(76,175,125,.12)"};
  return (
    <div style={{marginBottom:28,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
      <div className="acc-header" onClick={()=>setOpen(o=>!o)}
        style={{background:"linear-gradient(120deg,rgba(124,92,252,.08),rgba(255,60,172,.04))",borderBottom:open?`1px solid ${C.border}`:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22}}>{data.terminalIcon||"🗺️"}</span>
          <div>
            <div className="sec-label" style={{marginBottom:2,color:C.blue}}>◆ Arrival Guide</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:17,fontWeight:700}}>{data.terminalName}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>{data.terminalNote}</div>
          </div>
        </div>
        <span style={{color:C.muted,fontSize:16,transition:"transform .3s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
      </div>
      {open && (
        <div style={{padding:"18px 18px 6px",animation:"slideDown .2s ease"}}>
          {data.recommendedOption && (
            <div style={{background:"rgba(76,175,125,.08)",border:"1px solid rgba(76,175,125,.25)",borderRadius:8,padding:"11px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:18}}>★</span>
              <div>
                <div style={{fontSize:11,color:C.green,fontFamily:"'DM Mono',monospace",letterSpacing:.5,marginBottom:2}}>TRIPDIPPITY RECOMMENDS</div>
                <div style={{fontSize:13,color:C.text}}>{data.recommendedOption}</div>
              </div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {data.options.map((opt,i)=>(
              <div key={i} className={`tr-option ${opt.badge||""}`}>
                <div className="tr-icon-wrap" style={{background:iconBg[opt.icon]||C.accentDim}}>{opt.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                    <span style={{fontWeight:600,fontSize:14}}>{opt.mode}</span>
                    {opt.badge && <span className={`tag ${badgeMap[opt.badge]||"tag-gray"}`}>{opt.badge==="best"?"★ Best Value":opt.badge==="fastest"?"⚡ Fastest":"✦ Most Comfort"}</span>}
                  </div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontSize:12,color:C.muted}}>💰 {opt.cost}</span>
                    <span style={{fontSize:12,color:C.muted}}>⏱ {opt.duration}</span>
                    {opt.frequency && <span style={{fontSize:12,color:C.muted}}>🔁 {opt.frequency}</span>}
                  </div>
                  <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:opt.tip?6:0}}>{opt.description}</div>
                  {opt.tip && <div style={{fontSize:11,color:C.gold,fontStyle:"italic",display:"flex",gap:5}}><span style={{flexShrink:0}}>★</span>{opt.tip}</div>}
                </div>
                {opt.bookingLink && <a href={opt.bookingLink} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.accent,textDecoration:"none",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",alignSelf:"flex-start",marginTop:3}}>Book ↗</a>}
              </div>
            ))}
          </div>
          {data.extraNotes && <div style={{background:C.surface,borderRadius:6,padding:"11px 14px",marginBottom:14,fontSize:12,color:C.muted,lineHeight:1.7,border:`1px solid ${C.border}`}}>📋 {data.extraNotes}</div>}
        </div>
      )}
    </div>
  );
}

/* ── WEATHER COMPONENT ── */
function WeatherStrip({ destination, days, travelDate }) {
  const [weather, setWeather]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [open,    setOpen]      = useState(true);

  useEffect(() => {
    if (!destination || !days) return;
    setLoading(true);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const prompt = `You are a weather expert. Provide a realistic day-by-day weather forecast for a ${days}-day trip to ${destination}, starting roughly ${months[now.getMonth()]} ${now.getFullYear()}.
Return ONLY valid JSON:
{"city":"City Name","country":"Country",
"days":[{"dayNum":1,"label":"Day 1","weekday":"Mon","high":24,"low":17,"condition":"Partly Cloudy","icon":"⛅","rainChance":20,"uvIndex":6,"tip":"One practical weather tip"}]}
Use realistic seasonal temperatures for ${destination}. Vary conditions naturally. ${days} day objects total.`;
    fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]})})
      .then(r=>r.json())
      .then(d=>{
        const parsed = JSON.parse((d.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
        setWeather(parsed);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [destination, days]);

  if (loading) return (
    <div style={{marginBottom:32,background:"#FFF8EE",border:"1px solid #FFE0B2",borderRadius:10,padding:"18px 20px",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:16,height:16,border:`2px solid ${C.border}`,borderTopColor:C.blue,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <span style={{fontSize:13,color:C.muted}}>Loading weather forecast…</span>
    </div>
  );
  if (!weather) return null;

  const condColor = c => {
    if (!c) return C.muted;
    const l = c.toLowerCase();
    if (l.includes("sun")||l.includes("clear")) return "#F5C842";
    if (l.includes("rain")||l.includes("storm")||l.includes("shower")) return C.blue;
    if (l.includes("cloud")||l.includes("over")) return C.muted;
    if (l.includes("snow")) return "#B0D4F1";
    return C.muted;
  };

  return (
    <div style={{marginBottom:32,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
      <div style={{padding:"14px 20px",borderBottom:open?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:"linear-gradient(120deg,rgba(76,143,202,.08),transparent)"}}
        onClick={()=>setOpen(o=>!o)}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🌤</span>
          <div>
            <div className="sec-label" style={{color:C.blue,marginBottom:2}}>◆ Weather Forecast</div>
            <div style={{fontSize:12,color:C.muted}}>{weather.city}, {weather.country} · {days}-day outlook</div>
          </div>
        </div>
        <span style={{color:C.muted,fontSize:16,transition:"transform .3s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
      </div>
      {open && (
        <div style={{animation:"slideDown .2s ease"}}>
          <div className="weather-strip">
            {weather.days?.map((d,i)=>(
              <div key={i} className="weather-day">
                <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{d.weekday||`Day ${d.dayNum}`}</div>
                <span className="weather-icon">{d.icon}</span>
                <div className="weather-temp">{d.high}°</div>
                <div className="weather-lo">{d.low}°</div>
                <div className="weather-cond" style={{color:condColor(d.condition),fontSize:9,marginTop:3}}>{d.condition}</div>
                {d.rainChance>30&&<div style={{fontSize:9,color:C.blue,marginTop:3,fontFamily:"'DM Mono',monospace"}}>💧{d.rainChance}%</div>}
              </div>
            ))}
          </div>
          {/* best/worst day tips */}
          {weather.days?.length>0 && (
            <div style={{padding:"10px 20px 14px",borderTop:`1px solid ${C.faint}`,display:"flex",gap:10,flexWrap:"wrap"}}>
              {(() => {
                const best  = weather.days.reduce((a,b)=>b.high>a.high?b:a, weather.days[0]);
                const rainy = weather.days.find(d=>d.rainChance>=50);
                return <>
                  <div style={{fontSize:12,color:C.gold,display:"flex",gap:5}}>
                    <span>☀️</span><span>Best day: <strong>{best.weekday||`Day ${best.dayNum}`}</strong> — {best.high}° and {best.condition?.toLowerCase()}</span>
                  </div>
                  {rainy && <div style={{fontSize:12,color:C.blue,display:"flex",gap:5}}>
                    <span>🌂</span><span>Pack an umbrella for <strong>{rainy.weekday||`Day ${rainy.dayNum}`}</strong> ({rainy.rainChance}% rain chance)</span>
                  </div>}
                </>;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── TRIP CHAT ── */
function TripChat({ itinerary, form }) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {role:"ai", text:`Hi! I'm your Tripdippity assistant for ${itinerary?.destination||"your trip"}. Ask me anything — best restaurants, what to wear, local customs, hidden gems, safety tips, or anything else. I know your itinerary inside and out. 🗺️`}
  ]);
  const [input,    setInput]    = useState("");
  const [thinking, setThinking] = useState(false);
  const msgEndRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(()=>{ msgEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages, thinking]);
  useEffect(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(), 200); },[open]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || thinking) return;
    setMessages(m=>[...m, {role:"user",text:q}]);
    setInput("");
    setThinking(true);

    const context = `You are a knowledgeable knowledgeable travel assistant for Tripdippity. The traveler is on a ${form.days}-day trip to ${itinerary?.destination}.
Itinerary summary: ${itinerary?.days?.map(d=>`Day ${d.day}: ${d.theme} in ${d.neighborhood}`).join("; ")}.
Budget: ${form.budget}. Pace: ${form.pace}.
Be concise, friendly and specific to their destination. 2-4 sentences max per reply. No bullet points.`;

    try {
      const history = messages.filter(m=>m.role!=="ai"||messages.indexOf(m)>0).map(m=>({
        role: m.role==="user"?"user":"assistant",
        content: m.text
      }));
      const res  = await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:300,system:context,messages:[...history,{role:"user",content:q}]})});
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get an answer. Try again!";
      setMessages(m=>[...m, {role:"ai",text:reply}]);
    } catch(e) {
      setMessages(m=>[...m, {role:"ai",text:"Something went wrong — please try again."}]);
    } finally { setThinking(false); }
  }

  const quickQs = ["Best restaurant tonight?","What to wear tomorrow?","Is it safe to walk at night?","Hidden gems nearby?","Best local dish to try?"];

  return (
    <div className="chat-panel">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>✦</span>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>Tripdippity Assistant</div>
                <div style={{fontSize:10,color:C.green,fontFamily:"'DM Mono',monospace",letterSpacing:.5}}>● ● Online · Ask anything about your trip</div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18,lineHeight:1,padding:"2px 6px"}}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m,i)=>(
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
            {thinking && (
              <div className="msg typing">
                <div className="typing-dots">
                  <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                </div>
              </div>
            )}
            <div ref={msgEndRef}/>
          </div>

          {/* quick questions */}
          {messages.length<=1 && (
            <div style={{padding:"0 12px 10px",display:"flex",gap:6,flexWrap:"wrap"}}>
              {quickQs.map(q=>(
                <span key={q} style={{fontSize:11,color:C.accent,cursor:"pointer",padding:"4px 9px",border:`1px solid ${C.accentBorder}`,borderRadius:20,background:C.accentDim,transition:"all .15s",whiteSpace:"nowrap"}}
                  onClick={()=>{setInput(q);setTimeout(()=>inputRef.current?.focus(),50);}}>
                  {q}
                </span>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input ref={inputRef} className="chat-inp" placeholder="Ask anything about your trip…"
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!thinking&&sendMessage()}/>
            <button className="chat-send" disabled={!input.trim()||thinking} onClick={sendMessage}>↑</button>
          </div>
        </div>
      )}
      <button className="chat-bubble-btn" onClick={()=>setOpen(o=>!o)} title="Ask Tripdippity Assistant">
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

/* ── SHARE MODAL ── */
function ShareModal({ itinerary, form, onClose }) {
  const [copied, setCopied] = useState(false);

  // Build a human-readable shareable summary encoded in the URL hash
  const shareData = encodeURIComponent(JSON.stringify({
    dest: itinerary?.destination,
    days: form.days,
    budget: form.budget,
    pace: form.pace,
    tagline: itinerary?.tagline,
  }));
  const shareUrl = `${window.location.origin}${window.location.pathname}#trip=${shareData}`;

  const shortUrl = `tripdippity.app/t/${Math.random().toString(36).slice(2,8).toUpperCase()}`;

  function copyLink() {
    navigator.clipboard.writeText(shortUrl).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    });
  }

  const shareOptions = [
    { icon:"📧", label:"Email itinerary", sub:"Send to your travel companions", bg:"rgba(232,100,42,.12)", action:()=>window.open(`mailto:?subject=Our trip to ${itinerary?.destination}&body=Check out our Tripdippity itinerary: ${shortUrl}`) },
    { icon:"💬", label:"WhatsApp", sub:"Share with your group chat", bg:"rgba(76,175,125,.12)", action:()=>window.open(`https://wa.me/?text=Check out our trip to ${itinerary?.destination}! ${shortUrl}`) },
    { icon:"🐦", label:"Share on X / Twitter", sub:"Let your followers know", bg:"rgba(76,143,202,.12)", action:()=>window.open(`https://twitter.com/intent/tweet?text=I just planned my trip to ${itinerary?.destination} with @tripdippity_app — try it free!&url=${shortUrl}`) },
    { icon:"⬇️", label:"Download as PDF", sub:"Save a copy for offline use", bg:"rgba(201,168,76,.12)", action:()=>window.print() },
  ];

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:20}}>✕</button>

        <div className="sec-label" style={{marginBottom:8}}>◆ Share Your Trip</div>
        <h3 style={{fontFamily:"'Fredoka One',cursive",fontSize:26,fontWeight:700,marginBottom:4}}>{itinerary?.destination}</h3>
        <p style={{fontSize:13,color:C.muted,marginBottom:24}}>{form.days} days · {form.budget} · {form.pace}</p>

        {/* link box */}
        <label className="lbl">Your trip link</label>
        <div className="share-link-box">{shortUrl}</div>
        <div style={{display:"flex",gap:10,marginBottom:28}}>
          <button className={`copy-btn ${copied?"copied":""}`} onClick={copyLink} style={{flex:1,justifyContent:"center"}}>
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </button>
        </div>

        {/* share options */}
        <label className="lbl" style={{marginBottom:12}}>Share via</label>
        {shareOptions.map(opt=>(
          <div key={opt.label} className="share-opt" onClick={opt.action}>
            <div className="share-opt-icon" style={{background:opt.bg}}>{opt.icon}</div>
            <div>
              <div style={{fontWeight:500,fontSize:14}}>{opt.label}</div>
              <div style={{fontSize:12,color:C.muted}}>{opt.sub}</div>
            </div>
            <span style={{marginLeft:"auto",color:C.muted,fontSize:14}}>↗</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function Stars({rating}){return(<span className="stars">{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(rating)?C.gold:C.faint}}>★</span>)}</span>);}
function StepBar({step}){
  const labels=["Trip Details","Choose Activities","Your Itinerary"];
  return(
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:40,flexWrap:"wrap"}}>
      <div className="steps">
        {[1,2,3].map((n,i)=>(
          <div key={n} style={{display:"flex",alignItems:"center"}}>
            <div className={`step-d ${n<step?"done":n===step?"active":"idle"}`}>{n<step?"✓":n}</div>
            {i<2&&<div className={`step-ln ${n<step?"done":""}`}/>}
          </div>
        ))}
      </div>
      <span style={{color:C.muted,fontSize:13}}>{labels[step-1]}</span>
    </div>
  );
}

/* ── MAIN APP ── */
export default function TripdippityApp() {
  const [step,      setStep]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [loadMsg,   setLoadMsg]   = useState("");
  const [error,     setError]     = useState(null);
  const [form, setForm] = useState({
    destination:"", days:"5", budget:"Mid-Range", pace:"Balanced",
    vibes:[], notes:"", multiCity:false, cities:"",
    arrivalType:"airport", arrivalPoint:"", hotelType:"any"
  });
  const [activities, setActivities] = useState([]);
  const [selected,   setSelected]   = useState(new Set());
  const [itinerary,  setItinerary]  = useState(null);
  const [arrival,    setArrival]    = useState(null);
  const [hotels,     setHotels]     = useState([]);
  const [showShare,  setShowShare]  = useState(false);

  // Food Finder section state
  const [foodOpen,    setFoodOpen]    = useState(false);
  const [foodMeal,    setFoodMeal]    = useState("dinner"); // breakfast|lunch|dinner
  const [foodSpectrum,setFoodSpectrum]= useState("mix");    // mix|locals|iconic|hidden|new
  const [foodResults, setFoodResults] = useState(null);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError,   setFoodError]   = useState(null);

  const topRef       = useRef(null);
  const resultRef    = useRef(null);
  const searchInputRef = useRef(null);

  const [customQuery,  setCustomQuery]  = useState("");
  const [addingCustom, setAddingCustom] = useState(false);
  const [customError,  setCustomError]  = useState("");

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleVibe = v => setF("vibes", form.vibes.includes(v)?form.vibes.filter(x=>x!==v):[...form.vibes,v]);
  const toggleSel  = id => setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const catColor   = cat => ({Culture:"#C9A84C",Food:"#E8642A",Nature:"#4CAF7D",Nightlife:"#9B7FE8",Art:"#E84C8C",Adventure:"#E8642A",Wellness:"#4CA8C9",Shopping:"#7FE8C9",History:"#C9A84C",Local:"#8CE84C"})[cat]||C.muted;
  const txIcon     = mode => ({Train:"🚂",Flight:"✈️",Bus:"🚌",Ferry:"⛴️"})[mode]||"🚗";

  function removeActivity(id) {
    setActivities(prev => prev.filter(a => a.id !== id));
    setSelected(s => { const n = new Set(s); n.delete(id); return n; });
  }

  async function addCustomActivity() {
    const q = customQuery.trim();
    if (!q) return;
    setAddingCustom(true);
    setCustomError("");
    const dest = form._destFull || form.destination;
    const prompt = `A traveler to ${dest} wants to add this to their itinerary: "${q}".
Generate a full activity card for it, made specific to ${dest} if the query is vague.
Return ONLY valid JSON — a single activity object:
{
  "id":"custom_1","name":"Specific name","category":"Culture|Food|Nature|Nightlife|Art|Adventure|Wellness|Shopping|History|Local",
  "emoji":"single emoji","rating":4.5,"reviewCount":780,"duration":"2 hours","priceRange":"Free|$|$$|$$$|$$$$",
  "description":"Two vivid sentences specific to ${dest}.","insiderTip":"One local tip.",
  "bestTime":"Morning|Afternoon|Evening|Anytime","mustTry":false,"custom":true,
  "bookingLink":"https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}"
}
Rating must be 3.8–4.9. Tailor entirely to ${dest}.`;
    try {
      const res  = await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const data = await res.json();
      const text = (data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(text);
      parsed.id = "custom_" + Date.now();
      parsed.custom = true;
      setActivities(prev => [parsed, ...prev]);
      setSelected(s => new Set([...s, parsed.id]));
      setCustomQuery("");
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } catch(e) {
      setCustomError("Couldn't add that — try being more specific.");
    } finally {
      setAddingCustom(false);
    }
  }

  const [editingDay,    setEditingDay]    = useState(null); // day number being edited
  const [editDayNote,   setEditDayNote]   = useState("");   // user instruction
  const [regenDayIdx,   setRegenDayIdx]   = useState(null); // which idx is regenerating
  const [updatedDays,   setUpdatedDays]   = useState(new Set()); // flash highlight

  /* ── REGENERATE A SINGLE DAY ── */
  async function regenerateDay(day, idx) {
    if (!editDayNote.trim() && editingDay === day.day) {
      // no note — just close panel
      setEditingDay(null); return;
    }
    setRegenDayIdx(idx);
    const dest = itinerary?.destination || form._destFull || form.destination;
    const note = editDayNote.trim() || "Give it a completely fresh feel with different activities";
    const otherDays = itinerary.days.filter((_,i)=>i!==idx).map(d=>`Day ${d.day}: ${d.theme} (${d.neighborhood})`).join(", ");

    const prompt = `You are a travel planner regenerating Day ${day.day} of a ${form.days}-day itinerary for ${dest}.

Current Day ${day.day} theme: "${day.theme}" in ${day.neighborhood}.
Other days in the trip: ${otherDays}.
User instruction: "${note}"
Budget: ${form.budget}. Pace: ${form.pace}.

Create a FRESH Day ${day.day} that avoids repeating what's on other days.

For meals: give 3 honest options per meal (breakfast, lunch, dinner). Be HONEST — use the "label" field truthfully: "iconic" (famous, worth the hype), "tourist-good" (touristy but legitimately enjoyable), "mixed" (mixed reputation, see caveat), "locals" (where actual locals eat), or "hidden" (lesser-known gem). Each option needs a "caveat" — an honest note (e.g. "Long lines, go before 11am"). If unsure about specific restaurants, use generic guidance (e.g. "Any bakery on Rue Cler") rather than inventing names.

Return ONLY valid JSON — a single day object:
{
  "day": ${day.day},
  "theme": "New theme title",
  "neighborhood": "Area of the city",
  "activities": [
    {"time":"9:00 AM","name":"Name","description":"Two vivid sentences.","tip":"Insider tip.","cost":"Free|$|$$|$$$","lat":0.0,"lng":0.0}
  ],
  "breakfast":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest note","priceLevel":"$|$$|$$$","area":"neighborhood"}],
  "lunch":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest note","priceLevel":"$|$$|$$$","area":"neighborhood"}],
  "dinner":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest note","priceLevel":"$|$$|$$$","area":"neighborhood"}]
}
Each meal array must have exactly 3 entries with varied labels. Include 3–5 activities spaced through the day. Tailor to the user's instruction.`;

    try {
      const res  = await fetch("/.netlify/functions/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{role:"user", content:prompt}] })
      });
      const data = await res.json();
      const text = (data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      const newDay = JSON.parse(text);
      setItinerary(prev => ({
        ...prev,
        days: prev.days.map((d,i) => i===idx ? newDay : d)
      }));
      setUpdatedDays(s => new Set([...s, idx]));
      setTimeout(() => setUpdatedDays(s => { const n=new Set(s); n.delete(idx); return n; }), 2000);
      setEditingDay(null);
      setEditDayNote("");
    } catch(e) {
      // silent fail — keep existing day
    } finally {
      setRegenDayIdx(null);
    }
  }

  /* ── STEP 1 → 2 ── */
  async function fetchActivities() {
    if (!form.destination.trim()) return;
    setLoading(true); setError(null);
    setLoadMsg("Discovering top experiences in "+form.destination+"…");
    const prompt=`Generate exactly 14 must-do activities for ${form.destination}. Interests: ${form.vibes.length?form.vibes.join(", "):"general travel"}. Budget: ${form.budget}.
Return ONLY valid JSON:
{"destination":"City, Country","heroFact":"surprising fact","activities":[{"id":"a1","name":"Name","category":"Culture|Food|Nature|Nightlife|Art|Adventure|Wellness|Shopping|History|Local","emoji":"🏛","rating":4.7,"reviewCount":2840,"duration":"2-3 hours","priceRange":"Free|$|$$|$$$|$$$$","description":"Two vivid sentences.","insiderTip":"Local tip.","bestTime":"Morning|Afternoon|Evening|Anytime","mustTry":true,"bookingLink":"https://www.getyourguide.com/s/?q=${encodeURIComponent(form.destination)}"}]}
Ratings 3.8-4.9. Mark 3-4 mustTry:true.`;
    try {
      const res=await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:3000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const parsed=JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      setActivities(parsed.activities||[]);
      setForm(f=>({...f,_destFull:parsed.destination,_heroFact:parsed.heroFact}));
      setSelected(new Set(parsed.activities.filter(a=>a.mustTry).map(a=>a.id)));
      setStep(2);
      setTimeout(()=>topRef.current?.scrollIntoView({behavior:"smooth"}),100);
    } catch(e){setError("Couldn't load activities. Please try again.");}
    finally{setLoading(false);}
  }

  /* ── FOOD FINDER (on-demand) ── */
  async function fetchFoodFinder(meal, spectrum) {
    const dest = itinerary?.destination || form._destFull || form.destination;
    if (!dest) return;
    setFoodLoading(true); setFoodError(null); setFoodResults(null);

    const spectrumGuide = {
      mix:    "Give a balanced mix — 1-2 iconic spots, 1-2 locals picks, 1 hidden gem.",
      locals: "Focus on places where actual locals eat. Avoid tourist-heavy spots. Use 'locals' label for most.",
      iconic: "Focus on the famous, must-try spots. Use 'iconic' label for most. Be honest about which are worth the hype.",
      hidden: "Focus on lesser-known gems and neighborhood spots most travelers miss. Use 'hidden' label for most.",
      new:    "Focus on newer, recently-opened spots from the last 2-3 years. NOTE in caveat that knowledge may be outdated."
    };

    const prompt = `Find 5 ${meal} options for ${dest}.

${spectrumGuide[spectrum] || spectrumGuide.mix}

Be HONEST. Use the "label" field truthfully:
- "iconic" = famous and worth the hype
- "tourist-good" = touristy but legitimately enjoyable
- "mixed" = mixed reputation, see caveat
- "locals" = where actual locals eat
- "hidden" = lesser-known gem

Each option needs a "caveat" — an honest warning or note (e.g. "Long lines, go before 11am" or "Overpriced for the food, but the view is the point"). For "${meal}" specifically, think about what's appropriate for that meal in ${dest}.

If you're not confident about specific restaurants in ${dest}, use generic but specific guidance (e.g. "Any cafe on Rue Cler" or "Bakeries near the train station") rather than inventing names. Note this in the caveat field.

Return ONLY valid JSON:
{"meal":"${meal}","destination":"${dest}","spectrum":"${spectrum}","results":[
  {"name":"Place name","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest note","priceLevel":"$|$$|$$$","area":"neighborhood","reviewSummary":"Two-sentence honest summary of what people actually say about this place — pros AND cons."}
]}
Exactly 5 results.`;

    try {
      const res = await fetch("/.netlify/functions/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2500,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      setFoodResults(parsed);
    } catch(e) {
      setFoodError("Couldn't load food picks. Please try again.");
    } finally {
      setFoodLoading(false);
    }
  }

  /* ── STEP 2 → 3 ── */
  async function generateItinerary() {
    const picked=activities.filter(a=>selected.has(a.id));
    if (!picked.length) return;
    setLoading(true); setError(null);
    setLoadMsg("Building itinerary, finding hotels & mapping your trip…");

    const dest = form._destFull||form.destination;
    const actList = picked.map(a=>`${a.name} (${a.category}, ${a.duration}, ${a.priceRange})`).join("\n");
    const arrivalLabel = ARRIVAL_TYPES.find(t=>t.id===form.arrivalType)?.label||"Airport";
    const arrPoint = form.arrivalPoint||dest;

    const itinPrompt=`Create a ${form.days}-day itinerary for ${dest}.
Activities to include: ${actList}
Prefer TRAIN over flight for journeys under 3h. Budget: ${form.budget}. Pace: ${form.pace}. Notes: ${form.notes||"None"}.
${form.multiCity&&form.cities?"Also visiting: "+form.cities:""}
For EACH activity include approximate lat/lng coordinates for ${dest} so they can be mapped.

For meals: give 3 honest options per meal (breakfast, lunch, dinner) per day. Be HONEST about what each option is — don't make every place sound amazing. Use the "label" field to tell the truth: "iconic" (famous, worth the hype), "tourist-good" (touristy but legitimately enjoyable), "mixed" (mixed reputation, see caveat), "locals" (where actual locals eat), or "hidden" (lesser-known gem). Each option needs a "caveat" field — an honest warning or note (e.g. "Long lines, go before 11am" or "Overpriced for the food, but the view is the point" or "Cash only, no English menu"). If you're not confident about specific restaurants in this destination, use generic but specific guidance (e.g. "Any cafe on Rue Cler" or "Look for places with handwritten menus on Calle Genova") rather than inventing names.

Return ONLY valid JSON:
{"destination":"City, Country","tagline":"line","bestTime":"str","currency":"str","language":"str",
"transport":[{"from":"A","to":"B","recommended":"Train|Flight|Bus|Ferry","reason":"why","duration":"2h","approxCost":"$25-45","operator":"Name","bookingLink":"https://www.omio.com"}],
"days":[{"day":1,"theme":"title","neighborhood":"area","activities":[{"time":"9:00 AM","name":"Name","description":"2 sentences","tip":"tip","cost":"Free|$|$$|$$$","lat":48.8566,"lng":2.3522}],
"breakfast":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest warning or note","priceLevel":"$|$$|$$$","area":"neighborhood"}],
"lunch":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest warning or note","priceLevel":"$|$$|$$$","area":"neighborhood"}],
"dinner":[{"name":"Place","dish":"What to order","label":"iconic|tourist-good|mixed|locals|hidden","caveat":"honest warning or note","priceLevel":"$|$$|$$$","area":"neighborhood"}]}],
"packingTips":["tip1","tip2","tip3"],"localPhrases":[{"phrase":"word","meaning":"english"}]}
Each meal array must have exactly 3 entries. Vary the labels — don't make all 3 "iconic" for one meal. Mix in "locals" and "hidden" picks.`;

    const hotelPrompt=`You are a hotel expert. Suggest 6 diverse accommodation options for ${dest}.
Type preference: ${form.hotelType==="any"?"any mix":form.hotelType}. Budget: ${form.budget}.
Include approximate lat/lng for each so they can be pinned on a map.
Return ONLY valid JSON:
{"hotels":[{
  "name":"Hotel Name","type":"Boutique|Hotel|Hostel|Apartment|Resort|Guesthouse",
  "neighborhood":"area name","rating":4.5,"reviewCount":1240,
  "pricePerNight":"$120–$160","description":"Two sentences on why it's great.",
  "amenities":["Free WiFi","Breakfast","Rooftop Bar","Pool"],
  "tip":"One insider tip about this property.",
  "recommended":true,
  "lat":48.8566,"lng":2.3522,
  "bookingLink":"https://www.booking.com/searchresults.html?ss=${encodeURIComponent(dest)}",
  "airbnbLink":"https://www.airbnb.com/s/${encodeURIComponent(dest)}/homes"
}]}
Mark exactly 1 as recommended:true (Tripdippity Pick). Vary types and price ranges. Tailor to ${dest}.`;

    const arrivalPrompt=`Travel logistics for arriving at ${arrPoint} by ${arrivalLabel}, heading to ${dest} city centre.
Return ONLY valid JSON:
{"terminalName":"Full terminal name","terminalIcon":"emoji","terminalNote":"orientation note","recommendedOption":"one sentence recommendation","extraNotes":"practical note",
"options":[{"mode":"Metro","icon":"🚇","cost":"$4-6","duration":"35 min","frequency":"Every 10 min","description":"Two sentences.","tip":"Insider tip.","badge":"best","bookingLink":null}]}
badge: "best"|"fastest"|"comfort"|null. One badge per option max. 5 options total.`;

    try {
      const [itinRes, hotelRes, arrRes] = await Promise.all([
        fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:5000,messages:[{role:"user",content:itinPrompt}]})}),
        fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2500,messages:[{role:"user",content:hotelPrompt}]})}),
        fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,messages:[{role:"user",content:arrivalPrompt}]})})
      ]);
      const [itinData, hotelData, arrData] = await Promise.all([itinRes.json(), hotelRes.json(), arrRes.json()]);
      const itinParsed  = JSON.parse((itinData.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      const hotelParsed = JSON.parse((hotelData.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      const arrParsed   = JSON.parse((arrData.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
      setItinerary(itinParsed);
      setHotels(hotelParsed.hotels||[]);
      setArrival(arrParsed);
      setStep(3);
      setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth"}),100);
    } catch(e){setError("Couldn't build itinerary. Please try again.");}
    finally{setLoading(false);}
  }

  const resetAll = () => {setStep(1);setItinerary(null);setArrival(null);setHotels([]);setActivities([]);setSelected(new Set());};

  /* ── RENDER ── */
  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="grid-bg"/><div className="grain"/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh"}}>

        {/* HEADER */}
        <header style={{borderBottom:`1px solid ${C.border}`,padding:"0 clamp(16px,3vw,32px)",position:"sticky",top:0,background:`${C.bg}f0`,backdropFilter:"blur(20px)",zIndex:100}}>
          <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={resetAll}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px rgba(255,107,53,0.4)`,flexShrink:0}}>
                <span style={{color:"#fff",fontSize:18,fontFamily:"'Fredoka One',cursive"}}>T</span>
              </div>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:22,background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>tripdippity</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",textTransform:"uppercase",color:C.accent,background:"rgba(255,107,53,0.1)",border:`1px solid rgba(255,107,53,0.3)`,padding:"4px 12px",borderRadius:20}}>✦ AI Travel</span>
              {step>1&&<button className="btn btn-ghost" onClick={resetAll}>← Start over</button>}
            </div>
          </div>
        </header>

        {/* HERO */}
        <div ref={topRef} style={{padding:"clamp(28px,5vw,52px) clamp(16px,3vw,32px) clamp(24px,4vw,40px)",borderBottom:`1px solid ${C.border}`,position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#FFFBF5 0%,#FFF0E5 60%,#FFF5FB 100%)"}}>
          <div style={{position:"absolute",left:-100,top:-80,width:500,height:500,background:"radial-gradient(circle,rgba(255,107,53,0.15) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",right:-80,top:0,width:400,height:400,background:"radial-gradient(circle,rgba(255,60,172,0.1) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-60,left:"40%",width:350,height:350,background:"radial-gradient(circle,rgba(124,92,252,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{maxWidth:980,margin:"0 auto",position:"relative"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.2)",borderRadius:20,padding:"6px 14px",marginBottom:16}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite",flexShrink:0}}/>
              <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:"1.5px",textTransform:"uppercase",color:C.accent}}>
                {step===1&&"Your AI Travel Companion"}
                {step===2&&"Step 2 — Pick Your Adventures"}
                {step===3&&"Your Itinerary Is Ready 🎉"}
              </span>
            </div>
            <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(32px,6vw,64px)",lineHeight:1.08,letterSpacing:"-1px",marginBottom:16,maxWidth:640}}>
              {step===1&&<>Where are you<br/><span style={{background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>dipping in next? 🗺️</span></>}
              {step===2&&<>Pick the experiences<br/><span style={{background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>that excite you! ⭐</span></>}
              {step===3&&<>Your adventure<br/><span style={{background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>is all planned! ✈️</span></>}
            </h1>
            <p style={{color:C.muted,fontSize:16,lineHeight:1.75,maxWidth:480}}>
              {step===1&&"Tell us your destination, how you're arriving, and your style. Tripdippity does the rest — hotels, activities, maps, weather and more. No tour company needed."}
              {step===2&&`We found ${activities.length} amazing experiences in ${form._destFull||form.destination}. Pick the ones that excite you and we'll weave them into your perfect trip.`}
              {step===3&&`Your ${form.days}-day adventure in ${itinerary?.destination} is ready — packed with activities, hotels, arrival tips, a live map and your day-by-day plan.`}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div style={{maxWidth:980,margin:"0 auto",padding:"clamp(24px,4vw,40px) clamp(16px,3vw,32px) 80px"}}>

          {/* ════ STEP 1 ════ */}
          {step===1&&!loading&&(
            <div className="anim-fadeup">
              <StepBar step={1}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label className="lbl">Destination *</label>
                  <input className="inp" placeholder="Paris, Tokyo, New York, Bali, Marrakech…"
                    value={form.destination} onChange={e=>setF("destination",e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&form.destination&&fetchActivities()}/>
                </div>
                <div>
                  <label className="lbl">Duration</label>
                  <div style={{position:"relative"}}>
                    <select className="inp sel" value={form.days} onChange={e=>setF("days",e.target.value)}>
                      {[1,2,3,4,5,6,7,10,14].map(d=><option key={d} value={d}>{d} {d===1?"Day":"Days"}</option>)}
                    </select>
                    <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.muted,pointerEvents:"none"}}>▾</span>
                  </div>
                </div>
                <div>
                  <label className="lbl">Budget</label>
                  <div style={{position:"relative"}}>
                    <select className="inp sel" value={form.budget} onChange={e=>setF("budget",e.target.value)}>
                      {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                    <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.muted,pointerEvents:"none"}}>▾</span>
                  </div>
                </div>
              </div>

              {/* ARRIVAL */}
              <div style={{marginBottom:22,padding:"18px",border:`1px solid ${C.border}`,borderRadius:8,background:C.surface}}>
                <label className="lbl" style={{marginBottom:12}}>How are you arriving?</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                  {ARRIVAL_TYPES.map(t=>(
                    <button key={t.id} className={`arr-btn ${form.arrivalType===t.id?"on":""}`} onClick={()=>setF("arrivalType",t.id)}>
                      <span className="arr-icon">{t.icon}</span>
                      <span className="arr-label">{t.label}</span>
                    </button>
                  ))}
                </div>
                <input className="inp" placeholder={form.arrivalType==="airport"?"e.g. Heathrow T3, Charles de Gaulle, JFK…":form.arrivalType==="train"?"e.g. Roma Termini, Gare du Nord…":"Terminal or port name (optional)"}
                  value={form.arrivalPoint} onChange={e=>setF("arrivalPoint",e.target.value)}/>
                <div style={{marginTop:8,fontSize:11,color:C.muted}}>💡 We'll show you exactly how to get from here to your hotel.</div>
              </div>

              {/* ACCOMMODATION TYPE */}
              <div style={{marginBottom:22,padding:"18px",border:`1px solid ${C.border}`,borderRadius:8,background:C.surface}}>
                <label className="lbl" style={{marginBottom:12}}>Accommodation style</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {HOTEL_TYPES.map(t=>(
                    <span key={t.id} className={`chip ${form.hotelType===t.id?"on":""}`} onClick={()=>setF("hotelType",t.id)}>{t.label}</span>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:22}}>
                <label className="lbl">Travel Pace</label>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {PACES.map(p=><span key={p.v} className={`chip ${form.pace===p.v?"on":""}`} onClick={()=>setF("pace",p.v)}>{p.e} {p.v}</span>)}
                </div>
              </div>

              <div style={{marginBottom:22}}>
                <label className="lbl">What excites you?</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {VIBES.map(v=><span key={v} className={`chip ${form.vibes.includes(v)?"on":""}`} onClick={()=>toggleVibe(v)}>{v}</span>)}
                </div>
              </div>

              <div style={{marginBottom:22}}>
                <label className="lbl">Multi-city trip?</label>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:form.multiCity?12:0}}>
                  <div className="toggle-wrap" style={{background:form.multiCity?C.accent:C.faint}} onClick={()=>setF("multiCity",!form.multiCity)}>
                    <div className="toggle-knob" style={{left:form.multiCity?22:3}}/>
                  </div>
                  <span style={{fontSize:13,color:C.muted}}>Add more cities to your trip</span>
                </div>
                {form.multiCity&&<input className="inp" placeholder="e.g. Florence, Venice (comma separated)" value={form.cities} onChange={e=>setF("cities",e.target.value)}/>}
              </div>

              <div style={{marginBottom:32}}>
                <label className="lbl">Special requests (optional)</label>
                <textarea className="inp" rows={3} style={{resize:"vertical",lineHeight:1.6}}
                  placeholder="Traveling with kids, dietary restrictions, anniversary trip…"
                  value={form.notes} onChange={e=>setF("notes",e.target.value)}/>
              </div>

              <button className="btn btn-primary" disabled={!form.destination.trim()} onClick={fetchActivities} style={{fontSize:15,padding:"14px 36px"}}>
                ✦ Discover Activities →
              </button>
            </div>
          )}

          {/* ════ STEP 2 ════ */}
          {step===2&&!loading&&(
            <div className="anim-fadeup">
              <StepBar step={2}/>

              {/* hero fact */}
              {form._heroFact&&(
                <div style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:8,padding:"13px 18px",marginBottom:24,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0}}>💡</span>
                  <div>
                    <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:C.accent,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Did you know?</div>
                    <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{form._heroFact}</div>
                  </div>
                </div>
              )}

              {/* ── CUSTOM ACTIVITY SEARCH ── */}
              <div style={{marginBottom:28,background:"#FFF8EE",border:"1px solid #FFE0B2",borderRadius:10,padding:"18px 20px"}}>
                <div style={{marginBottom:12}}>
                  <div className="sec-label" style={{marginBottom:4,color:C.green}}>◆ Add Your Own Activity</div>
                  <div style={{fontSize:13,color:C.muted}}>Don't see something you want? Type it and we'll build a full card for it.</div>
                </div>
                <div className="search-bar">
                  <span style={{fontSize:18,flexShrink:0}}>🔍</span>
                  <input
                    ref={searchInputRef}
                    placeholder={`e.g. "hot air balloon", "cooking class", "Uffizi Gallery"…`}
                    value={customQuery}
                    onChange={e=>{setCustomQuery(e.target.value);setCustomError("");}}
                    onKeyDown={e=>e.key==="Enter"&&!addingCustom&&customQuery.trim()&&addCustomActivity()}
                  />
                  <button className="btn-add" disabled={!customQuery.trim()||addingCustom} onClick={addCustomActivity}>
                    {addingCustom
                      ? <><div className="adding-spinner"/> Adding…</>
                      : <>+ Add Activity</>
                    }
                  </button>
                </div>
                {customError && (
                  <div style={{marginTop:8,fontSize:12,color:"#ff8080",display:"flex",gap:6,alignItems:"center"}}>
                    <span>⚠</span>{customError}
                  </div>
                )}
                {/* quick suggestion chips */}
                <div style={{marginTop:12,display:"flex",gap:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:C.muted,alignSelf:"center",fontFamily:"'DM Mono',monospace",letterSpacing:.5}}>Try:</span>
                  {["Cooking class","Sunrise hike","Street food tour","Sailing trip","Wine tasting","Photography walk"].map(s=>(
                    <span key={s} style={{fontSize:12,color:C.blue,cursor:"pointer",padding:"3px 10px",border:`1px solid rgba(76,143,202,.3)`,borderRadius:20,background:"rgba(76,143,202,.08)",transition:"all .15s"}}
                      onClick={()=>{setCustomQuery(s);setCustomError("");setTimeout(()=>searchInputRef.current?.focus(),50);}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* selection header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div>
                    <span style={{fontFamily:"'Fredoka One',cursive",fontSize:22,fontWeight:700}}>{selected.size}</span>
                    <span style={{color:C.muted,fontSize:14,marginLeft:8}}>of {activities.length} activities selected</span>
                  </div>
                  {activities.filter(a=>a.custom).length>0 && (
                    <span className="tag tag-green" style={{fontSize:9}}>
                      +{activities.filter(a=>a.custom).length} custom
                    </span>
                  )}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-outline" onClick={()=>setSelected(new Set())}>Clear all</button>
                  <button className="btn btn-outline" onClick={()=>setSelected(new Set(activities.map(a=>a.id)))}>Select all</button>
                </div>
              </div>

              {/* activity grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(275px,100%),1fr))",gap:13,marginBottom:32}}>
                {activities.map((act,idx)=>{
                  const isSel = selected.has(act.id);
                  return(
                    <div key={act.id}
                      className={`act-card ${act.custom?"custom":""} ${isSel?"sel":""}`}
                      style={{animationDelay:`${idx*.03}s`,paddingBottom: act.custom?"36px":"16px"}}
                      onClick={()=>toggleSel(act.id)}>

                      {/* badges */}
                      {act.custom && <div className="custom-badge">✚ Custom</div>}
                      <div className="check" style={{top: act.custom?36:12}}>{isSel?"✓":""}</div>

                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingRight:30,paddingTop: act.custom?22:0}}>
                        <span style={{fontSize:22}}>{act.emoji}</span>
                        <div>
                          <div style={{fontWeight:600,fontSize:14,lineHeight:1.3}}>{act.name}</div>
                          <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:catColor(act.category),textTransform:"uppercase",letterSpacing:.8}}>{act.category}</span>
                        </div>
                      </div>

                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <Stars rating={act.rating}/>
                        <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:C.gold}}>{act.rating?.toFixed(1)}</span>
                        <span style={{fontSize:11,color:C.muted}}>({act.reviewCount?.toLocaleString()})</span>
                      </div>

                      <div style={{display:"flex",marginBottom:10}}>
                        <div className="rev-bar-bg">
                          <div className="rev-bar-fill" style={{width:`${((act.rating-3)/2)*100}%`}}/>
                        </div>
                      </div>

                      <p style={{fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:10}}>{act.description}</p>

                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                        <span className="tag tag-gray">⏱ {act.duration}</span>
                        <span className="tag tag-gray">{act.priceRange==="Free"?"🆓 Free":`💰 ${act.priceRange}`}</span>
                        <span className="tag tag-gray">🕐 {act.bestTime}</span>
                        {act.mustTry&&<span className="tag tag-gold">★ Must-Try</span>}
                      </div>

                      {act.insiderTip&&(
                        <div style={{fontSize:12,color:C.gold,fontStyle:"italic",borderTop:`1px solid ${C.faint}`,paddingTop:8,display:"flex",gap:6,marginBottom:6}}>
                          <span style={{flexShrink:0}}>★</span>{act.insiderTip}
                        </div>
                      )}

                      {act.bookingLink&&(
                        <a href={act.bookingLink} target="_blank" rel="noopener noreferrer"
                          onClick={e=>e.stopPropagation()}
                          style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:6,fontSize:11,color:C.accent,textDecoration:"none",fontFamily:"'DM Mono',monospace"}}>
                          Book this ↗
                        </a>
                      )}

                      {/* remove button for custom activities */}
                      {act.custom&&(
                        <button className="remove-btn"
                          onClick={e=>{e.stopPropagation();removeActivity(act.id);}}>
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <button className="btn btn-primary" disabled={selected.size===0} onClick={generateItinerary} style={{fontSize:15,padding:"14px 36px"}}>
                  ✦ Build My Itinerary ({selected.size}) →
                </button>
                <button className="btn btn-outline" onClick={()=>setStep(1)}>← Edit details</button>
              </div>
            </div>
          )}

          {/* ════ STEP 3 ════ */}
          {step===3&&itinerary&&!loading&&(
            <div ref={resultRef} className="anim-fadeup">
              <StepBar step={3}/>

              {/* header */}
              <div style={{marginBottom:40}}>
                <div className="sec-label" style={{marginBottom:10}}>◆ {form.days}-Day Itinerary</div>
                <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(26px,5vw,54px)",fontWeight:700,letterSpacing:"-1.5px",marginBottom:8}}>{itinerary.destination}</h2>
                <p style={{color:C.muted,fontSize:15,fontStyle:"italic",maxWidth:520,lineHeight:1.7,marginBottom:22}}>"{itinerary.tagline}"</p>
                <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                  {[["Best Time",itinerary.bestTime],["Currency",itinerary.currency],["Language",itinerary.language],["Pace",form.pace],["Budget",form.budget]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                      <div style={{fontSize:13}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── WEATHER ── */}
              <WeatherStrip destination={itinerary.destination} days={parseInt(form.days)}/>

              {/* ── INTERACTIVE MAP ── */}
              <TripMap
                destination={itinerary.destination}
                hotels={hotels}
                activities={activities.filter(a=>selected.has(a.id))}
                days={itinerary.days}
              />

              <div className="div"/>

              {/* ── ACCOMMODATIONS ── */}
              <AccommodationSection hotels={hotels} budget={form.budget}/>

              <div className="div"/>

              {/* ── ARRIVAL GUIDE ── */}
              {arrival&&<ArrivalGuide data={arrival}/>}

              {/* ── BETWEEN-CITY TRANSPORT ── */}
              {itinerary.transport?.length>0&&(
                <>
                  <div style={{marginBottom:28}}>
                    <div className="sec-label" style={{marginBottom:14}}>◆ Getting Between Cities</div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {itinerary.transport.map((t,i)=>(
                        <div key={i} className="transport-badge">
                          <span style={{fontSize:20}}>{txIcon(t.recommended)}</span>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                              <span style={{fontWeight:500,fontSize:14}}>{t.from} → {t.to}</span>
                              <span className={`tag ${t.recommended==="Train"?"tag-green":t.recommended==="Flight"?"tag-orange":"tag-gray"}`}>{t.recommended}</span>
                              <span style={{fontSize:12,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{t.duration}</span>
                              <span style={{fontSize:12,color:C.gold,fontFamily:"'DM Mono',monospace"}}>{t.approxCost}</span>
                            </div>
                            <div style={{fontSize:12,color:C.muted}}>{t.reason} · <em>{t.operator}</em></div>
                          </div>
                          {t.bookingLink&&<a href={t.bookingLink} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.accent,textDecoration:"none",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>Book ↗</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="div"/>
                </>
              )}

              {/* ── DAY CARDS ── */}
              <div className="sec-label" style={{marginBottom:18}}>◆ Day-by-Day Plan</div>
              <div style={{display:"flex",flexDirection:"column",gap:18,marginBottom:40}}>
                {itinerary.days?.map((day,idx)=>{
                  const isRegenerating = regenDayIdx===idx;
                  const isEditing      = editingDay===day.day;
                  const justUpdated    = updatedDays.has(idx);
                  return(
                    <div key={idx}
                      className={`day-card ${isRegenerating?"regenerating":""} ${justUpdated?"just-updated":""}`}
                      style={{animationDelay:`${idx*.07}s`,transition:"opacity .3s,filter .3s"}}>

                      {/* ── DAY HEADER ── */}
                      <div className="day-head">
                        <div className="day-num">
                          {isRegenerating
                            ? <div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                            : String(day.day).padStart(2,"0")
                          }
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,fontWeight:700,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                            {day.theme}
                            {justUpdated && <span className="tag tag-green" style={{fontSize:9,animation:"popIn .3s ease"}}>✓ Updated</span>}
                          </div>
                          <div style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",marginTop:2}}>📍 {day.neighborhood}</div>
                        </div>
                        {/* edit toggle button */}
                        <button
                          className={`btn-edit-toggle ${isEditing?"active":""}`}
                          onClick={()=>{
                            if(isEditing){setEditingDay(null);setEditDayNote("");}
                            else{setEditingDay(day.day);setEditDayNote("");}
                          }}>
                          {isEditing ? "✕ Cancel" : "✏ Edit Day"}
                        </button>
                      </div>

                      {/* ── EDIT PANEL (slides in when editing) ── */}
                      {isEditing && (
                        <div className="edit-day-panel" style={{animation:"slideDown .2s ease"}}>
                          <span style={{fontSize:16,flexShrink:0}}>✏️</span>
                          <input
                            className="edit-day-input"
                            placeholder={`What would you like instead? e.g. "more outdoor activities", "focus on food", "something for rainy day"…`}
                            value={editDayNote}
                            onChange={e=>setEditDayNote(e.target.value)}
                            onKeyDown={e=>e.key==="Enter"&&!isRegenerating&&regenerateDay(day,idx)}
                            autoFocus
                          />
                          <button
                            className="btn-regen"
                            disabled={isRegenerating}
                            onClick={()=>regenerateDay(day,idx)}>
                            {isRegenerating
                              ? <><div className="adding-spinner"/> Regenerating…</>
                              : <>↺ Regenerate</>
                            }
                          </button>
                          {!editDayNote.trim() && (
                            <div style={{width:"100%",display:"flex",gap:7,flexWrap:"wrap",paddingTop:4}}>
                              <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",alignSelf:"center"}}>Quick:</span>
                              {["More outdoor activities","Focus on food & drink","Kid-friendly options","Rainy day alternatives","Hidden gems only","Relaxed & slow-paced"].map(s=>(
                                <span key={s}
                                  style={{fontSize:11,color:C.blue,cursor:"pointer",padding:"3px 9px",border:"1px solid rgba(76,143,202,.3)",borderRadius:20,background:"rgba(76,143,202,.08)",transition:"all .15s",whiteSpace:"nowrap"}}
                                  onClick={()=>setEditDayNote(s)}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── DAY ACTIVITIES ── */}
                      <div style={{padding:"16px 22px"}}>
                        {day.activities?.map((act,i)=>(
                          <div key={i} className="act-row">
                            <span className="time-pill">{act.time}</span>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                                <span style={{fontWeight:500,fontSize:14}}>{act.name}</span>
                                {act.cost&&<span style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace",background:C.faint,padding:"2px 7px",borderRadius:3}}>{act.cost}</span>}
                              </div>
                              <div style={{color:C.muted,fontSize:13,lineHeight:1.65,marginBottom:act.tip?5:0}}>{act.description}</div>
                              {act.tip&&<div style={{fontSize:12,color:C.gold,display:"flex",gap:5,fontStyle:"italic"}}><span>★</span>{act.tip}</div>}
                            </div>
                          </div>
                        ))}

                        {/* meals — quick picks with honest labels and caveats */}
                        {(day.breakfast||day.lunch||day.dinner)&&(
                          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.faint}`}}>
                            {[
                              day.breakfast&&{key:"breakfast",label:"☕ Breakfast",items:Array.isArray(day.breakfast)?day.breakfast:[day.breakfast]},
                              day.lunch&&{key:"lunch",label:"🍽 Lunch",items:Array.isArray(day.lunch)?day.lunch:[day.lunch]},
                              day.dinner&&{key:"dinner",label:"🌙 Dinner",items:Array.isArray(day.dinner)?day.dinner:[day.dinner]}
                            ].filter(Boolean).map(meal=>(
                              <div key={meal.key} style={{marginBottom:14}}>
                                <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                                  <span>{meal.label}</span>
                                  <span style={{color:C.faint}}>·</span>
                                  <span style={{color:C.muted,textTransform:"none",letterSpacing:0,fontSize:11}}>3 honest options</span>
                                </div>
                                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                                  {meal.items.slice(0,3).map((m,i)=>{
                                    const labelColors={iconic:C.gold,"tourist-good":C.accent,mixed:C.muted,locals:C.green,hidden:"#9B7FE8"};
                                    const labelText={iconic:"ICONIC","tourist-good":"TOURIST-OK",mixed:"MIXED",locals:"LOCALS",hidden:"HIDDEN GEM"};
                                    const lc=labelColors[m.label]||C.muted;
                                    return (
                                      <div key={i} style={{background:C.surface,borderRadius:6,padding:"11px 13px",border:`1px solid ${C.border}`}}>
                                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                                          <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",fontWeight:600,color:lc,letterSpacing:1,padding:"2px 6px",background:`${lc}15`,borderRadius:3}}>{labelText[m.label]||"PICK"}</span>
                                          {m.priceLevel&&<span style={{fontSize:11,color:C.muted}}>{m.priceLevel}</span>}
                                        </div>
                                        <div style={{fontWeight:500,fontSize:13,marginBottom:3,lineHeight:1.3}}>{m.name||"—"}</div>
                                        {m.dish&&<div style={{fontSize:11,color:C.muted,marginBottom:5}}>Try: <span style={{color:C.ink}}>{m.dish}</span></div>}
                                        {m.caveat&&<div style={{fontSize:11,color:C.gold,display:"flex",gap:4,fontStyle:"italic",lineHeight:1.4,marginTop:5,paddingTop:5,borderTop:`1px solid ${C.faint}`}}><span style={{flexShrink:0}}>⚠</span><span>{m.caveat}</span></div>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={()=>{setFoodOpen(true);setFoodMeal("dinner");setFoodSpectrum("mix");setFoodResults(null);}}
                              style={{marginTop:6,fontSize:12,color:C.accent,background:"transparent",border:`1px dashed ${C.border}`,padding:"8px 14px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                              ◇ Open Food Finder — browse all options for {itinerary.destination}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOD FINDER MODAL */}
              {foodOpen && (
                <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setFoodOpen(false)}>
                  <div className="modal" style={{maxWidth:700,maxHeight:"85vh",overflowY:"auto"}}>
                    <button onClick={()=>setFoodOpen(false)} style={{position:"absolute",top:16,right:16,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:20}}>✕</button>

                    <div className="sec-label" style={{marginBottom:8}}>◆ Food Finder</div>
                    <h3 style={{fontFamily:"'Fredoka One',cursive",fontSize:24,fontWeight:700,marginBottom:6}}>Honest food picks for {itinerary?.destination}</h3>
                    <p style={{fontSize:12,color:C.muted,marginBottom:20}}>You decide where to eat — we help you decide better. Pick a meal, pick a spectrum, get 5 real options with honest caveats.</p>

                    {/* Meal selector */}
                    <label className="lbl">Meal</label>
                    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                      {[{k:"breakfast",l:"☕ Breakfast"},{k:"lunch",l:"🍽 Lunch"},{k:"dinner",l:"🌙 Dinner"}].map(m=>(
                        <button key={m.k} onClick={()=>setFoodMeal(m.k)}
                          style={{padding:"10px 16px",borderRadius:50,border:`1px solid ${foodMeal===m.k?C.accent:C.border}`,background:foodMeal===m.k?`${C.accent}15`:"transparent",color:foodMeal===m.k?C.accent:C.ink,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500}}>
                          {m.l}
                        </button>
                      ))}
                    </div>

                    {/* Spectrum filter */}
                    <label className="lbl">Spectrum</label>
                    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                      {[
                        {k:"mix",l:"Mix it up"},
                        {k:"locals",l:"Where locals eat"},
                        {k:"iconic",l:"Famous for a reason"},
                        {k:"hidden",l:"Hidden gems"},
                        {k:"new",l:"What's new"}
                      ].map(s=>(
                        <button key={s.k} onClick={()=>setFoodSpectrum(s.k)}
                          style={{padding:"8px 14px",borderRadius:50,border:`1px solid ${foodSpectrum===s.k?C.gold:C.border}`,background:foodSpectrum===s.k?`${C.gold}15`:"transparent",color:foodSpectrum===s.k?C.gold:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:500}}>
                          {s.l}
                        </button>
                      ))}
                    </div>
                    {foodSpectrum==="new"&&(
                      <div style={{fontSize:11,color:C.gold,marginBottom:14,padding:"8px 12px",background:`${C.gold}15`,borderRadius:6,border:`1px solid ${C.gold}30`,display:"flex",gap:6,fontStyle:"italic"}}>
                        <span>⚠</span><span>"What's new" picks may be outdated — knowledge cutoff applies. Verify openings before going.</span>
                      </div>
                    )}

                    {/* Find button */}
                    <button onClick={()=>fetchFoodFinder(foodMeal,foodSpectrum)} disabled={foodLoading}
                      style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.accent},${C.pink})`,color:C.cream,border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:foodLoading?"wait":"pointer",fontFamily:"inherit",marginBottom:20,opacity:foodLoading?0.6:1}}>
                      {foodLoading?"Finding picks…":"Find 5 picks ✦"}
                    </button>

                    {/* Error */}
                    {foodError&&<div style={{padding:"10px 14px",background:"rgba(255,77,77,.1)",border:"1px solid rgba(255,77,77,.3)",borderRadius:6,color:"#ff4d4d",fontSize:13,marginBottom:14}}>{foodError}</div>}

                    {/* Results */}
                    {foodResults?.results?.length>0&&(
                      <div>
                        <div className="sec-label" style={{marginBottom:12}}>◆ {foodResults.results.length} options for {foodMeal}</div>
                        {foodResults.results.map((m,i)=>{
                          const labelColors={iconic:C.gold,"tourist-good":C.accent,mixed:C.muted,locals:C.green,hidden:"#9B7FE8"};
                          const labelText={iconic:"ICONIC","tourist-good":"TOURIST-GOOD",mixed:"MIXED",locals:"LOCALS","hidden":"HIDDEN GEM"};
                          const lc=labelColors[m.label]||C.muted;
                          return (
                            <div key={i} style={{background:C.surface,borderRadius:8,padding:"14px 16px",border:`1px solid ${C.border}`,marginBottom:10}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                                <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",fontWeight:600,color:lc,letterSpacing:1,padding:"2px 7px",background:`${lc}15`,borderRadius:3}}>{labelText[m.label]||"PICK"}</span>
                                {m.priceLevel&&<span style={{fontSize:11,color:C.muted}}>{m.priceLevel}</span>}
                                {m.area&&<span style={{fontSize:11,color:C.muted}}>· {m.area}</span>}
                              </div>
                              <div style={{fontWeight:600,fontSize:15,marginBottom:4,fontFamily:"'Fredoka One',cursive"}}>{m.name}</div>
                              {m.dish&&<div style={{fontSize:12,color:C.muted,marginBottom:8}}>Try: <span style={{color:C.ink,fontWeight:500}}>{m.dish}</span></div>}
                              {m.reviewSummary&&<div style={{fontSize:12,color:C.muted,lineHeight:1.5,marginBottom:m.caveat?8:0,fontStyle:"italic"}}>{m.reviewSummary}</div>}
                              {m.caveat&&<div style={{fontSize:12,color:C.gold,display:"flex",gap:6,lineHeight:1.4,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.faint}`}}><span style={{flexShrink:0}}>⚠</span><span>{m.caveat}</span></div>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Empty state */}
                    {!foodResults&&!foodLoading&&!foodError&&(
                      <div style={{textAlign:"center",padding:"30px 20px",color:C.muted,fontSize:13}}>
                        Pick a meal and spectrum, then hit "Find 5 picks" to see honest options.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXTRAS */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:40}}>
                {itinerary.packingTips?.length>0&&(
                  <div className="card" style={{padding:22}}>
                    <div className="sec-label" style={{marginBottom:12}}>◆ Pack This</div>
                    {itinerary.packingTips.map((t,i)=>(
                      <div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:13,color:C.muted,alignItems:"flex-start"}}>
                        <span style={{color:C.green,marginTop:1,flexShrink:0}}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                )}
                {itinerary.localPhrases?.length>0&&(
                  <div className="card" style={{padding:22}}>
                    <div className="sec-label" style={{marginBottom:12}}>◆ Speak Local</div>
                    {itinerary.localPhrases.map((p,i)=>(
                      <div key={i} style={{marginBottom:10}}>
                        <div style={{fontSize:14,fontStyle:"italic",color:C.accent,fontFamily:"'Fredoka One',cursive",fontWeight:600}}>"{p.phrase}"</div>
                        <div style={{fontSize:12,color:C.muted}}>{p.meaning}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="div"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn btn-primary" onClick={resetAll}>✦ Plan Another Trip</button>
                <button className="btn btn-outline" onClick={()=>setStep(2)}>← Change Activities</button>
                <button className="btn btn-outline" onClick={()=>setShowShare(true)}>🔗 Share Trip</button>
                <button className="btn btn-outline" onClick={()=>window.print()}>⬇ Save as PDF</button>
              </div>

              {/* ── TRIP CHAT (floating) ── */}
              <TripChat itinerary={itinerary} form={form}/>

              {/* ── SHARE MODAL ── */}
              {showShare && <ShareModal itinerary={itinerary} form={form} onClose={()=>setShowShare(false)}/>}
            </div>
          )}

          {/* LOADING */}
          {loading&&(
            <div style={{textAlign:"center",padding:"80px 20px",animation:"fadeIn .4s ease",background:"linear-gradient(160deg,#FFFBF5,#FFF0E5)",minHeight:"60vh",borderRadius:12}}>
              <div style={{fontSize:40,marginBottom:18,display:"inline-block",animation:"spin 3s linear infinite",fontSize:48,color:C.accent}}>🗺️</div>
              <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:26,fontWeight:700,marginBottom:8}}>{loadMsg}</h2>
              <p style={{color:C.muted,fontSize:13,marginBottom:26}}>Usually takes 15–20 seconds</p>
              <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
                <div className="ld-bar"><div className="ld-fill"/></div>
              </div>
              <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
                {["✈️ Mapping your route","🏨 Finding great hotels","🗺️ Building your days","☀️ Checking the weather"].map(t=>(
                  <span key={t} style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>◆ {t}</span>
                ))}
              </div>
            </div>
          )}

          {error&&<div style={{background:"rgba(255,80,80,.08)",border:"1px solid rgba(255,80,80,.25)",borderRadius:6,padding:14,marginTop:20,color:"#ff9090",fontSize:13}}>⚠ {error}</div>}
        </div>

        {/* FOOTER */}
        <footer style={{borderTop:`1px solid ${C.border}`,padding:"24px 32px",marginTop:20,background:"linear-gradient(160deg,#FFFBF5,#FFF0E5)"}}>
          <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 10px rgba(255,107,53,0.3)`}}>
                <span style={{color:"#fff",fontSize:14,fontFamily:"'Fredoka One',cursive"}}>T</span>
              </div>
              <span style={{fontFamily:"'Fredoka One',cursive",fontSize:16,background:`linear-gradient(135deg,${C.accent},#FF3CAC)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>tripdippity</span>
              <span style={{color:C.muted,fontSize:13}}>· Dip into your next adventure. 🗺️</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <span style={{fontSize:12,color:C.muted}}>© 2026 Tripdippity Inc.</span>
              <span style={{fontSize:11,color:C.accent,fontFamily:"'DM Mono',monospace",background:"rgba(255,107,53,0.1)",padding:"2px 10px",borderRadius:20,border:`1px solid rgba(255,107,53,0.2)`}}>v1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
