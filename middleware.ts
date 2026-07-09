import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js IP Whitelist Middleware
 *
 * This middleware restricts access to the entire Next.js application based on a whitelist
 * of IP addresses. It reads the ALLOWED_IPS environment variable (comma-separated list)
 * and only allows requests from those IPs in production mode or when ENABLE_IP_WHITELIST=true.
 *
 * Features:
 * - Supports IPv4 and IPv6-mapped IPv4 addresses (e.g., ::ffff:192.168.1.1)
 * - Handles X-Forwarded-For header for proxies (Vercel, Render, etc.)
 * - Enforces in production (NODE_ENV === "production") or when ENABLE_IP_WHITELIST=true
 * - Returns custom 403 Access Denied page
 * - Protects all routes, pages, API routes, and static content
 * - Detailed logging for testing and debugging
 *
 * Placement: This file should be in the root of your Next.js project (frontend/middleware.ts)
 */

export function middleware(request: NextRequest) {
  // Check if IP whitelist is enabled
  const enableWhitelist = process.env.ENABLE_IP_WHITELIST === "true";

  // Skip IP check if not in production AND ENABLE_IP_WHITELIST is not set
  if (process.env.NODE_ENV !== "production" && !enableWhitelist) {
    console.log(
      "ℹ️  Frontend IP Whitelist: DISABLED (development mode without ENABLE_IP_WHITELIST)",
    );
    return NextResponse.next();
  }

  console.log(
    `🔒 Frontend IP Whitelist: ENABLED (NODE_ENV=${process.env.NODE_ENV}, ENABLE_IP_WHITELIST=${process.env.ENABLE_IP_WHITELIST || "not set"})`,
  );

  // Get allowed IPs from environment variable
  const allowedIpsEnv = process.env.ALLOWED_IPS;

  // If ALLOWED_IPS is not set, deny all requests in production
  if (!allowedIpsEnv) {
    console.error(
      "SECURITY: ALLOWED_IPS environment variable is not set. Denying all requests.",
    );
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Access denied. IP not whitelisted.",
        error: "Server configuration error",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Parse allowed IPs (comma-separated)
  const allowedIps = allowedIpsEnv
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);

  if (allowedIps.length === 0) {
    console.error("SECURITY: ALLOWED_IPS is empty. Denying all requests.");
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Access denied. IP not whitelisted.",
        error: "Server configuration error",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Get client IP from request
  // Vercel and other proxies set x-forwarded-for header
  let clientIp: string | null = null;

  // Try to get from x-forwarded-for header (most common with proxies)
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2, ...)
    // The first one is the original client IP
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    clientIp = ips[0];
  }

  // If still no IP, deny access
  if (!clientIp) {
    console.warn("SECURITY: Could not determine client IP. Denying access.");
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Access denied. Unable to verify IP address.",
        error: "Unable to determine client IP",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Normalize IP for comparison
  // Handle IPv6-mapped IPv4 addresses (e.g., ::ffff:192.168.1.1 -> 192.168.1.1)
  let normalizedClientIp = clientIp;
  if (clientIp.startsWith("::ffff:")) {
    normalizedClientIp = clientIp.substring(7); // Remove "::ffff:" prefix
  }

  // Log detailed information
  console.log("🔍 Frontend IP Whitelist Check:");
  console.log(`   Client IP: ${clientIp}`);
  console.log(`   Normalized IP: ${normalizedClientIp}`);
  console.log(`   Allowed IPs: ${allowedIps.join(", ")}`);

  // Check if client IP is in whitelist
  const isAllowed = allowedIps.some((allowedIp) => {
    // Direct match with original or normalized IP
    if (clientIp === allowedIp || normalizedClientIp === allowedIp) {
      return true;
    }
    return false;
  });

  if (!isAllowed) {
    console.error(
      `❌ ACCESS DENIED - IP: ${clientIp} (normalized: ${normalizedClientIp}) is NOT in whitelist`,
    );
    console.error(`   Allowed IPs: ${allowedIps.join(", ")}`);

    // Return custom 403 Access Denied page
    return new NextResponse(createAccessDeniedPage(), {
      status: 403,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  // IP is whitelisted, proceed
  console.log(
    `✅ ACCESS ALLOWED - IP: ${clientIp} (normalized: ${normalizedClientIp}) is whitelisted`,
  );
  return NextResponse.next();
}

/**
 * Creates a custom HTML page for 403 Access Denied
 */
function createAccessDeniedPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied - 403</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        
        .error-code {
            font-size: 120px;
            font-weight: bold;
            color: #667eea;
            line-height: 1;
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 20px;
        }
        
        p {
            font-size: 18px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            text-align: left;
        }
        
        .info-box h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .info-box p {
            font-size: 14px;
            color: #666;
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔒</div>
        <div class="error-code">403</div>
        <h1>Access Denied</h1>
        <p>
            Your IP address is not authorized to access this application.
            Please contact your administrator if you believe this is an error.
        </p>
        <div class="info-box">
            <h3>Security Notice</h3>
            <p>
                This application is protected by IP whitelisting. 
                Only authorized IP addresses can access the system.
                If you need access, please reach out to your system administrator.
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Configure which paths should be protected by the middleware
// This matcher protects all routes except static files and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
