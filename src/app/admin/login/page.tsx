"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function AdminLoginPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.assign('/admin');
      } else {
        setMessage(data.error || 'Connexion échouée');
      }
    } catch (err) {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>Connexion Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label htmlFor="admin-token" className="block text-sm font-medium text-neutral-700">ADMIN_TOKEN</label>
              <input
                id="admin-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Saisir le token"
                className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              />
            </div>
            {message && <p className="text-sm text-red-600">{message}</p>}
            <CardFooter className="px-0">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2"><Spinner size={16} /> Connexion…</span>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
