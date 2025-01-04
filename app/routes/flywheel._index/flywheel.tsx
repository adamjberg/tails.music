import React from "react";

export const Flywheel: React.FC = () => {
  const size = 343;
  const center = size / 2;
  const radius = size * 0.4;
  const starRadius = 60;

  const points = [
    { name: "Acquisition", angle: 0 },
    { name: "Activation", angle: 72 },
    { name: "Revenue", angle: 144 },
    { name: "Retention", angle: 216 },
    { name: "Referral", angle: 288 },
  ];

  const getCoordinates = (angle: number, r: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radians),
      y: center + r * Math.sin(radians),
    };
  };

  const starPoints = Array.from({ length: 10 }, (_, i) => {
    const angle = i * 36;
    const r = i % 2 === 0 ? starRadius : starRadius / 2;
    const { x, y } = getCoordinates(angle, r);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={size + 50} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Main circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Gold star */}
      <polygon
        points={starPoints}
        fill="#ffd700"
        stroke="#ffd700"
        strokeWidth="2"
      />

      {/* Flywheel points */}
      {points.map((point, index) => {
        const { x: outerX, y: outerY } = getCoordinates(point.angle, radius);
        const { x: innerX, y: innerY } = getCoordinates(
          point.angle,
          starRadius
        );
        return (
          <g key={index}>
            <circle cx={outerX} cy={outerY} r="6" fill="#ffd700" />
            <line
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke="#ffd700"
              strokeWidth="1"
            />
            <text
              x={outerX}
              y={outerY}
              dx={0}
              dy={outerY < center ? -15 : 25}
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              {point.name}
            </text>
          </g>
        );
      })}

      {/* Center text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        filter="drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5))"
      >
        YOU
      </text>
    </svg>
  );
};
