"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

export default function SignInPage() {
  // if loggedin redirect to /dashboard
  const router = useRouter();
  const { status } = useSession();
  if (status === "authenticated") {
    router.push("/dashboard").catch((err) => console.log(err));
  }
  async function handelOauthSignin(provider: string) {
    await signIn(provider);
  }
  return (
    <>
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "anticipate" }}
            className="flex items-center  gap-5"
          >
            <div className="my-10 block text-3xl dark:hidden lg:my-20">
              Todos App
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "anticipate" }}
            className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
          >
            <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                Sign in to your account
              </h1>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => {
                    void handelOauthSignin("google");
                  }}
                  variant="outline"
                  className="text-md flex w-full items-center justify-center gap-4"
                  size="lg"
                  LeftIcon={<FcGoogle />}
                >
                  Google
                </Button>
                <Button
                  onClick={() => {
                    void handelOauthSignin("linkedin");
                  }}
                  variant="outline"
                  className="text-md flex w-full items-center justify-center gap-4"
                  size="lg"
                  LeftIcon={<FaLinkedin />}
                >
                  Linkedin
                </Button>
              </div>

              {/* <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-black hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p> */}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
