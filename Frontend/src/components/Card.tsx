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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#F5F2EF] to-[#E6E0DA]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition duration-300 ease-in-out hover:border-[#8E4B71] hover:shadow-lg overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at ${gradientPos.x} ${gradientPos.y}, rgba(142, 75, 113, 0.15), transparent 60%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl z-0 pointer-events-none" />
      </div>
    </div>
  );
}
