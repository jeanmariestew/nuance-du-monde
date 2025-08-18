"use client";
import { useState } from 'react';

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
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24 }}>
      <h1>Connexion Admin</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>ADMIN_TOKEN</label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Saisir le token"
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      {message && <p style={{ color: 'crimson', marginTop: 12 }}>{message}</p>}
    </div>
  );
}
