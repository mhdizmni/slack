"use client"

import { useState } from "react"

import { SignInFlow } from "../types";

import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

import { Disclaimer } from "@/components/disclaimer";
import Image from "next/image";

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <div className="absolute top-0 left-0 w-full">
                <Disclaimer />
            </div>
            <Image
                src="/logo.svg"
                alt="Slack"
                height={28}
                width={110}
            />
            <div className="md:w-96">
                {state === "signIn" ? <SignInForm setState={setState} /> : <SignUpForm setState={setState} />}
            </div>
            <div className="font-mono text-[8px] absolute bottom-0 p-1">
                &#91;© {new Date().getFullYear()} mitism.com&#93;
            </div>
        </div>
    )
}