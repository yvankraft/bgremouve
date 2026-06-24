import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-9xl font-bold text-zinc-300 dark:text-zinc-800">
        404
      </h1>
      <h2 className="text-2xl font-semibold mt-4 text-zinc-800 dark:text-zinc-200">
        Page introuvable
      </h2>
      <p className="mt-2 text-zinc-500">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
