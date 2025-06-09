import { ReactNode, useState, useRef } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [gradientPos, setGradientPos] = useState({ x: "50%", y: "50%" });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGradientPos({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-sm relative rounded-xl p-6 transition-shadow duration-300 shadow-lg hover:shadow-2xl bg-white overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at ${gradientPos.x} ${gradientPos.y}, rgba(14,165,233,0.15), transparent 50%)`,
        }}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl z-0 pointer-events-none"></div>
      </div>
    </div>
  );
}
