"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SignInFlow } from "../types";

interface SignUpFormProps {
    setState: (state: SignInFlow) => void;
}

export const SignUpForm = ({ setState }: SignUpFormProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="font-bold text-2xl">Sign up to Slack</h1>
            <p className="text-xs text-muted-foreground">We suggest using the email address you use at work.</p>
            <div className="flex flex-col gap-1 w-full">
                <Button
                    variant="outline"
                    className="relative"
                >
                    <FcGoogle className="size-5 absolute left-2.5" />
                    Sign In With Google
                </Button>
                <Button
                    variant="outline"
                    className="relative"
                >
                    <FaGithub className="size-5 absolute left-2.5" />
                    Sign In With Github
                </Button>
            </div>
            <Separator />
            <form className="space-y-2 w-full">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    className="w-full"
                >
                    Sign Up
                </Button>
            </form>
            <div className="text-xs">
                Already have an account? <span onClick={() => setState("signIn")} className="text-sky-500 hover:underline cursor-pointer">Sign In</span>
            </div>
        </div>
    )
}