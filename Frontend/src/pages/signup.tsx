import { Bottom } from "../components/Bottom";
import { ButtonComp } from "../components/ButtonComp";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { IpBox } from "../components/IpBox";
import { emailAtom, passwordAtom, signUpSelector, usernameAtom } from "../store/atoms";

export function Signup (){

    return (
        <Card>
            <Heading text = "Sign Up"/>
            <IpBox Heading = "Name" placeholder="Name" atom = {usernameAtom}/>
            <IpBox Heading = "email" placeholder="email" atom = {emailAtom}/>
            <IpBox Heading = "password" placeholder="password" atom = {passwordAtom}/>
            <ButtonComp text="SignUp" selector={ signUpSelector }/>
            <Bottom text="Signed Up before?" toLabel="Sign In" to="/signin"/>
        </Card>
    )
}