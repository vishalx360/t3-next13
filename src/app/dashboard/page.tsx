"use client"

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { addTodoSchema } from '@/utils/ValidationSchema';
import { trpc } from '@/utils/trpc';
import { type Todo } from '@prisma/client';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Formik, Form, Field } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useDebouncedCallback } from 'use-debounce';


function Dashboard() {
    const api = trpc.useContext();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            }
        }
    });
    const { data: todos, isLoading, refetch } = trpc.todo.getTodos.useQuery();

    const refetchTodos = useDebouncedCallback(refetch, 3000);

    const { mutate: addTodo } = trpc.todo.addTodo.useMutation({
        onMutate: (variables) => {
            const newTodo = {
                title: variables.title,
                completed: false,
                createdAt: new Date(),
                userId: session?.user?.id ?? null,
                id: Math.random().toString(),
            }
            api.todo.getTodos.setData(
                undefined,
                (prev) => prev ? [newTodo, ...prev,] : [newTodo]
            )
        },
        onSuccess: async () => {
            await refetchTodos();
        }
    });

    const onSubmit = (values: addTodoSchema) => {
        addTodo(values);
    };

    return (
        <section className="bg-neutral-100 dark:bg-neutral-900">
            <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'anticipate' }}
                    className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
                >
                    <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
                        <div className='flex items-center gap-5'>

                            <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                                TODOS
                            </h1>
                            {isLoading && <Loader />}

                        </div>
                        <div>
                            <Formik
                                initialValues={{ title: '' }}
                                validationSchema={toFormikValidationSchema(addTodoSchema)}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form >
                                        <div className="flex gap-2 items-center">

                                            <Field
                                                as={Input}
                                                type="title"
                                                id="todo"
                                                name="title"
                                                placeholder="Add a todo"
                                                className="w-full"
                                            />
                                            <Button className="w-fit" type="submit" disabled={isSubmitting}>
                                                Add
                                            </Button>
                                        </div>
                                        {errors.title && touched.title && (
                                            <div className='text-red-500'>{errors.title}</div>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                            <div className='max-h-52 overflow-y-scroll my-5 space-y-5'>
                                {todos?.map((todo) => (
                                    <TodoItem key={todo.id} todo={todo} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className="flex items-center gap-3 mt-10">
                    <img
                        className="rounded-full h-10 w-10"
                        src={session?.user?.image}
                        alt={session?.user?.name}
                    />
                    <h1>{session?.user?.email}</h1>
                </div>
                <button className='text-red-500' onClick={async () => { await signOut(); }}>Sign out</button>
            </div>
        </section>
    );
}


function TodoItem({ todo }: { todo: Todo }) {
    const { mutate: updateTodo, isLoading } = trpc.todo.updateTodo.useMutation({
        onMutate: () => {
            // do optimistic update

        },
        onSuccess: () => {
            // refetchTodos();
        }
    });

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={todo.id}
                checked={todo.completed}
                onCheckedChange={() => {
                    updateTodo({
                        id: todo.id,
                        completed: !todo.completed,
                        title: todo.title,
                    });
                }}
            />
            <label
                htmlFor={todo.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {todo.title}
            </label>
            {isLoading && <Loader />}
        </div>
    )
}

export default Dashboard;
