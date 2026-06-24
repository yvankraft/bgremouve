export default function LegalPage() {
  return (
    <div className="h-screen  sm:px-36 flex flex-col justify-center items-center mx-auto py-20 px-6 text-zinc-800 dark:text-zinc-200 bg-gradient-to-br from-white 10% via-zinc-400 90% to-black dark:from-black dark:70% dark:via-zinc-800 dark:80% dark:to-white">
      <h1 className="text-4xl font-bold mb-8">Confidentialité & Stockage</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          1. Confidentialité de vos images
        </h2>
        <p>
          Votre vie privée est notre priorité. Aucune image que vous téléchargez
          sur Remoove n'est envoyée ou stockée sur nos serveurs. Tout le
          traitement de suppression d'arrière-plan est effectué{" "}
          <strong>localement</strong> sur votre propre appareil via votre
          navigateur web.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. Stockage local</h2>
        <p>
          Nous utilisons uniquement le <code>localStorage</code> de votre
          navigateur pour mémoriser vos préférences d'affichage (ex: mode
          sombre). Ces données sont stockées sur votre machine, restent privées
          et ne sont jamais transmises à des tiers. Ce site n'utilise aucun
          cookie de suivi publicitaire ou analytique tiers.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. Notre moteur IA</h2>
        <p className="mt-4">
          Remoove s'appuie sur la technologie avancée de
          <a
            href="https://img.ly/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {" "}
            img.ly{" "}
          </a>
          , un leader mondial dans le traitement d'images par intelligence
          artificielle.
        </p>
        <p className="mt-2">
          Ce moteur IA fonctionne entièrement via WebAssembly directement dans
          votre navigateur. Cela garantit que le traitement ne nécessite pas de
          serveurs tiers : votre image ne quitte jamais votre appareil, assurant
          ainsi une confidentialité totale et une rapidité d'exécution optimale,
          même sur les connexions mobiles.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Sécurité</h2>
        <p>
          Bien que nous ne stockions pas vos images, nous vous recommandons de
          toujours utiliser un appareil sécurisé et de garder votre navigateur à
          jour pour garantir la sécurité de vos données locales.
        </p>
      </section>

      <footer className="mt-auto text-sm">
        &copy; {new Date().getFullYear()} Remoove par Wildis. Tous droits
        réservés.
        <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
        <a
          href="/"
          className="hover:text-blue-600 text-zinc-100 dark:text-zinc-500 hover:underline  transition-colors"
        >
          Retour à l'accueil
        </a>
      </footer>
    </div>
  );
}
    
