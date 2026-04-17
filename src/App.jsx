import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

/* ===================================================================
   DATA
   =================================================================== */

const makeTrack = (points) => points.map(([x, y]) => ({ x, y }));

const RACES = [
  {
    id: 1, athlete: "Marcus Chen", title: "The Double Door County",
    anchor: "Door County 50 Miler", anchorLocation: "Door County, WI", anchorDate: "Oct 12, 2025",
    description: "Ran the entire 50-mile course in reverse starting at 8PM Friday night. Headlamp on, alone in the dark through the Wisconsin countryside. Arrived at the start line just as the official race began Saturday morning — then turned around and ran the full 50 with the field. 100 miles. One course. Both directions.",
    ghostDistance: 50, anchorDistance: 50, totalDistance: 100, totalTime: "22h 47m", elevationGain: "4,200 ft",
    type: "Course Reversal", verified: true, avatar: "MC", ghostRaceCount: 3,
    officialTrack: makeTrack([[45,320],[70,305],[105,290],[140,270],[175,255],[200,235],[230,220],[265,200],[290,175],[310,155],[335,140],[360,120],[385,105],[410,95],[440,80],[470,65],[500,55],[530,50],[560,42],[590,38],[620,45],[645,55],[670,50],[695,42]]),
    ghostTrack: makeTrack([[695,58],[670,65],[645,70],[620,60],[590,53],[560,57],[530,65],[500,70],[470,80],[440,95],[410,110],[385,120],[360,135],[335,155],[310,170],[290,190],[265,215],[230,235],[200,250],[175,270],[140,285],[105,305],[70,320],[45,335]]),
    center: [45.03, -87.18],
    officialRoute: [
      [45.192, -87.130], [45.186, -87.138], [45.178, -87.148], [45.170, -87.161],
      [45.162, -87.175], [45.155, -87.188], [45.148, -87.200], [45.142, -87.212],
      [45.136, -87.225], [45.133, -87.240], [45.124, -87.250], [45.115, -87.258],
      [45.105, -87.265], [45.092, -87.272], [45.078, -87.278], [45.062, -87.283],
      [45.046, -87.287], [45.020, -87.295], [44.995, -87.305], [44.970, -87.315],
      [44.942, -87.325], [44.915, -87.335], [44.890, -87.345], [44.868, -87.355],
      [44.852, -87.365], [44.840, -87.372], [44.834, -87.377]
    ],
    ghostRoute: [
      [44.834, -87.380], [44.840, -87.375], [44.852, -87.368], [44.868, -87.358],
      [44.890, -87.348], [44.915, -87.338], [44.942, -87.328], [44.970, -87.318],
      [44.995, -87.308], [45.020, -87.298], [45.046, -87.290], [45.062, -87.286],
      [45.078, -87.281], [45.092, -87.275], [45.105, -87.268], [45.115, -87.261],
      [45.124, -87.253], [45.133, -87.243], [45.136, -87.228], [45.142, -87.215],
      [45.148, -87.203], [45.155, -87.191], [45.162, -87.178], [45.170, -87.164],
      [45.178, -87.151], [45.186, -87.141], [45.192, -87.133]
    ],
    photos: [
      { x: 620, y: 52, time: "11:42 PM", caption: "Mile 8 — Total darkness on the peninsula road. Just me and the headlamp.", color: "#1a3328", lat: 44.970, lng: -87.318 },
      { x: 360, y: 128, time: "3:15 AM", caption: "Mile 31 — First light breaking through the trees. The loneliest I've ever felt in a race.", color: "#0f2a1e", lat: 45.078, lng: -87.281 },
      { x: 140, y: 278, time: "6:50 AM", caption: "Mile 47 — Approaching the start line. I can see headlights from the parking area. They have no idea.", color: "#1a2d22", lat: 45.170, lng: -87.164 },
      { x: 500, y: 62, time: "2:30 PM", caption: "Mile 78 — Running the same stretch in daylight that I ran in darkness 15 hours ago. Completely different course.", color: "#162e20", lat: 45.046, lng: -87.290 },
    ],
  },
  {
    id: 2, athlete: "James Whitfield", title: "74 Before Houston",
    anchor: "Houston Marathon", anchorLocation: "Houston, TX", anchorDate: "Jan 19, 2025",
    description: "Started at 10PM Saturday night. Ran 74 miles through the streets of Houston in the dark — loops, out-and-backs, whatever it took. Timed it so the final mile connected to the marathon start corral. When the gun went off at 7AM, I was already 74 miles deep. Crossed the marathon finish at mile 100.2.",
    ghostDistance: 74, anchorDistance: 26.2, totalDistance: 100.2, totalTime: "24h 12m", elevationGain: "890 ft",
    type: "Pre-Race Ultra", verified: true, avatar: "JW", ghostRaceCount: 1,
    officialTrack: makeTrack([[350,300],[370,280],[400,265],[430,250],[460,240],[490,225],[510,205],[520,180],[510,155],[490,140],[460,130],[430,125],[400,130],[380,145],[370,165],[375,190],[390,210],[410,225],[430,235],[460,240],[480,250],[490,265],[485,285],[470,300]]),
    ghostTrack: makeTrack([[350,315],[320,300],[290,280],[260,265],[230,275],[210,295],[195,315],[185,290],[175,265],[165,240],[180,220],[200,205],[225,195],[250,185],[270,170],[285,150],[300,135],[280,120],[255,110],[230,105],[210,115],[195,135],[185,160],[180,185],[190,210],[210,230],[235,245],[260,255],[285,260],[310,265],[330,275],[345,290],[350,310]]),
    center: [29.76, -95.37],
    officialRoute: [
      [29.753, -95.360], [29.757, -95.370], [29.760, -95.382], [29.762, -95.395],
      [29.763, -95.408], [29.760, -95.420], [29.758, -95.432], [29.763, -95.432],
      [29.768, -95.428], [29.770, -95.418], [29.768, -95.408], [29.762, -95.398],
      [29.758, -95.417], [29.754, -95.417], [29.750, -95.408], [29.748, -95.395],
      [29.745, -95.383], [29.745, -95.372], [29.748, -95.362], [29.750, -95.355],
      [29.752, -95.352], [29.753, -95.356], [29.753, -95.358], [29.753, -95.360]
    ],
    ghostRoute: [
      [29.753, -95.360], [29.757, -95.358], [29.765, -95.355], [29.775, -95.360],
      [29.785, -95.370], [29.795, -95.385], [29.801, -95.399], [29.795, -95.410],
      [29.785, -95.415], [29.775, -95.418], [29.770, -95.425], [29.765, -95.432],
      [29.763, -95.432], [29.755, -95.425], [29.750, -95.415], [29.748, -95.400],
      [29.752, -95.385], [29.758, -95.375], [29.763, -95.368], [29.758, -95.358],
      [29.752, -95.350], [29.748, -95.345], [29.750, -95.355], [29.755, -95.365],
      [29.760, -95.378], [29.762, -95.392], [29.760, -95.405], [29.756, -95.418],
      [29.753, -95.362], [29.753, -95.360]
    ],
    photos: [
      { x: 195, y: 310, time: "11:30 PM", caption: "Mile 6 — Empty Houston streets. The city is asleep and I've got 94 miles to go.", color: "#1a2825", lat: 29.775, lng: -95.360 },
      { x: 175, y: 258, time: "2:45 AM", caption: "Mile 28 — Refueling at a 24hr gas station. The cashier thinks I'm crazy.", color: "#12261e", lat: 29.801, lng: -95.399 },
      { x: 350, y: 308, time: "6:55 AM", caption: "Mile 74 — Joining the marathon corral. 30,000 fresh runners. I'm shaking.", color: "#1e3328", lat: 29.753, lng: -95.360 },
    ],
  },
  {
    id: 3, athlete: "Sarah Okafor", title: "Back-to-Back Iron",
    anchor: "IRONMAN Texas", anchorLocation: "The Woodlands, TX", anchorDate: "Apr 26, 2025",
    description: "Completed a full 70.3 Half Ironman on Saturday — 1.2mi swim, 56mi bike, 13.1mi run. Slept four hours. Then lined up Sunday morning for the full IRONMAN — 2.4mi swim, 112mi bike, 26.2mi run. 210.9 total miles across two days of racing.",
    ghostDistance: 70.3, anchorDistance: 140.6, totalDistance: 210.9, totalTime: "32h 08m", elevationGain: "2,100 ft",
    type: "Back-to-Back", verified: true, avatar: "SO", ghostRaceCount: 5,
    officialTrack: makeTrack([[80,180],[100,160],[130,145],[165,135],[200,130],[240,128],[280,130],[320,135],[360,145],[400,150],[440,148],[480,140],[520,135],[560,138],[600,148],[630,165],[650,185],[655,210],[640,235],[615,250],[585,255],[555,248],[530,235],[510,218]]),
    ghostTrack: makeTrack([[80,200],[110,215],[145,225],[180,230],[215,228],[250,222],[285,218],[320,222],[350,232],[375,245],[395,260],[410,278],[420,298],[415,318],[400,332],[375,338],[350,330],[330,315],[315,295],[305,275],[300,255],[305,235],[315,218],[330,205]]),
    center: [30.17, -95.46],
    officialRoute: [
      [30.182, -95.479], [30.188, -95.485], [30.198, -95.495], [30.212, -95.505],
      [30.228, -95.515], [30.245, -95.525], [30.265, -95.535], [30.285, -95.545],
      [30.305, -95.550], [30.325, -95.552], [30.340, -95.552], [30.350, -95.550],
      [30.345, -95.540], [30.330, -95.530], [30.310, -95.518], [30.285, -95.508],
      [30.258, -95.498], [30.230, -95.490], [30.205, -95.482], [30.185, -95.478],
      [30.172, -95.472], [30.168, -95.465], [30.170, -95.460], [30.175, -95.465],
      [30.178, -95.472]
    ],
    ghostRoute: [
      [30.182, -95.479], [30.185, -95.485], [30.190, -95.492], [30.198, -95.498],
      [30.208, -95.505], [30.220, -95.510], [30.232, -95.515], [30.242, -95.518],
      [30.250, -95.518], [30.255, -95.515], [30.258, -95.508], [30.255, -95.500],
      [30.248, -95.492], [30.238, -95.485], [30.225, -95.478], [30.210, -95.472],
      [30.195, -95.470], [30.182, -95.470], [30.175, -95.472], [30.170, -95.472],
      [30.170, -95.468], [30.172, -95.463], [30.176, -95.468], [30.180, -95.474],
      [30.182, -95.479]
    ],
    photos: [
      { x: 280, y: 130, time: "SAT 9:15 AM", caption: "Half Ironman bike leg — feeling strong. Tomorrow is going to be a different story.", color: "#18302a", lat: 30.220, lng: -95.510 },
      { x: 400, y: 335, time: "SAT 4:30 PM", caption: "Finishing the 70.3. Legs are already questioning tomorrow's decision.", color: "#142820", lat: 30.182, lng: -95.479 },
      { x: 440, y: 146, time: "SUN 1:20 PM", caption: "Full Ironman bike — mile 80. The wheels are coming off but I'm still moving.", color: "#1a332a", lat: 30.325, lng: -95.552 },
      { x: 530, y: 232, time: "SUN 8:45 PM", caption: "Final marathon miles. Walking more than running. Don't care. I'm finishing this.", color: "#0f2418", lat: 30.170, lng: -95.465 },
    ],
  },
  {
    id: 4, athlete: "Derek Mu\u00f1oz", title: "Leadville the Long Way",
    anchor: "Leadville Trail 100", anchorLocation: "Leadville, CO", anchorDate: "Aug 16, 2025",
    description: "Hiked from Aspen to Leadville over 3 days covering 47 miles at altitude — crossing the Continental Divide at 12,500 feet. Arrived at the Leadville 100 start with 2 hours to spare. Then ran the full 100-mile race through the Rockies. 147 total miles. All above 9,000 feet.",
    ghostDistance: 47, anchorDistance: 100, totalDistance: 147, totalTime: "4 days", elevationGain: "18,400 ft",
    type: "Expedition + Race", verified: true, avatar: "DM", ghostRaceCount: 2,
    officialTrack: makeTrack([[360,280],[380,260],[405,245],[430,230],[455,218],[475,200],[490,180],[500,158],[505,138],[495,118],[480,105],[460,95],[435,92],[410,98],[390,112],[378,132],[375,155],[380,178],[392,200],[410,218],[430,230],[450,245],[465,262],[470,280]]),
    ghostTrack: makeTrack([[60,90],[85,105],[115,118],[145,125],[175,128],[200,120],[220,108],[240,98],[265,95],[290,105],[310,120],[325,140],[335,162],[340,185],[345,210],[350,235],[355,258],[360,280]]),
    center: [39.20, -106.40],
    officialRoute: [
      [39.251, -106.292], [39.258, -106.310], [39.265, -106.330], [39.275, -106.358],
      [39.260, -106.370], [39.240, -106.375], [39.215, -106.378], [39.185, -106.380],
      [39.150, -106.380], [39.115, -106.378], [39.080, -106.377], [39.055, -106.410],
      [39.035, -106.460], [39.020, -106.510], [39.003, -106.559], [38.993, -106.580],
      [38.983, -106.593], [39.003, -106.559], [39.020, -106.510], [39.035, -106.460],
      [39.055, -106.410], [39.080, -106.377], [39.115, -106.378], [39.150, -106.380],
      [39.185, -106.380], [39.215, -106.378], [39.240, -106.375], [39.260, -106.370],
      [39.275, -106.358], [39.265, -106.330], [39.258, -106.310], [39.251, -106.292]
    ],
    ghostRoute: [
      [39.191, -106.817], [39.175, -106.790], [39.160, -106.760], [39.148, -106.730],
      [39.138, -106.700], [39.128, -106.670], [39.118, -106.640], [39.110, -106.610],
      [39.107, -106.563], [39.115, -106.530], [39.130, -106.500], [39.150, -106.470],
      [39.170, -106.440], [39.190, -106.410], [39.210, -106.385], [39.225, -106.360],
      [39.238, -106.335], [39.245, -106.315], [39.250, -106.300], [39.251, -106.292]
    ],
    photos: [
      { x: 145, y: 125, time: "DAY 1", caption: "Independence Pass. 12,095 feet. The start of something massive.", color: "#1a2d30", lat: 39.107, lng: -106.563 },
      { x: 265, y: 95, time: "DAY 2", caption: "Continental Divide crossing. Can see for 50 miles in every direction.", color: "#122830", lat: 39.150, lng: -106.470 },
      { x: 355, y: 258, time: "DAY 3", caption: "Walking into Leadville. My legs have 47 miles on them and I haven't even started the race.", color: "#182a22", lat: 39.245, lng: -106.315 },
      { x: 505, y: 138, time: "RACE NIGHT", caption: "Hope Pass at midnight during the 100. Second time over 12,000 feet this week.", color: "#0f2225", lat: 39.003, lng: -106.559 },
    ],
  },
  {
    id: 5, athlete: "Ava Lindstr\u00f6m", title: "Midnight Superior",
    anchor: "Superior 50K", anchorLocation: "Lutsen, MN", anchorDate: "May 17, 2025",
    description: "Started at midnight and ran the entire Superior 50K course in full darkness with a headlamp — rocky single-track, river crossings, 4,000 feet of climbing. Finished at the start as other runners gathered for the 6AM gun. Then ran it again with the field at sunrise. Same course. Twice.",
    ghostDistance: 31, anchorDistance: 31, totalDistance: 62, totalTime: "14h 33m", elevationGain: "7,800 ft",
    type: "Night Double", verified: true, avatar: "AL", ghostRaceCount: 4,
    officialTrack: makeTrack([[60,250],[90,235],[120,215],[145,195],[170,180],[200,170],[235,162],[270,155],[300,148],[330,140],[355,128],[380,115],[410,108],[445,105],[480,110],[510,120],[540,135],[565,150],[590,165],[615,175],[640,180],[665,172],[690,160]]),
    ghostTrack: makeTrack([[60,265],[90,250],[120,232],[145,212],[170,196],[200,185],[235,178],[270,170],[300,163],[330,156],[355,143],[380,130],[410,123],[445,120],[480,125],[510,135],[540,150],[565,166],[590,180],[615,190],[640,195],[665,187],[690,175]]),
    center: [47.65, -90.70],
    officialRoute: [
      [47.670, -90.710], [47.660, -90.720], [47.648, -90.732], [47.635, -90.745],
      [47.622, -90.758], [47.610, -90.770], [47.600, -90.785], [47.590, -90.800],
      [47.579, -90.845], [47.565, -90.862], [47.548, -90.878], [47.530, -90.888],
      [47.510, -90.895], [47.500, -90.900], [47.510, -90.895], [47.530, -90.888],
      [47.548, -90.878], [47.565, -90.862], [47.579, -90.845], [47.590, -90.800],
      [47.600, -90.785], [47.610, -90.770]
    ],
    ghostRoute: [
      [47.671, -90.711], [47.661, -90.721], [47.649, -90.733], [47.636, -90.746],
      [47.623, -90.759], [47.611, -90.771], [47.601, -90.786], [47.591, -90.801],
      [47.580, -90.846], [47.566, -90.863], [47.549, -90.879], [47.531, -90.889],
      [47.511, -90.896], [47.501, -90.901], [47.511, -90.896], [47.531, -90.889],
      [47.549, -90.879], [47.566, -90.863], [47.580, -90.846], [47.591, -90.801],
      [47.601, -90.786], [47.611, -90.771]
    ],
    photos: [
      { x: 200, y: 178, time: "1:30 AM", caption: "Single-track by headlamp. Every root is trying to kill me.", color: "#0f1f28", lat: 47.622, lng: -90.759 },
      { x: 445, y: 112, time: "3:50 AM", caption: "Carlton Peak summit in total darkness. The stars are absurd up here.", color: "#0a1a25", lat: 47.579, lng: -90.845 },
      { x: 60, y: 258, time: "5:55 AM", caption: "Back at the start. Runners stretching, drinking coffee. I just ran their entire race in the dark.", color: "#1a2830", lat: 47.671, lng: -90.711 },
      { x: 540, y: 142, time: "11:20 AM", caption: "Same section, now in daylight. I can finally see what I was running through.", color: "#152a20", lat: 47.549, lng: -90.879 },
    ],
  },
];

const TYPES = ["All", "Course Reversal", "Pre-Race Ultra", "Back-to-Back", "Expedition + Race", "Night Double"];

/* ===================================================================
   SHARED COMPONENTS
   =================================================================== */

function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function Avatar({ initials, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 0, background: "#111111", border: "1px solid #2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: size * 0.35, color: "#C8B87C", letterSpacing: 1, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Stat({ value, label, small }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: small ? 20 : 28, color: "#C8B87C", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: small ? 8 : 10, color: "#666666", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Badge({ type }) {
  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#A0915A", border: "1px solid #2A2A2A", padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", borderRadius: 0 }}>
      {type}
    </span>
  );
}

function StatusDot({ status = "verified" }) {
  const colors = { verified: "#4A7C59", pending: "#B8860B", rejected: "#8B3A3A" };
  const labels = { verified: "Verified", pending: "Pending", rejected: "Rejected" };
  const c = colors[status] || colors.verified;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", animation: status === "pending" ? "pulseStatus 2s ease infinite" : "none" }} />
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: c, textTransform: "uppercase", letterSpacing: "0.1em" }}>{labels[status]}</span>
    </span>
  );
}

/* ===================================================================
   REAL MAP (Leaflet)
   =================================================================== */

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    map.fitBounds(points, { padding: [24, 24] });
  }, [map, points]);
  return null;
}

function RealMap({ race, height = 400, mini = false }) {
  const official = race.officialRoute || [];
  const ghost = race.ghostRoute || [];
  const allPoints = [...official, ...ghost];
  const tileUrl = mini
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div style={{ position: "relative", background: "#0A0A0A", border: mini ? "none" : "1px solid #2A2A2A", overflow: "hidden" }}>
      <MapContainer
        center={race.center}
        zoom={mini ? 10 : 11}
        style={{ height, width: "100%", background: "#0A0A0A" }}
        zoomControl={!mini}
        dragging={!mini}
        scrollWheelZoom={!mini}
        doubleClickZoom={!mini}
        touchZoom={!mini}
        keyboard={!mini}
        attributionControl={!mini}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        {allPoints.length > 0 && <FitBounds points={allPoints} />}

        {official.length > 0 && (
          <Polyline positions={official} pathOptions={{ color: "#999999", weight: 3, dashArray: "8, 8", opacity: 0.8 }} />
        )}
        {ghost.length > 0 && (
          <Polyline positions={ghost} pathOptions={{ color: "#C8B87C", weight: 4, opacity: 1 }} />
        )}

        {!mini && official.length > 0 && (
          <>
            <CircleMarker
              center={official[0]}
              radius={7}
              pathOptions={{ color: "#d8dce8", fillColor: "#0A0A0A", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#d8dce8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Official Start</div>
              </Popup>
            </CircleMarker>
            <CircleMarker
              center={official[official.length - 1]}
              radius={7}
              pathOptions={{ color: "#ffb84a", fillColor: "#0A0A0A", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#ffb84a", letterSpacing: "0.1em", textTransform: "uppercase" }}>Official Finish</div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {!mini && ghost.length > 0 && (
          <>
            <CircleMarker
              center={ghost[0]}
              radius={7}
              pathOptions={{ color: "#C8B87C", fillColor: "#0A0A0A", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ghost Start</div>
              </Popup>
            </CircleMarker>
            <CircleMarker
              center={ghost[ghost.length - 1]}
              radius={7}
              pathOptions={{ color: "#C8B87C", fillColor: "#0A0A0A", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ghost Finish</div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {!mini && race.photos && race.photos.map((photo, i) => (
          (photo.lat && photo.lng) ? (
            <CircleMarker
              key={i}
              center={[photo.lat, photo.lng]}
              radius={6}
              pathOptions={{ color: "#A0915A", fillColor: "#0A0A0A", fillOpacity: 1, weight: 1.5 }}
            >
              <Popup>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.15em", marginBottom: 6, textTransform: "uppercase" }}>{photo.time}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#E0E0E0", lineHeight: 1.5, maxWidth: 240 }}>{photo.caption}</div>
              </Popup>
            </CircleMarker>
          ) : null
        ))}
      </MapContainer>

      {!mini && (
        <div style={{ position: "absolute", bottom: 12, right: 16, zIndex: 500, display: "flex", gap: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", background: "rgba(10,10,10,0.85)", padding: "8px 12px", border: "1px solid #2A2A2A", pointerEvents: "none" }}>
          <span style={{ color: "#C8B87C", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#C8B87C" strokeWidth="2" /></svg> MISSION ROUTE
          </span>
          <span style={{ color: "#999999", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#999999" strokeWidth="2" strokeDasharray="4,4" /></svg> OFFICIAL COURSE
          </span>
          <span style={{ color: "#A0915A", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#0A0A0A" stroke="#A0915A" strokeWidth="1.5" /></svg> PHOTO
          </span>
        </div>
      )}
    </div>
  );
}

/* ===================================================================
   NAV
   =================================================================== */

function Nav({ page, onNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["missions", "MISSIONS"], ["map", "MAP"], ["submit", "SUBMIT"], ["about", "ABOUT"]];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #2A2A2A", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <div onClick={() => onNav("landing")} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, color: "#C8B87C", letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase" }}>
        GHOSTED
      </div>
      {/* Desktop links */}
      <div className="nav-desktop" style={{ display: "flex", gap: 24 }}>
        {links.map(([k, l]) => (
          <button key={k} onClick={() => onNav(k)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: page === k ? "#C8B87C" : "#999999", background: "none", border: "none", cursor: "pointer", borderBottom: page === k ? "2px solid #C8B87C" : "2px solid transparent", padding: "4px 0", transition: "color 0.2s" }}>{l}</button>
        ))}
      </div>
      {/* Mobile hamburger */}
      <button className="nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, flexDirection: "column", gap: 4 }}>
        <span style={{ display: "block", width: 20, height: 2, background: "#C8B87C" }} />
        <span style={{ display: "block", width: 20, height: 2, background: "#C8B87C" }} />
        <span style={{ display: "block", width: 20, height: 2, background: "#C8B87C" }} />
      </button>
      {/* Mobile slide-in */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, right: 0, bottom: 0, width: 220, background: "#111111", borderLeft: "1px solid #2A2A2A", display: "flex", flexDirection: "column", padding: "24px", gap: 16, zIndex: 200 }}>
          {links.map(([k, l]) => (
            <button key={k} onClick={() => { onNav(k); setMenuOpen(false); }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.1em", color: page === k ? "#C8B87C" : "#999999", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "8px 0", borderBottom: "1px solid #2A2A2A" }}>{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ===================================================================
   LANDING
   =================================================================== */

function Landing({ onEnter }) {
  return (
    <div>
      {/* HERO */}
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
        {/* Topo SVG pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 80 Q50 60 100 80 T200 80' fill='none' stroke='%23C8B87C' stroke-width='0.5'/%3E%3Cpath d='M0 120 Q50 100 100 120 T200 120' fill='none' stroke='%23C8B87C' stroke-width='0.5'/%3E%3Cpath d='M0 160 Q50 140 100 160 T200 160' fill='none' stroke='%23C8B87C' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", animation: "topoDrift 75s linear infinite" }} />
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, #C8B87C 60px, #C8B87C 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, #C8B87C 60px, #C8B87C 61px)" }} />

        <ScrollReveal delay={100}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#A0915A", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>
            DECLARE THE MISSION. EXECUTE IT. LEAVE PROOF. DISAPPEAR.
          </div>
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "min(14vw, 120px)", color: "#F5F5F0", letterSpacing: "0.08em", lineHeight: 0.9, textAlign: "center", margin: 0, textTransform: "uppercase" }}>
            GHOSTED
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={500}>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #C8B87C, transparent)", margin: "32px auto" }} />
        </ScrollReveal>
        <ScrollReveal delay={700}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            <button onClick={() => onEnter("missions")} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8B87C", background: "transparent", border: "1px solid #C8B87C", padding: "14px 36px", cursor: "pointer", transition: "all 0.3s", borderRadius: 0 }}
              onMouseEnter={e => { e.target.style.background = "#C8B87C"; e.target.style.color = "#0A0A0A"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#C8B87C"; }}>
              BROWSE MISSIONS
            </button>
            <button onClick={() => onEnter("submit")} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999999", background: "transparent", border: "none", padding: "14px 36px", cursor: "pointer", transition: "all 0.3s", borderRadius: 0 }}
              onMouseEnter={e => { e.target.style.color = "#F5F5F0"; }}
              onMouseLeave={e => { e.target.style.color = "#999999"; }}>
              SUBMIT A MISSION
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={900}>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap", marginTop: 64 }}>
            <Stat value="127" label="Missions" />
            <Stat value="14,200" label="Total Miles" />
            <Stat value="89" label="Operators" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1100}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginTop: 48 }}>
            <span>STATUS: <span style={{ color: "#4A7C59" }}>ACTIVE</span></span>
            <span>LOGGED: <span style={{ color: "#999" }}>127</span></span>
            <span>VERIFIED: <span style={{ color: "#999" }}>2025-10-12</span></span>
          </div>
        </ScrollReveal>
      </div>

      {/* THE PROTOCOL */}
      <div style={{ background: "#0A0A0A", padding: "100px 20px", borderTop: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, color: "#C8B87C", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 48px", textAlign: "center" }}>THE PROTOCOL</h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, justifyContent: "center", position: "relative" }}>
              {[
                { num: "01", title: "DECLARE", desc: "Define your mission. Pick the anchor race. Set the rules." },
                { num: "02", title: "EXECUTE", desc: "Run the mission. Solo, unassisted, on your terms." },
                { num: "03", title: "SUBMIT", desc: "Upload GPS data, geotagged photos, and your mission report." },
                { num: "04", title: "VERIFY", desc: "Community and algorithm review your proof." },
                { num: "05", title: "RECORD", desc: "Your mission is logged in the permanent registry." },
              ].map((step, i) => (
                <div key={i} style={{ flex: "1 1 180px", maxWidth: 200, textAlign: "center", padding: "0 12px", position: "relative" }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 48, color: "#A0915A", lineHeight: 1 }}>{step.num}</div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#F5F5F0", letterSpacing: "0.12em", marginTop: 8, textTransform: "uppercase" }}>{step.title}</div>
                  <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#999999", marginTop: 8, lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* RECENT MISSIONS */}
      <div style={{ background: "#0A0A0A", padding: "80px 20px", borderTop: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, color: "#C8B87C", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 32px" }}>RECENT MISSIONS</h2>
          </ScrollReveal>
          {RACES.slice(0, 3).map((race, i) => (
            <ScrollReveal key={race.id} delay={i * 100}>
              <div onClick={() => onEnter("missions")} style={{ display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 80px", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid #2A2A2A", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#111111"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <StatusDot status="verified" />
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#E0E0E0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{race.title}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666" }}>{race.anchor}</div>
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#E0E0E0" }}>{race.athlete}</div>
                <Badge type={race.type} />
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, color: "#C8B87C", textAlign: "right" }}>{race.totalDistance} mi</div>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={400}>
            <button onClick={() => onEnter("missions")} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#C8B87C", background: "none", border: "none", cursor: "pointer", marginTop: 24, letterSpacing: "0.1em", padding: 0 }}>
              VIEW ALL MISSIONS &rarr;
            </button>
          </ScrollReveal>
        </div>
      </div>

      {/* ETHOS */}
      <div style={{ background: "#0A0A0A", padding: "100px 20px", borderTop: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, color: "#E0E0E0", textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.4, margin: "0 0 24px" }}>
              No crowds. No medals. No fanfare. Just the mission, the proof, and the record.
            </h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #C8B87C, transparent)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#999999", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              Ghosted is a registry for athletes who design their own suffering. Run the course backwards before the race starts. Add 74 miles before the marathon. Complete a half ironman the day before the full. Upload your GPS data and photos. Prove you did it. Then disappear.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0A0A0A", borderTop: "1px solid #2A2A2A", padding: "48px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#C8B87C", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>GHOSTED</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666", letterSpacing: "0.1em" }}>DECLARE. EXECUTE. PROVE. DISAPPEAR.</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666", marginTop: 16 }}>&copy; GHOSTED MMXXVI</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["missions", "MISSIONS"], ["map", "MAP"], ["submit", "SUBMIT"], ["about", "ABOUT"]].map(([k, l]) => (
              <button key={k} onClick={() => onEnter(k)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#999999", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", padding: "4px 0" }}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===================================================================
   REGISTRY (table layout)
   =================================================================== */

function Registry({ onSelect }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = RACES.filter(r => {
    if (filter !== "All" && r.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.athlete.toLowerCase().includes(q) || r.anchor.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>MISSIONS</h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#999999", margin: "0 0 32px" }}>Every verified mission. Click to see full GPS tracks and field photos.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: filter === t ? "#0A0A0A" : "#999999", background: filter === t ? "#C8B87C" : "transparent", border: `1px solid ${filter === t ? "#C8B87C" : "#2A2A2A"}`, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", borderRadius: 0 }}>{t}</button>
            ))}
          </div>
          <div style={{ marginBottom: 32 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH MISSIONS..."
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#E0E0E0", background: "transparent", border: "none", borderBottom: "1px solid #2A2A2A", padding: "8px 0", width: "100%", maxWidth: 300, outline: "none", letterSpacing: "0.1em" }}
            />
          </div>
        </ScrollReveal>

        {/* Table header */}
        <ScrollReveal delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 80px 100px 80px 100px", gap: 8, padding: "8px 12px", borderBottom: "1px solid #2A2A2A", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <div>STATUS</div>
            <div>MISSION</div>
            <div>OPERATOR</div>
            <div>TYPE</div>
            <div>DIST</div>
            <div>ELEV</div>
            <div>TIME</div>
            <div>DATE</div>
          </div>
        </ScrollReveal>

        {/* Table rows */}
        {filtered.map((race, i) => (
          <ScrollReveal key={race.id} delay={250 + i * 50}>
            <div onClick={() => onSelect(race)}
              style={{ display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 80px 100px 80px 100px", gap: 8, padding: "14px 12px", background: "#111111", borderBottom: "1px solid #2A2A2A", cursor: "pointer", transition: "all 0.2s", alignItems: "center" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.boxShadow = "inset 3px 0 0 #C8B87C"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#111111"; e.currentTarget.style.boxShadow = "none"; }}>
              <div><StatusDot status={race.verified ? "verified" : "pending"} /></div>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#E0E0E0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{race.title}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666" }}>{race.anchor}</div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#E0E0E0" }}>{race.athlete}</div>
              <div><Badge type={race.type} /></div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#E0E0E0" }}>{race.totalDistance} mi</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#999999" }}>{race.elevationGain}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#999999" }}>{race.totalTime}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#999999" }}>{race.anchorDate}</div>
            </div>
          </ScrollReveal>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#666666" }}>No missions found.</div>
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   DETAIL (two-column)
   =================================================================== */

function Detail({ race, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", padding: "0 0 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 0" }}>
        <ScrollReveal>
          <button onClick={onBack} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#999999", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", padding: 0, marginBottom: 24 }}>&larr; BACK TO MISSIONS</button>
        </ScrollReveal>

        {/* Full-width metadata header */}
        <ScrollReveal delay={100}>
          <div style={{ background: "#111111", border: "1px solid #2A2A2A", padding: "28px 32px", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <StatusDot status={race.verified ? "verified" : "pending"} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666", letterSpacing: "0.15em" }}>MISSION ID: GP-{String(race.id).padStart(4, "0")}</span>
            </div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, color: "#F5F5F0", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1, margin: "0 0 20px" }}>{race.title}</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
              {[
                ["OPERATOR", race.athlete],
                ["DATE", race.anchorDate],
                ["ANCHOR EVENT", race.anchor],
                ["LOCATION", race.anchorLocation],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#E0E0E0" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Two-column layout */}
        <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>
          {/* Left column */}
          <div>
            <ScrollReveal delay={200}>
              <div style={{ marginBottom: 24 }}>
                <Badge type={race.type} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>MISSION BRIEF</div>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#E0E0E0", lineHeight: 1.8, margin: 0 }}>{race.description}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Click photo markers on the map to see where they were taken</div>
                <RealMap race={race} height={400} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>FIELD PHOTOS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {race.photos.map((photo, i) => (
                    <div key={i}>
                      <div style={{ height: 120, background: `linear-gradient(135deg, ${photo.color}, #0A0A0A)`, border: "1px solid #2A2A2A", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(200,184,124,0.015) 15px, rgba(200,184,124,0.015) 16px)" }} />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="1"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M7 5V3h4v2" /></svg>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.1em", marginBottom: 4 }}>{photo.time}</div>
                      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#999999", lineHeight: 1.5, margin: 0 }}>{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right sidebar */}
          <div className="detail-sidebar" style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <ScrollReveal delay={300}>
              <div style={{ background: "#111111", border: "1px solid #2A2A2A", padding: 24, marginBottom: 20 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>MISSION STATS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <Stat value={`${race.ghostDistance}`} label="Mission Mi" />
                  <Stat value={`${race.anchorDistance}`} label="Race Mi" />
                  <Stat value={`${race.totalDistance}`} label="Total Mi" />
                  <Stat value={race.totalTime} label="Total Time" />
                  <Stat value={race.elevationGain} label="Elevation" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div style={{ background: "#111111", border: "1px solid #2A2A2A", padding: 24, marginBottom: 20 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>VERIFICATION</div>
                {["GPX Track", "Geotagged Photos", "Route Match", "Time Verified"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 3 ? "1px solid #2A2A2A" : "none" }}>
                    <span style={{ color: "#4A7C59", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 }}>&#10003;</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#4A7C59" }}>{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <button style={{ width: "100%", fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", background: "#C8B87C", border: "none", padding: "14px 0", cursor: "pointer", borderRadius: 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity = "0.85"}
                onMouseLeave={e => e.target.style.opacity = "1"}>
                DOWNLOAD GPX
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   SUBMIT
   =================================================================== */

function Submit() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", anchor: "", location: "", date: "", type: "", description: "", ghostDist: "", anchorDist: "", totalTime: "" });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = { width: "100%", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#E0E0E0", background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "12px 16px", outline: "none", boxSizing: "border-box", borderRadius: 0, transition: "border-color 0.2s" };
  const inpFocus = (e) => e.target.style.borderColor = "#C8B87C";
  const inpBlur = (e) => e.target.style.borderColor = "#2A2A2A";
  const lbl = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 };

  const stepLabels = [["01", "BRIEFING"], ["02", "INTEL"], ["03", "PROOF"]];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>SUBMIT A MISSION</h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#999999", margin: "0 0 32px" }}>You did the work. Now make it official.</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
            {stepLabels.map(([num, label], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: step >= i + 1 ? 1 : 0.4 }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#C8B87C" }}>{num}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: step >= i + 1 ? "#E0E0E0" : "#666666", letterSpacing: "0.1em" }}>{label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {step === 1 && (
          <ScrollReveal delay={200}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>MISSION BRIEFING</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label style={lbl}>Mission Title</label><input style={inp} placeholder="e.g. The Double Door County" value={form.title} onChange={e => u("title", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
              <div><label style={lbl}>Anchor Event</label><input style={inp} placeholder="e.g. Door County 50 Miler" value={form.anchor} onChange={e => u("anchor", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={lbl}>Location</label><input style={inp} placeholder="City, State" value={form.location} onChange={e => u("location", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
                <div><label style={lbl}>Date</label><input style={{ ...inp, colorScheme: "dark" }} type="date" value={form.date} onChange={e => u("date", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
              </div>
              <div>
                <label style={lbl}>Mission Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Course Reversal", "Pre-Race Ultra", "Back-to-Back", "Expedition + Race", "Night Double", "Other"].map(t => (
                    <button key={t} onClick={() => u("type", t)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: form.type === t ? "#0A0A0A" : "#999999", background: form.type === t ? "#C8B87C" : "transparent", border: `1px solid ${form.type === t ? "#C8B87C" : "#2A2A2A"}`, padding: "8px 14px", cursor: "pointer", borderRadius: 0 }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", background: "#C8B87C", border: "none", padding: "14px 40px", cursor: "pointer", marginTop: 32, borderRadius: 0 }}>CONTINUE</button>
          </ScrollReveal>
        )}

        {step === 2 && (
          <ScrollReveal delay={200}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>MISSION INTEL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label style={lbl}>Mission Report</label><textarea style={{ ...inp, height: 120, resize: "vertical" }} placeholder="What did you do and why?" value={form.description} onChange={e => u("description", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div><label style={lbl}>Mission Miles</label><input style={inp} placeholder="50" value={form.ghostDist} onChange={e => u("ghostDist", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
                <div><label style={lbl}>Race Miles</label><input style={inp} placeholder="50" value={form.anchorDist} onChange={e => u("anchorDist", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
                <div><label style={lbl}>Total Time</label><input style={inp} placeholder="22h 47m" value={form.totalTime} onChange={e => u("totalTime", e.target.value)} onFocus={inpFocus} onBlur={inpBlur} /></div>
              </div>
              <div>
                <label style={lbl}>Course Photos</label>
                <div style={{ background: "#1A1A1A", border: "2px dashed #2A2A2A", padding: 28, textAlign: "center", cursor: "pointer" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A0915A" strokeWidth="1.5" style={{ marginBottom: 6 }}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M7 5V3h4v2" /></svg>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, color: "#A0915A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Drop Photos Here</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.1em" }}>Geotagged photos auto-placed on your course map</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#666666", letterSpacing: "0.1em", marginTop: 6 }}>JPG, PNG - Location from EXIF data</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999999", background: "transparent", border: "1px solid #2A2A2A", padding: "14px 32px", cursor: "pointer", borderRadius: 0 }}>BACK</button>
              <button onClick={() => setStep(3)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", background: "#C8B87C", border: "none", padding: "14px 40px", cursor: "pointer", borderRadius: 0 }}>CONTINUE</button>
            </div>
          </ScrollReveal>
        )}

        {step === 3 && (
          <ScrollReveal delay={200}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>GPS PROOF</div>
            <div style={{ background: "#1A1A1A", border: "2px dashed #2A2A2A", padding: 44, textAlign: "center", marginBottom: 24, cursor: "pointer" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#A0915A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Upload GPS File</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666666", letterSpacing: "0.1em" }}>.GPX or .FIT from Garmin, COROS, Apple Watch, Strava</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#666666", lineHeight: 1.6, marginBottom: 32 }}>
              Your GPS track and geotagged photos will be displayed publicly -- overlaid on the official race course so the community can see exactly what you did.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999999", background: "transparent", border: "1px solid #2A2A2A", padding: "14px 32px", cursor: "pointer", borderRadius: 0 }}>BACK</button>
              <button onClick={() => setStep(4)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", background: "#C8B87C", border: "none", padding: "14px 40px", cursor: "pointer", borderRadius: 0 }}>SUBMIT MISSION</button>
            </div>
          </ScrollReveal>
        )}

        {step === 4 && (
          <ScrollReveal delay={200}>
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #C8B87C, transparent)", margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>MISSION SUBMITTED</h2>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#C8B87C", letterSpacing: "0.15em", marginBottom: 16 }}>MISSION ID: GP-0128</div>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#999999", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
                Your GPS track and course photos are under review. Once verified, your mission will appear in the registry with the full interactive map.
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   ABOUT
   =================================================================== */

function About({ onNav }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 32px" }}>ABOUT GHOSTED</h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#E0E0E0", lineHeight: 1.8, marginBottom: 24 }}>
            Ghosted exists for athletes who need more than what race day offers. The ones who look at a 50-mile course and think: what if I ran it backwards first? The ones who add 74 miles before a marathon just to see what happens at mile 99.
          </p>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#E0E0E0", lineHeight: 1.8, marginBottom: 24 }}>
            This is not a race series. There are no entry fees, no aid stations, no finisher medals. This is a registry -- a permanent record of missions designed and executed by individual athletes, verified by GPS data and geotagged field photos.
          </p>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#E0E0E0", lineHeight: 1.8, marginBottom: 48 }}>
            Every mission in the registry is anchored to an official event. You run your ghost leg -- the secret, solo, unsanctioned part -- and then you show up at the starting line like everyone else. Nobody knows what you already did. The GPS knows. The photos know. The registry knows.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, color: "#C8B87C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 32 }}>THE RULES</h3>
        </ScrollReveal>

        {[
          "Every mission must be anchored to an official, organized event. The ghost leg comes before, after, or around the anchor race.",
          "GPS proof is mandatory. Upload your .GPX or .FIT file from any device. The track is overlaid on the official course for public verification.",
          "Geotagged photos are required. Timestamps and location data must match your GPS track. These are displayed on the interactive course map.",
          "No pacers, no crew, no outside assistance during the ghost leg. Aid stations from the anchor event are permitted during that portion only.",
          "Honesty is the protocol. If the GPS doesn't match, it doesn't count. If the photos don't align, it doesn't count. The community sees everything.",
        ].map((rule, i) => (
          <ScrollReveal key={i} delay={250 + i * 50}>
            <div style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: "1px solid #2A2A2A" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#C8B87C", flexShrink: 0, width: 32 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#E0E0E0", lineHeight: 1.7 }}>{rule}</div>
            </div>
          </ScrollReveal>
        ))}

        <ScrollReveal delay={600}>
          <div style={{ background: "#111111", border: "1px solid #2A2A2A", padding: "32px", marginTop: 48, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: "#E0E0E0", textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.4, margin: "0 0 16px" }}>
              The mission is the point. The record is the proof. Everything else is noise.
            </p>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #C8B87C, transparent)", margin: "0 auto" }} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={700}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => onNav("submit")} style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0A0A0A", background: "#C8B87C", border: "none", padding: "14px 40px", cursor: "pointer", borderRadius: 0 }}>SUBMIT YOUR MISSION</button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

/* ===================================================================
   WORLD MAP
   =================================================================== */

function WorldMap({ onSelectRace }) {
  const allPoints = RACES.flatMap(r => [...(r.officialRoute || []), ...(r.ghostRoute || [])]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 0" }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>GLOBAL MAP</h2>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#999999", margin: "0 0 24px" }}>Every verified mission location. Click a marker to explore the route.</p>
        </ScrollReveal>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>
        <ScrollReveal delay={200}>
          <div style={{ border: "1px solid #2A2A2A", overflow: "hidden", position: "relative" }}>
            <MapContainer
              center={[38, -95]}
              zoom={4}
              style={{ height: 560, width: "100%", background: "#0A0A0A" }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {allPoints.length > 0 && <FitBounds points={allPoints} />}

              {RACES.map(race => {
                const official = race.officialRoute || [];
                const ghost = race.ghostRoute || [];
                return (
                  <React.Fragment key={race.id}>
                    {official.length > 0 && (
                      <Polyline positions={official} pathOptions={{ color: "#999999", weight: 2, dashArray: "6, 6", opacity: 0.5 }} />
                    )}
                    {ghost.length > 0 && (
                      <Polyline positions={ghost} pathOptions={{ color: "#C8B87C", weight: 3, opacity: 0.8 }} />
                    )}
                    {race.center && (
                      <CircleMarker
                        center={race.center}
                        radius={8}
                        pathOptions={{ color: "#C8B87C", fillColor: "#0A0A0A", fillOpacity: 1, weight: 2 }}
                        eventHandlers={{ click: () => onSelectRace(race) }}
                      >
                        <Popup>
                          <div style={{ minWidth: 200 }}>
                            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, color: "#F5F5F0", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{race.title}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", letterSpacing: "0.1em", marginBottom: 8 }}>{race.anchor} &middot; {race.anchorLocation}</div>
                            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                              <div>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#C8B87C" }}>{race.totalDistance}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>TOTAL MI</div>
                              </div>
                              <div>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#C8B87C" }}>{race.totalTime}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>TIME</div>
                              </div>
                            </div>
                            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#999" }}>{race.athlete} &middot; {race.type}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#C8B87C", marginTop: 8, cursor: "pointer" }}>VIEW FULL MISSION &rarr;</div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )}
                  </React.Fragment>
                );
              })}
            </MapContainer>

            {/* Legend */}
            <div style={{ position: "absolute", top: 12, right: 12, zIndex: 500, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", background: "rgba(10,10,10,0.9)", padding: "12px 16px", border: "1px solid #2A2A2A", pointerEvents: "none" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, color: "#F5F5F0", letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>Missions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ color: "#C8B87C", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="3"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="#C8B87C" strokeWidth="2" /></svg> Mission Route
                </span>
                <span style={{ color: "#999999", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="3"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="#999" strokeWidth="2" strokeDasharray="3,3" /></svg> Official Course
                </span>
                <span style={{ color: "#A0915A", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#0A0A0A" stroke="#C8B87C" strokeWidth="1.5" /></svg> Location
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mission cards below the map */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#F5F5F0", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 24px" }}>ALL LOCATIONS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {RACES.map((race, i) => (
              <ScrollReveal key={race.id} delay={i * 100}>
                <div onClick={() => onSelectRace(race)} style={{ background: "#111111", border: "1px solid #2A2A2A", cursor: "pointer", transition: "all 0.2s", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(200,184,124,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.boxShadow = "none"; }}>
                  {/* Mini map */}
                  <div style={{ height: 140, overflow: "hidden", borderBottom: "1px solid #2A2A2A" }}>
                    <RealMap race={race} height={140} mini={true} />
                  </div>
                  <div style={{ padding: "16px 20px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <StatusDot status={race.verified ? "verified" : "pending"} />
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#666", letterSpacing: "0.1em" }}>{race.photos?.length || 0} PHOTOS</span>
                    </div>
                    <h4 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#F5F5F0", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px", lineHeight: 1.2 }}>{race.title}</h4>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#666", marginBottom: 12 }}>{race.anchor} &middot; {race.anchorLocation}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Badge type={race.type} />
                      <div style={{ display: "flex", gap: 16 }}>
                        <Stat value={`${race.totalDistance}`} label="Total Mi" small />
                        <Stat value={race.totalTime} label="Time" small />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   APP
   =================================================================== */

export default function App() {
  const [page, setPage] = useState("landing");
  const [selected, setSelected] = useState(null);
  const nav = useCallback((p) => { setPage(p); setSelected(null); window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; color: #E0E0E0; }
        ::selection { background: #C8B87C; color: #0A0A0A; }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }

        @keyframes topoDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-30px, -20px); }
        }
        @keyframes pulseStatus {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
        }

        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-sidebar { position: static !important; }
        }

        .leaflet-popup-content-wrapper { background: #111111 !important; color: #E0E0E0 !important; border-radius: 0 !important; border: 1px solid #2A2A2A; }
        .leaflet-popup-tip { background: #111111 !important; }
        .leaflet-popup-close-button { color: #999 !important; }
        .leaflet-container { background: #0A0A0A !important; }
        .leaflet-control-attribution { background: rgba(10,10,10,0.8) !important; color: #666 !important; font-family: 'IBM Plex Mono', monospace; font-size: 9px; }
        .leaflet-control-attribution a { color: #999 !important; }
      `}</style>

      {page !== "landing" && <Nav page={page} onNav={nav} />}
      {page === "landing" && <Landing onEnter={nav} />}
      {page === "missions" && !selected && <Registry onSelect={r => { setSelected(r); setPage("detail"); window.scrollTo(0, 0); }} />}
      {page === "detail" && selected && <Detail race={selected} onBack={() => nav("missions")} />}
      {page === "map" && <WorldMap onSelectRace={r => { setSelected(r); setPage("detail"); window.scrollTo(0, 0); }} />}
      {page === "submit" && <Submit />}
      {page === "about" && <About onNav={nav} />}
    </div>
  );
}
