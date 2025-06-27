import { atom, selector } from "recoil";

export const usernameAtom = atom({
    key : "username",
    default : ""
});

export const emailAtom = atom({
    key : "email",
    default : ""
});

export const passwordAtom = atom({
    key : "password",
    default : ""
});

export const loggedInSelector = selector({
    key : "loggedInSelector",
    get : ({get}) => {
        const name = get(usernameAtom)
        const email = get(emailAtom);
        return  {
            name,
            email,
        }
    }
})

export const signUpSelector = selector({
    key : "signUpSelector",
    get : ({get})=>{
        const username = get(usernameAtom)
        const email = get(emailAtom);
        const password = get(passwordAtom);
        const URL = "https://backend.krutarthpipaliya90.workers.dev/api/v1/signup"
        return  {
            username,
            email,
            password,
            URL,
        }
    },
})

export const signInSelector = selector({
    key : "signInSelector",
    get : ({get})=>{
        const email = get(emailAtom);
        const password = get(passwordAtom);
        const URL = "https://backend.krutarthpipaliya90.workers.dev/api/v1/signin"
        return  {
            email,
            password,
            URL,
        }
    },
})

export const titleAtom = atom({
    key : "titleAtom",
    default : ""
});

export const contentAtom = atom({
    key : "contentAtom",
    default : ""
});

export const tagsAtom = atom<string[]>({
  key: "tagsAtom",
  default: []
});

export const blogIdAtom = atom<string>({
  key: "blogIdAtom",
  default: ''
});

export const postSelector = selector({
    key : "postSelector",
    get : ({get}) =>{
        const title = get(titleAtom);
        const content = get(contentAtom);
        const tags = get(tagsAtom);
        return {
            title,
            content,
            tags
        }
    }
});