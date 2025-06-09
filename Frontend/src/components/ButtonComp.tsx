import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RecoilValue, useRecoilValue } from "recoil"

type SignData = {
  username?: string;
  email: string;
  password: string;
  URL: string;
};


export function ButtonComp ({text, selector} : {text : string, selector : RecoilValue<SignData>}){
    const { URL, ...sign}  = useRecoilValue(selector);
    const navigate = useNavigate();
    return (
        <div className="py-2">
            <button onClick = { async () => {
                try {
                    const res = await axios.post(URL, sign);
                    if(res.data.msg == " Signed UP Succesfully. ")
                    {
                        navigate('/signin');
                    }
                    else if(res.data.token)
                    {
                        localStorage.setItem('Authorization', `Bearer ${res.data.token}`);
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error);
                }   
            }}className = "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-outfocus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{text}</button>
        </div>
    )
}  