import { RecoilState, useSetRecoilState } from "recoil"

export function IpBox({Heading, placeholder, atom} : {Heading : string, placeholder : string, atom : RecoilState<string>}){
    const setState = useSetRecoilState(atom);
    return (
        <div>
            <label>
                {Heading}
            </label>
            <div>
                <input placeholder = {placeholder} onChange = {(e)=>{
                    setState(e.target.value);
                }} className="mt-1 block w-full px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out hover:border-indigo-500 hover:shadow-lg hover:bg-gray-50"/>
            </div>
            
        </div>
    )
}