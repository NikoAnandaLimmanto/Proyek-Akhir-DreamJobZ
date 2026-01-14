import bcrypt, { hash } from "bcrypt";

export const hashedPassword = async (password)=>{
    return await bcrypt.hash(password, 12);
}

export const verifyPassword = async (password, hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword);
}