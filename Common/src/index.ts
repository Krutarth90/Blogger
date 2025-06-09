import { z } from "zod";

export const signInSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6)
});

export type signInType= z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
});

export type signUpType= z.infer<typeof signUpSchema>;

export const postSchema = z.object({
    title : z.string(),
    content : z.string(),
    authId : z.string(),
    tags : z.array(z.string())
})

export type postType = z.infer<typeof postSchema>;

export const updatePost = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string(),
    tags : z.array(z.string())
})

export type updatePostType = z.infer<typeof updatePost>;
