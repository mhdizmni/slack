"use client"

import { useState } from "react"

import { SignInFlow } from "../types";

import Image from "next/image";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <Image
                src="/logo.svg"
                alt="Slack"
                width={100}
                height={100}
            />
            <div className="md:w-96">
                {state === "signIn" ? <SignInForm setState={setState} /> : <SignUpForm setState={setState} />}
            </div>
        </div>
    )
}