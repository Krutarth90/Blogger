import { Bottom } from "../components/Bottom";
import { ButtonComp } from "../components/ButtonComp";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { IpBox } from "../components/IpBox";
import { emailAtom, passwordAtom, signInSelector } from "../store/atoms";

export function SignIn (){

    return (
        <Card>
            <Heading text = "Sign In"/>
            <IpBox Heading = "email" placeholder="email" atom = {emailAtom}/>
            <IpBox type = "password" Heading = "password" placeholder="password" atom = {passwordAtom}/>
            <ButtonComp text="Sign In" selector={ signInSelector }/>
            <Bottom text="Never signed Up before?" toLabel="Sign Up" to="/signup"/>
        </Card>
    )
}