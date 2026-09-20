import dns from 'node:dns/promises';
import { URL } from 'node:url';

const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

export const isPrivateOrLoopbackIp = (ip: string): boolean => {
  return BLOCKED_IP_PATTERNS.some((pattern) => pattern.test(ip));
};

export interface LinkCheckResult {
  isValid: boolean;
  httpStatus?: number;
  error?: string;
}

export const verifyUrlSafe = async (rawUrl: string): Promise<LinkCheckResult> => {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Protokol URL harus HTTP atau HTTPS' };
    }

    const hostname = parsed.hostname;

    if (isPrivateOrLoopbackIp(hostname)) {
      return { isValid: false, error: 'Akses ke IP privat/lokal diblokir (SSRF Protection)' };
    }

    const resolvedIps = await dns.resolve(hostname);

    for (const ip of resolvedIps) {
      if (isPrivateOrLoopbackIp(ip)) {
        return { isValid: false, error: 'Domain mengarah ke IP privat internal (SSRF Protection)' };
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let res = await fetch(rawUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Logfolio-ProofLinkValidator/1.0',
      },
    });

    if (res.status === 405 || res.status === 403) {
      res = await fetch(rawUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Logfolio-ProofLinkValidator/1.0',
        },
      });
    }

    clearTimeout(timeoutId);

    const isOk = res.status >= 200 && res.status < 400;

    return {
      isValid: isOk,
      httpStatus: res.status,
      error: isOk ? undefined : `Target merespon dengan status ${res.status}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Koneksi gagal atau URL tidak dapat diakses';
    return {
      isValid: false,
      error: message,
    };
  }
};
