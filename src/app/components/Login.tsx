/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use Angular Signals for reactive state management (username, password, isLoading)
 * - Create AuthService for authentication logic
 * - Use Router for navigation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Inserisci username e password');
      return;
    }

    setIsLoading(true);
    
    // Simulazione login (in produzione: chiamata API tramite AuthService)
    setTimeout(() => {
      if (username === 'officina' && password === 'demo') {
        toast.success('Accesso effettuato con successo!');
        onLogin();
      } else {
        toast.error('Credenziali non valide');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#088395] to-[#09637E] opacity-10" />
      
      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#088395] rounded-full flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-3xl text-[#088395]">
              Officina Autorizzata
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sistema di Gestione Pratiche
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#10546D]">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Inserisci username"
                  className="pl-10 border-[#7AB2B2] focus:ring-[#088395]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#10546D]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Inserisci password"
                  className="pl-10 border-[#7AB2B2] focus:ring-[#088395]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#088395] hover:bg-[#09637E] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>

            {/* Demo Credentials Info */}
            <div className="bg-[#EBF4F6] border border-[#7AB2B2] rounded-lg p-4 text-sm">
              <p className="text-[#10546D] font-medium mb-2">Credenziali Demo:</p>
              <p className="text-gray-600">Username: <span className="font-mono">officina</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">demo</span></p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-sm text-gray-600">
        <p>© 2026 Officina Autorizzata - Sistema Gestione Pratiche</p>
      </div>
    </div>
  );
}
