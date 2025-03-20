import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <div className="max-w-screen-md mx-auto px-4 md:px-0 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold no-underline text-white">
              tails.music
            </Link>
            <button
              data-cal-link="adam-xyz/free-strategy-consultation"
              data-cal-namespace="15min"
              data-cal-config='{"layout":"month_view"}'
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Book Call
            </button>
          </div>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* Cal element-click embed code begins */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
          Cal("init", "15min", {origin:"https://cal.com"});

          // Important: Please add the following attributes to the element that should trigger the calendar to open upon clicking.
          // \`data-cal-link="adam-xyz/15min"\`
          // data-cal-namespace="15min"
          // \`data-cal-config='{"layout":"month_view"}'\`

          Cal.ns["15min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
          Cal("preload", { calLink: "adam-xyz/free-strategy-consultation" });
          `,
          }}
        />
        {/* Cal element-click embed code ends */}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
