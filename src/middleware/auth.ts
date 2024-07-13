import * as jwt from "jsonwebtoken"

export interface AuthTokenPayload{
    userId: number
}


export const auth = (header: string): AuthTokenPayload => {
    const token = header
    if(!token){
        throw new Error("Invalid token")
    }
    return jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret) as AuthTokenPayload
}