// src/component/reportMap.tsx
import React from "react";

type Props = {
  values?: number[]; // [미스테리, 예술, 문학, 자연과학, 심리학, 역사], 0~1
  labels?: [string, string, string, string, string, string];
  highlightIndex?: number;
  className?: string;
};

export default function ReportMap({
  values = [0.62, 0.56, 0.48, 0.42, 0.78, 0.60],
  labels = ["미스테리", "예술", "문학", "자연과학", "심리학", "역사"],
  highlightIndex = 4,
  className = "",
}: Props) {
  const size = 320, cx = size / 2, cy = size / 2;
  const outerR = 110, levels = 4, axes = 6;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes;
  const toXY = (r: number, i: number) => {
    const a = angle(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  // 둥근 폴리곤 path 생성
  function roundedPolygonPath(pts: ReadonlyArray<readonly [number, number]>, cornerR: number) {
    if (pts.length < 3) return "";
    const n = pts.length, segs: string[] = [];
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const v01 = [p1[0] - p0[0], p1[1] - p0[1]], v12 = [p2[0] - p1[0], p2[1] - p1[1]];
      const l01 = Math.hypot(v01[0], v01[1]), l12 = Math.hypot(v12[0], v12[1]);
      const u01 = [v01[0] / l01, v01[1] / l01], u21 = [-v12[0] / l12, -v12[1] / l12];
      const dot = Math.max(-1, Math.min(1, u01[0] * u21[0] + u01[1] * u21[1]));
      const phi = Math.acos(dot);
      const t = cornerR / Math.tan(phi / 2);
      const off = Math.min(t, l01 / 2, l12 / 2);
      const s: [number, number] = [p1[0] - u01[0] * off, p1[1] - u01[1] * off];
      const e: [number, number] = [p1[0] - u21[0] * off, p1[1] - u21[1] * off];
      if (i === 0) segs.push(`M ${s[0]} ${s[1]}`); else segs.push(`L ${s[0]} ${s[1]}`);
      segs.push(`A ${cornerR} ${cornerR} 0 0 1 ${e[0]} ${e[1]}`);
    }
    segs.push("Z");
    return segs.join(" ");
  }

  // 격자
  const gridPaths = Array.from({ length: levels }, (_, li) => {
    const r = outerR * ((levels - li) / levels);
    const pts = Array.from({ length: axes }, (_, i) => toXY(r, i));
    const d = roundedPolygonPath(pts, 16);
    return (
      <path
        key={li}
        d={d}
        fill="none"
        className="stroke-neutral-300"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    );
  });

  // 축 라인
  const axisLines = Array.from({ length: axes }, (_, i) => {
    const [x, y] = toXY(outerR, i);
    return (
      <line
        key={i}
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        className="stroke-neutral-200"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    );
  });

  // 바깥 배경(둥근 16) — **비활성화 컬러/토큰 사용 + 선 두께 2**
  const outerPts = Array.from({ length: axes }, (_, i) => toXY(outerR, i));
  const outerBg = roundedPolygonPath(outerPts, 16);

  // 데이터(둥근 4) — **primary 토큰 사용**
  const dataPtsArr = Array.from({ length: axes }, (_, i) =>
    toXY(outerR * Math.max(0, Math.min(1, values[i] ?? 0)), i)
  );
  const dataPath = roundedPolygonPath(dataPtsArr, 4);

  // 라벨
  const labelNodes = labels.map((lab, i) => {
    const [x, y] = toXY(outerR + 34, i);
    const isHL = i === highlightIndex;
    return (
      <text
        key={lab}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`typ-b4 ${isHL ? "fill-primary-700 font-semibold" : "fill-neutral-700"}`}
      >
        {lab}
      </text>
    );
  });

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="선호도 레이더 차트">
        {/* 바깥 배경 육각형 */}
        <path
          d={outerBg}
          className="fill-neutral-200 stroke-neutral-300"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />

        {/* 격자/축 */}
        <g>{gridPaths}</g>
        <g>{axisLines}</g>

        {/* 데이터 면 */}
        <path
          d={dataPath}
          className="fill-primary-500 stroke-primary-700"
          opacity={0.7}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />

        {/* 라벨 */}
        <g>{labelNodes}</g>
      </svg>
    </div>
  );
}
