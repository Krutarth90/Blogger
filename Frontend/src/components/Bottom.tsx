import { Link } from "react-router-dom";

interface BottomProps {
  text: string;
  to: string;
  toLabel: string;
}

export function Bottom({ text, to, toLabel }: BottomProps) {
  return (
    <div className="flex justify-center items-center text-xs space-x-1 mt-4">
      <div className="text-gray-600">{text}</div>
      <div>
        <Link
          to={to}
          className="text-blue-500 hover:text-blue-700 hover:underline transition-all duration-300"
        >
          {toLabel}
        </Link>
      </div>
    </div>
  );
}
