import Link from "next/link";
import { ArrowLeft, Scissors } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-sky-600/15 blur-[120px]"
      />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/25">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">Remoove</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l’accueil
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Confidentialité & Stockage
        </h1>
        <p className="mt-3 text-slate-400">
          Comment Remoove traite (et ne traite pas) vos données.
        </p>

        <section className="mt-12 space-y-10 text-slate-300">
          <div>
            <h2 className="text-xl font-semibold text-white">
              1. Confidentialité de vos images
            </h2>
            <p className="mt-3 leading-relaxed">
              Votre vie privée est notre priorité. Aucune image que vous
              déposez sur Remoove n’est envoyée ou stockée sur nos serveurs.
              Tout le traitement de suppression d’arrière-plan est effectué{" "}
              <strong className="text-white">localement</strong> sur votre
              propre appareil via votre navigateur web.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              2. Stockage local
            </h2>
            <p className="mt-3 leading-relaxed">
              Nous utilisons uniquement le <code>localStorage</code> de votre
              navigateur pour mémoriser vos préférences d’affichage (ex : mode
              sombre). Ces données sont stockées sur votre machine, restent
              privées et ne sont jamais transmises à des tiers. Ce site
              n’utilise aucun cookie de suivi publicitaire ou analytique
              tiers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              3. Notre moteur IA
            </h2>
            <p className="mt-3 leading-relaxed">
              Remoove s’appuie sur la technologie avancée de{" "}
              <a
                href="https://img.ly/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-400 hover:underline"
              >
                img.ly
              </a>
              , un leader mondial dans le traitement d’images par intelligence
              artificielle.
            </p>
            <p className="mt-3 leading-relaxed">
              Ce moteur IA fonctionne entièrement via WebAssembly directement
              dans votre navigateur. Cela garantit que le traitement ne
              nécessite pas de serveurs tiers : votre image ne quitte jamais
              votre appareil, assurant ainsi une confidentialité totale et une
              rapidité d’exécution optimale, même sur les connexions mobiles.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">4. Sécurité</h2>
            <p className="mt-3 leading-relaxed">
              Bien que nous ne stockions pas vos images, nous vous recommandons
              de toujours utiliser un appareil sécurisé et de garder votre
              navigateur à jour pour garantir la sécurité de vos données
              locales.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Remoove — par Wildis</p>
          <Link href="/" className="transition-colors hover:text-slate-300">
            Retour à l’accueil
          </Link>
        </div>
      </footer>
    </div>
  );
}
