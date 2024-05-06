// src/features/register/components/RegisterForm.tsx
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { PasswordInput } from '@/features/login/components/PasswordInput';

const FormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().min(2, { message: "Email must be filled." }).email("Email must be a valid email."),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function RegisterForm() {
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
    },
    mode: 'all',
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const success = await register(data.username, data.password, data.name, data.email);

    if (success) {
      toast({
        title: "Registration Successful",
        description: `You can now login with your new account.`,
      });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Full Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
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
        <div className="flex justify-end">
          <Button type="submit" disabled={!form.formState.isValid || loading} className={`block mr-1 ${!form.formState.isValid ? 'cursor-not-allowed text-gray-500/30 bg-slate-700/15' : 'text-white'}`}>{loading ? 'Creating Account...' : 'Register'}</Button>
        </div>
      </form>
    </Form>
  );
}