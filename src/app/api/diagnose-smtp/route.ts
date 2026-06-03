import { NextResponse } from 'next/server';
import * as net from 'net';

export async function POST() {
  const results: any = {
    env_vars: {},
    connection_test: {},
    auth_test: {},
  };

  // 1. Vérifier les variables d'env
  results.env_vars = {
    SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
    SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
    SMTP_SECURE: process.env.SMTP_SECURE || 'NOT SET',
    SMTP_USER: process.env.SMTP_USER ? '***' : 'NOT SET',
    SMTP_PASS: process.env.SMTP_PASS ? '***' : 'NOT SET',
    SMTP_FROM: process.env.SMTP_FROM || 'NOT SET',
  };

  // 2. Tester la connexion TCP au serveur SMTP
  try {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;

    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection(port, host);

      socket.on('connect', () => {
        results.connection_test.status = 'SUCCESS';
        results.connection_test.message = `Connected to ${host}:${port}`;
        socket.destroy();
        resolve();
      });

      socket.on('error', (err) => {
        results.connection_test.status = 'FAILED';
        results.connection_test.error = err.message;
        reject(err);
      });

      socket.setTimeout(5000);
      socket.on('timeout', () => {
        results.connection_test.status = 'TIMEOUT';
        results.connection_test.error = `Timeout after 5s connecting to ${host}:${port}`;
        socket.destroy();
        reject(new Error('Timeout'));
      });
    });
  } catch (err) {
    if (!results.connection_test.status) {
      results.connection_test.status = 'FAILED';
      results.connection_test.error = err instanceof Error ? err.message : String(err);
    }
  }

  // 3. Tester l'authentification SMTP
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    results.auth_test.status = 'SUCCESS';
    results.auth_test.message = 'SMTP authentication successful';
  } catch (err) {
    results.auth_test.status = 'FAILED';
    results.auth_test.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    ...results,
  });
}
