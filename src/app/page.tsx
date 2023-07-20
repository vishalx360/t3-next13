"use client"

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'


export default function SignInPage() {
    const { status } = useSession()
    return (
        <>
            <section className="bg-neutral-100 dark:bg-neutral-900">
                <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'anticipate' }}
                        className="flex items-center  gap-5"
                    >
                        <div className="text-3xl my-10 block dark:hidden lg:my-20">
                            Todos App
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'anticipate' }}
                        className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
                    >
                        <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
                            {status == "loading" && "loading"}
                            {status == "authenticated" && <Link className='text-blue-700 underline' href="/dashboard">Dashboard</Link>}
                            {status == "unauthenticated" && <Link className='text-blue-700 underline' href="/signin">Signin</Link>}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
