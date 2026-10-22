import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

/**
 * Returns the IP of the real visitor.
 *
 * In production the app runs behind Cloudflare and Traefik, so `req.ip` is the
 * address of the proxy that opened the socket, not the visitor. Using it as the
 * throttle key puts every visitor in one shared bucket. Cloudflare sends the
 * visitor IP in `CF-Connecting-IP`. Without that header (local dev, direct
 * access), we use `req.ip`.
 */
export function resolveClientIp(req: Record<string, any>): string {
    const cfConnectingIp = req.headers?.["cf-connecting-ip"];
    if (typeof cfConnectingIp === "string" && cfConnectingIp.trim()) {
        return cfConnectingIp.trim();
    }
    return req.ip;
}

@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): string {
        return resolveClientIp(req);
    }
}
