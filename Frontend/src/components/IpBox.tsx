import { RecoilState, useSetRecoilState } from "recoil";

export function IpBox({
  Heading,
  placeholder,
  atom,
}: {
  Heading: string;
  placeholder: string;
  atom: RecoilState<string>;
}) {
  const setState = useSetRecoilState(atom);

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-[#502D55]">{Heading}</label>
      <div>
        <input
          placeholder={placeholder}
          onChange={(e) => setState(e.target.value)}
          className="mt-2 block w-full px-4 py-2 text-sm text-[#502D55] placeholder-[#B28BA0] bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E4B71] focus:border-[#8E4B71] transition duration-300 ease-in-out hover:shadow-md hover:border-[#B28BA0] hover:bg-[#FDF9F8]"
        />
      </div>
    </div>
  );
}
