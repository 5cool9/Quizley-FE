// src/component/reportMap.tsx
import React from "react";

type Props = {
  values?: number[]; // [미스테리, 예술, 문학, 자연과학, 심리학, 역사], 0~1
  labels?: [string, string, string, string, string, string];
  highlightIndex?: number;
  className?: string;
};

export default function ReportMap({
  values = [0.62, 0.56, 0.48, 0.42, 0.78, 0.6],
  labels = ["미스테리", "예술", "문학", "자연과학", "심리학", "역사"],
  highlightIndex = 4,
  className = "",
}: Props) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 110;
  const levels = 4;
  const axes = 6;
  const EPS = 1e-6;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes;
  const toXY = (r: number, i: number) => {
    const a = angle(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  // 둥근 폴리곤 path 생성
  function roundedPolygonPath(
    pts: ReadonlyArray<readonly [number, number]>,
    cornerR: number
  ) {
    if (pts.length < 3) return "";
    const n = pts.length;
    const segs: string[] = [];

    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];

      const v01 = [p1[0] - p0[0], p1[1] - p0[1]];
      const v12 = [p2[0] - p1[0], p2[1] - p1[1]];

      const l01 = Math.hypot(v01[0], v01[1]);
      const l12 = Math.hypot(v12[0], v12[1]);

      // 길이가 0이면(모든 점이 같은 위치 등) NaN 방지용
      if (!l01 || !l12) {
        if (i === 0) segs.push(`M ${p1[0]} ${p1[1]}`);
        else segs.push(`L ${p1[0]} ${p1[1]}`);
        continue;
      }

      const u01 = [v01[0] / l01, v01[1] / l01];
      const u21 = [-v12[0] / l12, -v12[1] / l12];

      const dot = Math.max(-1, Math.min(1, u01[0] * u21[0] + u01[1] * u21[1]));
      const phi = Math.acos(dot);
      const t = cornerR / Math.tan(phi / 2);
      const off = Math.min(t, l01 / 2, l12 / 2);

      const s: [number, number] = [
        p1[0] - u01[0] * off,
        p1[1] - u01[1] * off,
      ];
      const e: [number, number] = [
        p1[0] - u21[0] * off,
        p1[1] - u21[1] * off,
      ];

      if (i === 0) segs.push(`M ${s[0]} ${s[1]}`);
      else segs.push(`L ${s[0]} ${s[1]}`);
      segs.push(`A ${cornerR} ${cornerR} 0 0 1 ${e[0]} ${e[1]}`);
    }

    segs.push("Z");
    return segs.join(" ");
  }

  // ---- 값 정리 / 0 처리 ----
  const safeValues = Array.from({ length: axes }, (_, i) => {
    const v = values[i] ?? 0;
    return Number.isFinite(v) ? v : 0;
  });

  const maxVal = Math.max(...safeValues);
  const hasData = maxVal > 0;

  // 0~1 정규화 (데이터가 있을 때만)
  const normValues = hasData ? safeValues.map((v) => v / maxVal) : safeValues;

  const safeHighlightIndex =
    highlightIndex != null && highlightIndex >= 0 && highlightIndex < axes
      ? highlightIndex
      : 0;

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

  // 바깥 배경(둥근 16)
  const outerPts = Array.from({ length: axes }, (_, i) => toXY(outerR, i));
  const outerBg = roundedPolygonPath(outerPts, 16);

  // 데이터 면 / 단일 축 선
  let dataPath = "";
  let singleAxisLine: React.ReactNode = null;

  if (!hasData) {
    // 모든 값이 0인 경우: 하이라이트 축 방향으로 기본 길이 선 하나
    const [x2, y2] = toXY(outerR * 0.6, safeHighlightIndex);
    singleAxisLine = (
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        className="stroke-primary-700"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    );
  } else {
    // 의미 있는 축들만 추려서 개수 확인
    const nonZeroIndices = normValues
      .map((v, i) => (v > EPS ? i : -1))
      .filter((i) => i >= 0);

    if (nonZeroIndices.length >= 2) {
      // 2축 이상일 때만 폴리곤
      const dataPtsArr = Array.from({ length: axes }, (_, i) =>
        toXY(outerR * Math.max(0, Math.min(1, normValues[i] ?? 0)), i)
      );
      dataPath = roundedPolygonPath(dataPtsArr, 4);
    } else {
      // 0개 또는 1개 축만 의미 있을 때: 항상 highlight 방향으로 선 하나
      const idxForRadius =
        nonZeroIndices.length === 1 ? nonZeroIndices[0] : safeHighlightIndex;

      const baseNorm = normValues[idxForRadius] ?? 0;
      const rNorm = baseNorm > 0 ? baseNorm : 0.6;

      const [x2, y2] = toXY(outerR * rNorm, safeHighlightIndex);

      singleAxisLine = (
        <line
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          className="stroke-primary-700"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      );
    }
  }

  // 라벨
  const labelNodes = labels.map((lab, i) => {
    const [x, y] = toXY(outerR + 34, i);
    const isHL = i === safeHighlightIndex;
    return (
      <text
        key={lab}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className={`typ-b4 ${
          isHL ? "fill-primary-700 font-semibold" : "fill-neutral-700"
        }`}
      >
        {lab}
      </text>
    );
  });

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="선호도 레이더 차트"
      >
        {/* 바깥 육각형 */}
        <path
          d={outerBg}
          fill="none"
          className="stroke-neutral-300"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />

        {/* 격자/축 */}
        <g>{gridPaths}</g>

        {/* 데이터 면 (폴리곤) */}
        {dataPath && (
          <path
            d={dataPath}
            className="fill-primary-500 stroke-primary-700"
            opacity={0.7}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* 단일 축일 때 나오는 선 */}
        {singleAxisLine}

        {/* 라벨 */}
        <g>{labelNodes}</g>
      </svg>
    </div>
  );
}
