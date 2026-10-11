import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-sky-600/15 blur-[120px]"
      />
      <h1 className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold">Page introuvable</h2>
      <p className="mt-2 text-slate-400">
        Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l’accueil
      </Link>
    </div>
  );
}
