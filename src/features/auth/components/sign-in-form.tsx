"use client"

import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/loaders/spinner";
import { Notice } from "@/components/notice";
import { Dots } from "@/components/loaders/dots";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SignInFlow } from "../types";
import { cn } from "@/lib/utils";

interface SignInFormProps {
    setState: (state: SignInFlow) => void;
}

export const SignInForm = ({ setState }: SignInFormProps) => {
    const [isPending, setTransition] = useTransition();
    const { signIn } = useAuthActions();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string>("");

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        
        setTransition(async () => {
            await signIn("password", { email, password, flow: "signIn" })
            .catch(() => {
                setError("Invalid email or password");
            });
        })
    }

    const onProviderSignIn = (value: "google" | "github") => {
        setError("");
        setTransition(async () => {
            await signIn(value);
        })
    }

    return (
        <div className={cn(
            "flex flex-col items-center gap-4 w-full",
            isPending && "animate-pulse"
        )}>
            <h1 className="font-bold text-2xl">Sign in to Slack</h1>
            <p className="text-xs text-muted-foreground">We suggest using the email address you use at work.</p>
            <div className="flex flex-col gap-1 w-full">
                <Button
                    variant="outline"
                    className="relative"
                    onClick={() => onProviderSignIn("google")}
                    disabled={isPending}
                >
                    <div className="absolute left-2.5">
                        {isPending ? (
                            <Spinner className="size-5" />
                        ) : (
                            <FcGoogle className="size-5" />
                        )}
                    </div>
                    Sign In with Google
                </Button>
                <Button
                    variant="outline"
                    className="relative"
                    onClick={() => onProviderSignIn("github")}
                    disabled={isPending}
                >
                    <div className="absolute left-2.5">
                        {isPending ? (
                            <Spinner className="size-5" />
                        ) : (
                            <FaGithub className="size-5" />
                        )}
                    </div>
                    Sign In with Github
                </Button>
            </div>
            <Separator />
            <form className="space-y-2 w-full" onSubmit={onPasswordSignIn}>
                {!!error && (
                    <Notice type="error">
                        {error}
                    </Notice>
                )}
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    required
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                >
                    {isPending ? <Dots /> : "Sign In"}
                </Button>
            </form>
            <div className="text-xs">
                Don&apos;t have an account? <span onClick={() => setState("signUp")} className="text-sky-500 hover:underline cursor-pointer">Sign Up</span>
            </div>
        </div>
    )
}