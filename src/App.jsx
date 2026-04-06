import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA — GPS TRACKS + PHOTOS
   ═══════════════════════════════════════════ */

const makeTrack = (points) => points.map(([x, y]) => ({ x, y }));

const RACES = [
  {
    id: 1,
    athlete: "Marcus Chen",
    title: "The Double Door County",
    anchor: "Door County 50 Miler",
    anchorLocation: "Door County, WI",
    anchorDate: "Oct 12, 2025",
    description:
      "Ran the entire 50-mile course in reverse starting at 8PM Friday night. Headlamp on, alone in the dark through the Wisconsin countryside. Arrived at the start line just as the official race began Saturday morning — then turned around and ran the full 50 with the field. 100 miles. One course. Both directions.",
    ghostDistance: 50,
    anchorDistance: 50,
    totalDistance: 100,
    totalTime: "22h 47m",
    elevationGain: "4,200 ft",
    type: "Course Reversal",
    verified: true,
    avatar: "MC",
    ghostRaceCount: 3,
    officialTrack: makeTrack([
      [45, 320],[70, 305],[105, 290],[140, 270],[175, 255],[200, 235],
      [230, 220],[265, 200],[290, 175],[310, 155],[335, 140],[360, 120],
      [385, 105],[410, 95],[440, 80],[470, 65],[500, 55],[530, 50],
      [560, 42],[590, 38],[620, 45],[645, 55],[670, 50],[695, 42],
    ]),
    ghostTrack: makeTrack([
      [695, 58],[670, 65],[645, 70],[620, 60],[590, 53],[560, 57],
      [530, 65],[500, 70],[470, 80],[440, 95],[410, 110],[385, 120],
      [360, 135],[335, 155],[310, 170],[290, 190],[265, 215],[230, 235],
      [200, 250],[175, 270],[140, 285],[105, 305],[70, 320],[45, 335],
    ]),
    photos: [
      { x: 620, y: 52, time: "11:42 PM", caption: "Mile 8 — Total darkness on the peninsula road. Just me and the headlamp.", color: "#1a3328" },
      { x: 360, y: 128, time: "3:15 AM", caption: "Mile 31 — First light breaking through the trees. The loneliest I've ever felt in a race.", color: "#0f2a1e" },
      { x: 140, y: 278, time: "6:50 AM", caption: "Mile 47 — Approaching the start line. I can see headlights from the parking area. They have no idea.", color: "#1a2d22" },
      { x: 500, y: 62, time: "2:30 PM", caption: "Mile 78 — Running the same stretch in daylight that I ran in darkness 15 hours ago. Completely different course.", color: "#162e20" },
    ],
  },
  {
    id: 2,
    athlete: "James Whitfield",
    title: "74 Before Houston",
    anchor: "Houston Marathon",
    anchorLocation: "Houston, TX",
    anchorDate: "Jan 19, 2025",
    description:
      "Started at 10PM Saturday night. Ran 74 miles through the streets of Houston in the dark — loops, out-and-backs, whatever it took. Timed it so the final mile connected to the marathon start corral. When the gun went off at 7AM, I was already 74 miles deep. Crossed the marathon finish at mile 100.2.",
    ghostDistance: 74,
    anchorDistance: 26.2,
    totalDistance: 100.2,
    totalTime: "24h 12m",
    elevationGain: "890 ft",
    type: "Pre-Race Ultra",
    verified: true,
    avatar: "JW",
    ghostRaceCount: 1,
    officialTrack: makeTrack([
      [350, 300],[370, 280],[400, 265],[430, 250],[460, 240],[490, 225],
      [510, 205],[520, 180],[510, 155],[490, 140],[460, 130],[430, 125],
      [400, 130],[380, 145],[370, 165],[375, 190],[390, 210],[410, 225],
      [430, 235],[460, 240],[480, 250],[490, 265],[485, 285],[470, 300],
    ]),
    ghostTrack: makeTrack([
      [350, 315],[320, 300],[290, 280],[260, 265],[230, 275],[210, 295],
      [195, 315],[185, 290],[175, 265],[165, 240],[180, 220],[200, 205],
      [225, 195],[250, 185],[270, 170],[285, 150],[300, 135],[280, 120],
      [255, 110],[230, 105],[210, 115],[195, 135],[185, 160],[180, 185],
      [190, 210],[210, 230],[235, 245],[260, 255],[285, 260],[310, 265],
      [330, 275],[345, 290],[350, 310],
    ]),
    photos: [
      { x: 195, y: 310, time: "11:30 PM", caption: "Mile 6 — Empty Houston streets. The city is asleep and I've got 94 miles to go.", color: "#1a2825" },
      { x: 175, y: 258, time: "2:45 AM", caption: "Mile 28 — Refueling at a 24hr gas station. The cashier thinks I'm crazy.", color: "#12261e" },
      { x: 350, y: 308, time: "6:55 AM", caption: "Mile 74 — Joining the marathon corral. 30,000 fresh runners. I'm shaking.", color: "#1e3328" },
    ],
  },
  {
    id: 3,
    athlete: "Sarah Okafor",
    title: "Back-to-Back Iron",
    anchor: "IRONMAN Texas",
    anchorLocation: "The Woodlands, TX",
    anchorDate: "Apr 26, 2025",
    description:
      "Completed a full 70.3 Half Ironman on Saturday — 1.2mi swim, 56mi bike, 13.1mi run. Slept four hours. Then lined up Sunday morning for the full IRONMAN — 2.4mi swim, 112mi bike, 26.2mi run. 210.9 total miles across two days of racing.",
    ghostDistance: 70.3,
    anchorDistance: 140.6,
    totalDistance: 210.9,
    totalTime: "32h 08m",
    elevationGain: "2,100 ft",
    type: "Back-to-Back",
    verified: true,
    avatar: "SO",
    ghostRaceCount: 5,
    officialTrack: makeTrack([
      [80, 180],[100, 160],[130, 145],[165, 135],[200, 130],[240, 128],
      [280, 130],[320, 135],[360, 145],[400, 150],[440, 148],[480, 140],
      [520, 135],[560, 138],[600, 148],[630, 165],[650, 185],[655, 210],
      [640, 235],[615, 250],[585, 255],[555, 248],[530, 235],[510, 218],
    ]),
    ghostTrack: makeTrack([
      [80, 200],[110, 215],[145, 225],[180, 230],[215, 228],[250, 222],
      [285, 218],[320, 222],[350, 232],[375, 245],[395, 260],[410, 278],
      [420, 298],[415, 318],[400, 332],[375, 338],[350, 330],[330, 315],
      [315, 295],[305, 275],[300, 255],[305, 235],[315, 218],[330, 205],
    ]),
    photos: [
      { x: 280, y: 130, time: "SAT 9:15 AM", caption: "Half Ironman bike leg — feeling strong. Tomorrow is going to be a different story.", color: "#18302a" },
      { x: 400, y: 335, time: "SAT 4:30 PM", caption: "Finishing the 70.3. Legs are already questioning tomorrow's decision.", color: "#142820" },
      { x: 440, y: 146, time: "SUN 1:20 PM", caption: "Full Ironman bike — mile 80. The wheels are coming off but I'm still moving.", color: "#1a332a" },
      { x: 530, y: 232, time: "SUN 8:45 PM", caption: "Final marathon miles. Walking more than running. Don't care. I'm finishing this.", color: "#0f2418" },
    ],
  },
  {
    id: 4,
    athlete: "Derek Muñoz",
    title: "Leadville the Long Way",
    anchor: "Leadville Trail 100",
    anchorLocation: "Leadville, CO",
    anchorDate: "Aug 16, 2025",
    description:
      "Hiked from Aspen to Leadville over 3 days covering 47 miles at altitude — crossing the Continental Divide at 12,500 feet. Arrived at the Leadville 100 start with 2 hours to spare. Then ran the full 100-mile race through the Rockies. 147 total miles. All above 9,000 feet.",
    ghostDistance: 47,
    anchorDistance: 100,
    totalDistance: 147,
    totalTime: "4 days",
    elevationGain: "18,400 ft",
    type: "Expedition + Race",
    verified: true,
    avatar: "DM",
    ghostRaceCount: 2,
    officialTrack: makeTrack([
      [360, 280],[380, 260],[405, 245],[430, 230],[455, 218],[475, 200],
      [490, 180],[500, 158],[505, 138],[495, 118],[480, 105],[460, 95],
      [435, 92],[410, 98],[390, 112],[378, 132],[375, 155],[380, 178],
      [392, 200],[410, 218],[430, 230],[450, 245],[465, 262],[470, 280],
    ]),
    ghostTrack: makeTrack([
      [60, 90],[85, 105],[115, 118],[145, 125],[175, 128],[200, 120],
      [220, 108],[240, 98],[265, 95],[290, 105],[310, 120],[325, 140],
      [335, 162],[340, 185],[345, 210],[350, 235],[355, 258],[360, 280],
    ]),
    photos: [
      { x: 145, y: 125, time: "DAY 1", caption: "Independence Pass. 12,095 feet. The start of something massive.", color: "#1a2d30" },
      { x: 265, y: 95, time: "DAY 2", caption: "Continental Divide crossing. Can see for 50 miles in every direction.", color: "#122830" },
      { x: 355, y: 258, time: "DAY 3", caption: "Walking into Leadville. My legs have 47 miles on them and I haven't even started the race.", color: "#182a22" },
      { x: 505, y: 138, time: "RACE NIGHT", caption: "Hope Pass at midnight during the 100. Second time over 12,000 feet this week.", color: "#0f2225" },
    ],
  },
  {
    id: 5,
    athlete: "Ava Lindström",
    title: "Midnight Superior",
    anchor: "Superior 50K",
    anchorLocation: "Lutsen, MN",
    anchorDate: "May 17, 2025",
    description:
      "Started at midnight and ran the entire Superior 50K course in full darkness with a headlamp — rocky single-track, river crossings, 4,000 feet of climbing. Finished at the start as other runners gathered for the 6AM gun. Then ran it again with the field at sunrise. Same course. Twice.",
    ghostDistance: 31,
    anchorDistance: 31,
    totalDistance: 62,
    totalTime: "14h 33m",
    elevationGain: "7,800 ft",
    type: "Night Double",
    verified: true,
    avatar: "AL",
    ghostRaceCount: 4,
    officialTrack: makeTrack([
      [60, 250],[90, 235],[120, 215],[145, 195],[170, 180],[200, 170],
      [235, 162],[270, 155],[300, 148],[330, 140],[355, 128],[380, 115],
      [410, 108],[445, 105],[480, 110],[510, 120],[540, 135],[565, 150],
      [590, 165],[615, 175],[640, 180],[665, 172],[690, 160],
    ]),
    ghostTrack: makeTrack([
      [60, 265],[90, 250],[120, 232],[145, 212],[170, 196],[200, 185],
      [235, 178],[270, 170],[300, 163],[330, 156],[355, 143],[380, 130],
      [410, 123],[445, 120],[480, 125],[510, 135],[540, 150],[565, 166],
      [590, 180],[615, 190],[640, 195],[665, 187],[690, 175],
    ]),
    photos: [
      { x: 200, y: 178, time: "1:30 AM", caption: "Single-track by headlamp. Every root is trying to kill me.", color: "#0f1f28" },
      { x: 445, y: 112, time: "3:50 AM", caption: "Carlton Peak summit in total darkness. The stars are absurd up here.", color: "#0a1a25" },
      { x: 60, y: 258, time: "5:55 AM", caption: "Back at the start. Runners stretching, drinking coffee. I just ran their entire race in the dark.", color: "#1a2830" },
      { x: 540, y: 142, time: "11:20 AM", caption: "Same section, now in daylight. I can finally see what I was running through.", color: "#152a20" },
    ],
  },
];

const TYPES = ["All", "Course Reversal", "Pre-Race Ultra", "Back-to-Back", "Expedition + Race", "Night Double"];

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */

function FadeIn({ children, delay = 0 }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>{children}</div>;
}

function Avatar({ initials, size = 40 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #1a3a2a, #2d5a3d)", border: "1px solid #3a7a52", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Courier Prime', monospace", fontSize: size * 0.35, color: "#7fff9a", letterSpacing: 1, flexShrink: 0 }}>{initials}</div>;
}

function Stat({ value, label, small }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: small ? 20 : 28, color: "#7fff9a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: small ? 8 : 10, color: "#5a7a6a", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Badge({ type }) {
  return <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", border: "1px solid #2a4a35", padding: "3px 10px", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>{type}</span>;
}

/* ═══════════════════════════════════════════
   MAP COMPONENT
   ═══════════════════════════════════════════ */

function CourseMap({ race, height = 400, mini = false }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  const w = 740;
  const h = height;
  const toPath = (track) => track.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const contourLines = [];
  for (let i = 0; i < 8; i++) {
    const y1 = 40 + i * 45;
    const pts = [];
    for (let x = 0; x <= w; x += 20) {
      pts.push(`${x},${y1 + Math.sin(x * 0.008 + i * 1.2) * 18 + Math.sin(x * 0.015 + i * 0.7) * 10}`);
    }
    contourLines.push(pts.join(" "));
  }

  return (
    <div style={{ position: "relative", background: "#060b08", border: mini ? "none" : "1px solid #1a2a20", overflow: "hidden" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block", height: mini ? 140 : height }}>
        <defs>
          <filter id={`gl-${race.id}`}><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id={`gg-${race.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7fff9a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7fff9a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7fff9a" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {!mini && contourLines.map((pts, i) => <polyline key={i} points={pts} fill="none" stroke="#0f1a14" strokeWidth="0.8" opacity={0.6} />)}
        {!mini && Array.from({ length: 15 }).map((_, xi) => Array.from({ length: 8 }).map((_, yi) => <circle key={`${xi}-${yi}`} cx={50 + xi * 46} cy={30 + yi * 48} r="0.6" fill="#1a2a20" opacity="0.5" />))}

        <path d={toPath(race.officialTrack)} fill="none" stroke="#1a3a25" strokeWidth={mini ? 2 : 2.5} strokeDasharray={mini ? "4,4" : "6,6"} opacity="0.7" />
        <path d={toPath(race.ghostTrack)} fill="none" stroke={`url(#gg-${race.id})`} strokeWidth={mini ? 2.5 : 3} filter={`url(#gl-${race.id})`} strokeLinecap="round" strokeLinejoin="round" />

        {!mini && <>
          <circle cx={race.ghostTrack[0].x} cy={race.ghostTrack[0].y} r="6" fill="#0a0f0c" stroke="#7fff9a" strokeWidth="1.5" />
          <text x={race.ghostTrack[0].x} y={race.ghostTrack[0].y + 3.5} textAnchor="middle" fill="#7fff9a" fontSize="7" fontFamily="'Courier Prime', monospace">G</text>
          <circle cx={race.officialTrack[0].x} cy={race.officialTrack[0].y} r="6" fill="#0a0f0c" stroke="#3a7a52" strokeWidth="1.5" />
          <text x={race.officialTrack[0].x} y={race.officialTrack[0].y + 3.5} textAnchor="middle" fill="#3a7a52" fontSize="7" fontFamily="'Courier Prime', monospace">S</text>
          <circle cx={race.officialTrack.at(-1).x} cy={race.officialTrack.at(-1).y} r="6" fill="#0a0f0c" stroke="#3a7a52" strokeWidth="1.5" />
          <text x={race.officialTrack.at(-1).x} y={race.officialTrack.at(-1).y + 3.5} textAnchor="middle" fill="#3a7a52" fontSize="7" fontFamily="'Courier Prime', monospace">F</text>
        </>}

        {!mini && race.photos.map((photo, i) => (
          <g key={i} style={{ cursor: "pointer" }} onClick={() => setActivePhoto(activePhoto === i ? null : i)} onMouseEnter={() => setHoveredPhoto(i)} onMouseLeave={() => setHoveredPhoto(null)}>
            <circle cx={photo.x} cy={photo.y} r={hoveredPhoto === i || activePhoto === i ? 14 : 10} fill="rgba(127,255,154,0.08)" stroke="none">
              {hoveredPhoto !== i && activePhoto !== i && <animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite" />}
            </circle>
            <circle cx={photo.x} cy={photo.y} r="5" fill="#0a0f0c" stroke={activePhoto === i ? "#7fff9a" : "#3a7a52"} strokeWidth="1.5" />
            <rect x={photo.x - 2.5} y={photo.y - 2.5} width="5" height="4" rx="0.5" fill="none" stroke={activePhoto === i ? "#7fff9a" : "#5a7a6a"} strokeWidth="0.8" />
            <circle cx={photo.x} cy={photo.y - 0.5} r="1" fill={activePhoto === i ? "#7fff9a" : "#5a7a6a"} />
          </g>
        ))}
      </svg>

      {!mini && (
        <div style={{ position: "absolute", bottom: 12, right: 16, display: "flex", gap: 16, fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 1 }}>
          <span style={{ color: "#7fff9a", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#7fff9a" strokeWidth="2" /></svg> Ghost Route
          </span>
          <span style={{ color: "#3a5a45", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#1a3a25" strokeWidth="2" strokeDasharray="4,4" /></svg> Official Course
          </span>
          <span style={{ color: "#5a7a6a", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#0a0f0c" stroke="#3a7a52" strokeWidth="1" /></svg> Photo
          </span>
        </div>
      )}

      {!mini && activePhoto !== null && race.photos[activePhoto] && (
        <div style={{ position: "absolute", left: "50%", bottom: 50, transform: "translateX(-50%)", background: "#0c1310", border: "1px solid #2a4a35", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", animation: "fadeUp 0.3s ease" }}>
          <div style={{ height: 160, background: `linear-gradient(135deg, ${race.photos[activePhoto].color}, #0a0f0c)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(127,255,154,0.02) 20px, rgba(127,255,154,0.02) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(127,255,154,0.02) 20px, rgba(127,255,154,0.02) 21px)" }} />
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ width: 44, height: 44, border: "1px solid #2a4a35", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a7a52" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M7 5V3h4v2" /></svg>
              </div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 8, color: "#3a5a45", letterSpacing: 2, textTransform: "uppercase" }}>Geotagged Photo</div>
            </div>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#7fff9a", letterSpacing: 2, marginBottom: 6 }}>{race.photos[activePhoto].time}</div>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#8aaa97", lineHeight: 1.6, margin: 0 }}>{race.photos[activePhoto].caption}</p>
          </div>
          <button onClick={() => setActivePhoto(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(10,15,12,0.7)", border: "1px solid #1a2a20", color: "#5a7a6a", width: 28, height: 28, cursor: "pointer", fontFamily: "'Courier Prime', monospace", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>×</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LANDING
   ═══════════════════════════════════════════ */

function Landing({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(42,74,53,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(58,122,82,0.03) 40px, rgba(58,122,82,0.03) 41px)", pointerEvents: "none" }} />

      <FadeIn delay={200}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#3a7a52", letterSpacing: 6, textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>The Race Nobody Sees</div>
      </FadeIn>
      <FadeIn delay={500}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "min(16vw, 130px)", color: "#e8f5ec", letterSpacing: 6, lineHeight: 0.88, textAlign: "center", margin: 0, textShadow: "0 0 80px rgba(127,255,154,0.06)" }}>GHOST<br />RACE</h1>
      </FadeIn>
      <FadeIn delay={900}>
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #3a7a52, transparent)", margin: "32px auto" }} />
      </FadeIn>
      <FadeIn delay={1100}>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: "#7a9a87", maxWidth: 460, textAlign: "center", lineHeight: 1.7, margin: "0 auto 48px" }}>
          A registry for athletes who design their own suffering. Run the course backwards before the race. Add 74 miles before the marathon. Upload your GPS and photos. Prove you did it.
        </p>
      </FadeIn>
      <FadeIn delay={1400}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => onEnter("registry")} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#0a0f0c", background: "#7fff9a", border: "none", padding: "14px 40px", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = "#a0ffb8"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#7fff9a"; e.target.style.transform = "translateY(0)"; }}>
            Browse The Registry
          </button>
          <button onClick={() => onEnter("submit")} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#7fff9a", background: "transparent", border: "1px solid #2a4a35", padding: "14px 40px", cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.borderColor = "#7fff9a"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2a4a35"; e.target.style.transform = "translateY(0)"; }}>
            Submit Your Ghost Race
          </button>
        </div>
      </FadeIn>
      <FadeIn delay={1800}>
        <div style={{ display: "flex", gap: 48, marginTop: 80, flexWrap: "wrap", justifyContent: "center" }}>
          <Stat value="127" label="Ghost Races" />
          <Stat value="14,200" label="Total Miles" />
          <Stat value="89" label="Athletes" />
        </div>
      </FadeIn>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════ */

function Nav({ page, onNav }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,15,12,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a2a20", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
      <div onClick={() => onNav("landing")} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#e8f5ec", letterSpacing: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#7fff9a", fontSize: 14 }}>◆</span> GHOST RACE
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {[["registry", "Registry"], ["submit", "Submit"]].map(([k, l]) => (
          <button key={k} onClick={() => onNav(k)} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: page === k ? "#7fff9a" : "#5a7a6a", background: "none", border: "none", cursor: "pointer", borderBottom: page === k ? "1px solid #7fff9a" : "1px solid transparent", padding: "4px 0" }}>{l}</button>
        ))}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   RACE CARD
   ═══════════════════════════════════════════ */

function RaceCard({ race, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "#0f1a14" : "#0c1310", border: `1px solid ${hov ? "#2a4a35" : "#1a2a20"}`, cursor: "pointer", transition: "all 0.3s", transform: hov ? "translateY(-2px)" : "none", overflow: "hidden" }}>
      <div style={{ height: 110, overflow: "hidden", borderBottom: "1px solid #1a2a20" }}>
        <CourseMap race={race} height={140} mini={true} />
      </div>
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#3a7a52", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#7fff9a", fontSize: 8 }}>●</span> GPS Verified · {race.photos.length} Photos
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <Avatar initials={race.avatar} size={32} />
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: "#7a9a87" }}>{race.athlete}</div>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#3a5a45", letterSpacing: 1 }}>{race.ghostRaceCount} Ghost {race.ghostRaceCount === 1 ? "Race" : "Races"}</div>
          </div>
        </div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#e8f5ec", letterSpacing: 1.5, margin: "0 0 4px", lineHeight: 1.1 }}>{race.title}</h3>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#5a7a6a", marginBottom: 14 }}>{race.anchor} · {race.anchorLocation}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Badge type={race.type} />
          <div style={{ display: "flex", gap: 18 }}>
            <Stat value={`${race.totalDistance}`} label="Total Mi" small />
            <Stat value={race.totalTime} label="Time" small />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REGISTRY
   ═══════════════════════════════════════════ */

function Registry({ onSelect }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? RACES : RACES.filter(r => r.type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0c", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#e8f5ec", letterSpacing: 2, margin: "0 0 8px" }}>The Registry</h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#5a7a6a", margin: "0 0 32px" }}>Every verified Ghost Race. Click to see full GPS tracks and course photos.</p>
        </FadeIn>
        <FadeIn delay={200}>
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: filter === t ? "#0a0f0c" : "#5a7a6a", background: filter === t ? "#7fff9a" : "transparent", border: `1px solid ${filter === t ? "#7fff9a" : "#1a2a20"}`, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t}</button>
            ))}
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {filtered.map((race, i) => (
            <FadeIn key={race.id} delay={300 + i * 100}>
              <RaceCard race={race} onClick={() => onSelect(race)} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DETAIL PAGE
   ═══════════════════════════════════════════ */

function Detail({ race, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0c", padding: "0 0 80px" }}>
      <FadeIn>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 20px 0" }}>
          <button onClick={onBack} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#5a7a6a", background: "none", border: "none", cursor: "pointer", letterSpacing: 2, textTransform: "uppercase", padding: 0, marginBottom: 16 }}>← Back to Registry</button>
        </div>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#5a7a6a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Click photo markers on the map to see where they were taken</div>
          <CourseMap race={race} height={400} />
        </div>
      </FadeIn>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        <FadeIn delay={100}>
          <div style={{ padding: "28px 0 0" }}>
            <Badge type={race.type} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#e8f5ec", letterSpacing: 2, lineHeight: 1, margin: "12px 0 10px" }}>{race.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <Avatar initials={race.avatar} size={36} />
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#7a9a87" }}>{race.athlete}</span>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a5a45", letterSpacing: 1 }}>{race.ghostRaceCount} Ghost {race.ghostRaceCount === 1 ? "Race" : "Races"}</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div style={{ background: "#0c1310", border: "1px solid #1a2a20", padding: 24, marginBottom: 28 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>The Numbers</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(85px, 1fr))", gap: 16 }}>
              <Stat value={`${race.ghostDistance}`} label="Ghost Mi" />
              <Stat value={`${race.anchorDistance}`} label="Race Mi" />
              <Stat value={`${race.totalDistance}`} label="Total Mi" />
              <Stat value={race.totalTime} label="Total Time" />
              <Stat value={race.elevationGain} label="Elevation" />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Anchor Event</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#e8f5ec", letterSpacing: 1 }}>{race.anchor}</div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#5a7a6a" }}>{race.anchorLocation} · {race.anchorDate}</div>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>The Story</div>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: "#8aaa97", lineHeight: 1.8, margin: 0 }}>{race.description}</p>
          </div>
        </FadeIn>

        <FadeIn delay={500}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>Photos From The Course</div>
            <div style={{ borderLeft: "1px solid #1a2a20", marginLeft: 8, paddingLeft: 24 }}>
              {race.photos.map((photo, i) => (
                <div key={i} style={{ position: "relative", paddingBottom: 24 }}>
                  <div style={{ position: "absolute", left: -30, top: 4, width: 11, height: 11, borderRadius: "50%", background: "#0a0f0c", border: "1.5px solid #3a7a52" }} />
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#7fff9a", letterSpacing: 2, marginBottom: 8 }}>{photo.time}</div>
                  <div style={{ height: 110, background: `linear-gradient(135deg, ${photo.color}, #0a0f0c)`, border: "1px solid #1a2a20", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(127,255,154,0.015) 15px, rgba(127,255,154,0.015) 16px)" }} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a4a35" strokeWidth="1"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M7 5V3h4v2" /></svg>
                  </div>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#6a8a77", lineHeight: 1.5, margin: 0 }}>{photo.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={600}>
          <div style={{ background: "#0c1310", border: "1px solid #1a2a20", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#7fff9a", fontSize: 10 }}>●</span>
            <div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#7fff9a", letterSpacing: 2, textTransform: "uppercase" }}>GPS Verified</div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: "#5a7a6a", marginTop: 2 }}>Garmin GPX uploaded · {race.anchorDate}</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUBMIT
   ═══════════════════════════════════════════ */

function Submit() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", anchor: "", location: "", date: "", type: "", description: "", ghostDist: "", anchorDist: "", totalTime: "" });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { width: "100%", fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#e8f5ec", background: "#080d0a", border: "1px solid #1a2a20", padding: "12px 16px", outline: "none", boxSizing: "border-box" };
  const lbl = { fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a7a52", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0c", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <FadeIn>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#e8f5ec", letterSpacing: 2, margin: "0 0 8px" }}>Submit Your Ghost Race</h2>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#5a7a6a", margin: "0 0 40px" }}>You did the work. Now make it official.</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
            {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 3, background: s <= step ? "#7fff9a" : "#1a2a20", transition: "background 0.4s" }} />)}
          </div>
        </FadeIn>

        {step === 1 && (
          <FadeIn delay={200}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#5a7a6a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Step 1 — The Basics</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label style={lbl}>Ghost Race Title</label><input style={inp} placeholder="e.g. The Double Door County" value={form.title} onChange={e => u("title", e.target.value)} /></div>
              <div><label style={lbl}>Anchor Event</label><input style={inp} placeholder="e.g. Door County 50 Miler" value={form.anchor} onChange={e => u("anchor", e.target.value)} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={lbl}>Location</label><input style={inp} placeholder="City, State" value={form.location} onChange={e => u("location", e.target.value)} /></div>
                <div><label style={lbl}>Date</label><input style={{...inp, colorScheme: "dark"}} type="date" value={form.date} onChange={e => u("date", e.target.value)} /></div>
              </div>
              <div>
                <label style={lbl}>Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Course Reversal", "Pre-Race Ultra", "Back-to-Back", "Expedition + Race", "Night Double", "Other"].map(t => (
                    <button key={t} onClick={() => u("type", t)} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: form.type === t ? "#0a0f0c" : "#5a7a6a", background: form.type === t ? "#7fff9a" : "transparent", border: `1px solid ${form.type === t ? "#7fff9a" : "#1a2a20"}`, padding: "8px 14px", cursor: "pointer" }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#0a0f0c", background: "#7fff9a", border: "none", padding: "14px 40px", cursor: "pointer", marginTop: 32 }}>Continue</button>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn delay={200}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#5a7a6a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Step 2 — Story, Numbers & Photos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label style={lbl}>Your Story</label><textarea style={{ ...inp, height: 120, resize: "vertical" }} placeholder="What did you do and why?" value={form.description} onChange={e => u("description", e.target.value)} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div><label style={lbl}>Ghost Miles</label><input style={inp} placeholder="50" value={form.ghostDist} onChange={e => u("ghostDist", e.target.value)} /></div>
                <div><label style={lbl}>Race Miles</label><input style={inp} placeholder="50" value={form.anchorDist} onChange={e => u("anchorDist", e.target.value)} /></div>
                <div><label style={lbl}>Total Time</label><input style={inp} placeholder="22h 47m" value={form.totalTime} onChange={e => u("totalTime", e.target.value)} /></div>
              </div>
              <div>
                <label style={lbl}>Course Photos</label>
                <div style={{ background: "#0c1310", border: "2px dashed #1a2a20", padding: 28, textAlign: "center", cursor: "pointer" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a7a52" strokeWidth="1.5" style={{ marginBottom: 6 }}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M7 5V3h4v2" /></svg>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#3a7a52", marginBottom: 4 }}>Drop Photos Here</div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#3a5a45", letterSpacing: 1 }}>Geotagged photos auto-placed on your course map</div>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: "#2a3a30", letterSpacing: 1, marginTop: 6 }}>JPG, PNG · Location from EXIF data</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#5a7a6a", background: "transparent", border: "1px solid #1a2a20", padding: "14px 32px", cursor: "pointer" }}>Back</button>
              <button onClick={() => setStep(3)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#0a0f0c", background: "#7fff9a", border: "none", padding: "14px 40px", cursor: "pointer" }}>Continue</button>
            </div>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn delay={200}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#5a7a6a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Step 3 — GPS Proof</div>
            <div style={{ background: "#0c1310", border: "2px dashed #1a2a20", padding: 44, textAlign: "center", marginBottom: 24, cursor: "pointer" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#3a7a52", marginBottom: 8 }}>Upload GPS File</div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: "#3a5a45", letterSpacing: 1 }}>.GPX or .FIT from Garmin, COROS, Apple Watch, Strava</div>
            </div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#3a5a45", lineHeight: 1.6, marginBottom: 32 }}>
              Your GPS track and geotagged photos will be displayed publicly — overlaid on the official race course so the community can see exactly what you did.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#5a7a6a", background: "transparent", border: "1px solid #1a2a20", padding: "14px 32px", cursor: "pointer" }}>Back</button>
              <button onClick={() => setStep(4)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#0a0f0c", background: "#7fff9a", border: "none", padding: "14px 40px", cursor: "pointer" }}>Submit Ghost Race</button>
            </div>
          </FadeIn>
        )}

        {step === 4 && (
          <FadeIn delay={200}>
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, color: "#7fff9a", lineHeight: 1, marginBottom: 16 }}>◆</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#e8f5ec", letterSpacing: 2, margin: "0 0 12px" }}>Ghost Race Submitted</h2>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: "#5a7a6a", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
                Your GPS track and course photos are under review. Once verified, your Ghost Race will appear in the registry with the full interactive map.
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [page, setPage] = useState("landing");
  const [selected, setSelected] = useState(null);
  const nav = p => { setPage(p); setSelected(null); window.scrollTo(0, 0); };

  return (
    <div style={{ background: "#0a0f0c", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Courier+Prime:ital@0;1&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f0c; }
        ::selection { background: #7fff9a; color: #0a0f0c; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      {page !== "landing" && <Nav page={page} onNav={nav} />}
      {page === "landing" && <Landing onEnter={nav} />}
      {page === "registry" && !selected && <Registry onSelect={r => { setSelected(r); setPage("detail"); window.scrollTo(0, 0); }} />}
      {page === "detail" && selected && <Detail race={selected} onBack={() => nav("registry")} />}
      {page === "submit" && <Submit />}
    </div>
  );
}
