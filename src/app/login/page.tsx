'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // For demo purposes, we will use anonymous sign-in.
      // In a real app, you would use signInWithEmailAndPassword.
      await signInAnonymously(auth);
      toast({ title: 'Login successful', description: 'Welcome back.' });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md rounded-3xl border-slate-800/60 bg-slate-950/70 shadow-2xl shadow-cyan-900/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
            <Bot className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome to BENO 1017</CardTitle>
          <CardDescription className="text-slate-400">Your AI Chief of Staff. Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="beno@ceolife.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-2xl border-slate-800 bg-slate-900/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-2xl border-slate-800 bg-slate-900/60"
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-2xl" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-center text-xs text-slate-500">
          <p>
            This is a demo application. Any email and password will work.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
