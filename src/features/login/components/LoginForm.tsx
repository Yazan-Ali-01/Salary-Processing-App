// src/features/login/components/LoginForm.tsx
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { PasswordInput } from '@/features/register/components/PasswordInput';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "admin",
      password: "admin",
    },
    mode: 'all',
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const success = await login(data.username, data.password);
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.username}!`,
      });
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error Logging In",
        description: "Invalid credentials.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormControl>
              <PasswordInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-between">
          <NavLink to='/register'>
            <Button variant="link" className='underline hover:opacity-85'>Don't have an account ?</Button>
          </NavLink>
          <Button type="submit" disabled={!form.formState.isValid || loading} className={`block w-32 mr-1 ${!form.formState.isValid ? 'cursor-not-allowed text-gray-500/30 bg-slate-700/15' : 'text-white'}`}>{loading ? 'LoggingIn...' : 'Login'}</Button>
        </div>
      </form>
    </Form>
  );
}
