import { useSetRecoilState } from "recoil";
import { pathAtom } from "../store/atoms";

interface BottomProps {
  text: string;
  to: string;
  toLabel: string;
}

export function Bottom({ text, to, toLabel }: BottomProps) {
  const setPath = useSetRecoilState(pathAtom);
  return (
    <div className="flex justify-center items-center text-xs space-x-1 mt-4">
      <span className="text-[#8E4B71]">{text}</span>
      <div
        onClick={() => {
          setPath(to);
        }}
        className="text-[#7C3AED] hover:text-[#502D55] font-medium transition-colors duration-300 underline-offset-2 hover:underline"
      >
        {toLabel}
      </div>
    </div>
  );
}
