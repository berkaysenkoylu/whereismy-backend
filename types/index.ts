import type { Error } from "sequelize";

export interface SignupFormType {
    firstname: string
    lastname: string
    username: string
    email: string
    password: string
}

export interface ErrorType extends Error {
    statusCode?: number
}

export interface UserType {
    id: string
    firstname: string
    lastname: string
    username: string
    email: string
    password?: string
    avatarUrl?: string
    city?: string
    resetToken?: string
    resetTokenExpiration?: string
    set: (...args: any) => void
    save: () => UserType
}