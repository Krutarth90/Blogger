import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RecoilValue, useRecoilValue} from "recoil";

type SignData = {
  username?: string;
  email: string;
  password: string;
  URL: string;
};

export function ButtonComp({
  text,
  selector,
}: {
  text: string;
  selector: RecoilValue<SignData>;
}) {
  const { URL, ...sign } = useRecoilValue(selector);
  const navigate = useNavigate();
  return (
    <div className="py-2">
      <button
        onClick={async () => {
          try {
            const res = await axios.post(URL, sign);
            if (res.data.msg === " Signed UP Succesfully. ") {
              navigate('/signin');
            } else if (res.data.token) {
              localStorage.setItem("Authorization", `Bearer ${res.data.token}`);
              navigate('/blogs');
            }
          } catch (error) {
            console.error("Signup/Login failed:", error);
          }
        }}
        className="flex w-full justify-center rounded-xl bg-[#8E4B71] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#A55D85] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#8E4B71]/50 focus:ring-offset-2"
      >
        {text}
      </button>
    </div>
  );
}
