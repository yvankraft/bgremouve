"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  FileArchive,
  ImagePlus,
  Images,
  Infinity as InfinityIcon,
  Layers,
  Loader2,
  Plus,
  Scissors,
  ShieldCheck,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import JSZip from "jszip";

type Status = "pending" | "processing" | "done" | "error";

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  status: Status;
  progress: number;
  resultUrl?: string;
  resultBlob?: Blob;
  showOriginal: boolean;
}

const outName = (name: string) =>
  `${name.replace(/\.[^.]+$/, "") || "image"}-sans-fond.png`;

const HEIC_RE = /\.(heic|heif)$/i;

const isHeicFile = (f: File) =>
  f.type === "image/heic" ||
  f.type === "image/heif" ||
  HEIC_RE.test(f.name);

const decodeHeicNatively = async (file: File): Promise<Blob | null> => {
  try {
    const bmp = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bmp, 0, 0);
    bmp.close();
    return await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", 0.92)
    );
  } catch {
    return null;
  }
};

const convertHeicToJpeg = async (file: File): Promise<File | null> => {
  let blob: Blob | null = null;
  try {
    const { heicTo } = await import("heic-to");
    blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
  } catch (e) {
    console.error(
      `Conversion HEIC échouée, tentative native (${file.name})`,
      e
    );
    blob = await decodeHeicNatively(file);
  }
  if (!blob) return null;
  return new File([blob], file.name.replace(HEIC_RE, ".jpg"), {
    type: "image/jpeg",
  });
};

const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-slate-800/90 text-slate-300 border-white/10",
  },
  processing: {
    label: "Traitement…",
    className: "bg-sky-500/20 text-sky-200 border-sky-400/30",
  },
  done: {
    label: "Prêt",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
  error: {
    label: "Erreur",
    className: "bg-red-500/20 text-red-300 border-red-400/30",
  },
};

function ImageCard({
  item,
  busy,
  onProcess,
  onRemove,
  onDownload,
  onToggleView,
}: {
  item: ImageItem;
  busy: boolean;
  onProcess: () => void;
  onRemove: () => void;
  onDownload: () => void;
  onToggleView: () => void;
}) {
  const showResult =
    item.status === "done" && !item.showOriginal && !!item.resultUrl;
  const src = showResult ? item.resultUrl! : item.previewUrl;
  const status = STATUS_STYLE[item.status];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition-colors hover:border-white/20">
      <div
        className={`relative aspect-square ${
          showResult ? "bg-checkerboard" : "bg-slate-800/50"
        }`}
      >
        <img
          src={src}
          alt={item.name}
          className="h-full w-full object-contain"
        />

        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium backdrop-blur ${status.className}`}
        >
          {item.status === "processing" && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {item.status === "done" && <CheckCircle2 className="h-3 w-3" />}
          {item.status === "error" && <AlertCircle className="h-3 w-3" />}
          {item.status === "processing"
            ? `${item.progress}%`
            : status.label}
        </span>

        <button
          onClick={onRemove}
          title="Retirer"
          className="absolute right-2 top-2 rounded-full border border-white/10 bg-slate-950/70 p-1.5 text-slate-400 opacity-0 backdrop-blur transition-opacity hover:text-red-400 group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {item.status === "done" && (
          <button
            onClick={onToggleView}
            title={item.showOriginal ? "Voir le résultat" : "Voir l’original"}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-300 backdrop-blur transition-colors hover:text-white"
          >
            <Eye className="h-3 w-3" />
            {item.showOriginal ? "Résultat" : "Original"}
          </button>
        )}

        {item.status === "processing" && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 p-3">
        <p className="min-w-0 flex-1 truncate text-xs text-slate-500">
          {item.name}
        </p>
        {(item.status === "pending" || item.status === "error") && (
          <button
            onClick={onProcess}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <WandSparkles className="h-3.5 w-3.5" />
            {item.status === "error" ? "Réessayer" : "Détourer"}
          </button>
        )}
        {item.status === "done" && (
          <button
            onClick={onDownload}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </button>
        )}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% privé",
    text: "Le traitement s’exécute localement via WebAssembly. Vos images ne quittent jamais votre appareil.",
  },
  {
    icon: Layers,
    title: "Traitement par lot",
    text: "Sélectionnez plusieurs images, lancez le détourage en chaîne et exportez tout en un ZIP.",
  },
  {
    icon: Zap,
    title: "Rapide",
    text: "Modèle IA optimisé pour le navigateur : quelques secondes par image, même sur mobile.",
  },
  {
    icon: InfinityIcon,
    title: "Gratuit & illimité",
    text: "Aucun compte, aucun filigrane, aucune limite. Détourez autant d’images que vous voulez.",
  },
];

const STEPS = [
  { icon: Images, label: "Déposez vos images" },
  { icon: WandSparkles, label: "L’IA supprime le fond" },
  { icon: Download, label: "Téléchargez en PNG ou ZIP" },
];

const FAQ_ITEMS = [
  {
    q: "Remoove est-il vraiment gratuit ?",
    a: "Oui. Le détourage est illimité, sans filigrane et sans création de compte. Le traitement s’exécute dans votre navigateur : aucun serveur à payer, donc aucun coût à vous refacturer.",
  },
  {
    q: "Mes photos sont-elles envoyées sur internet ?",
    a: "Non. Le modèle d’IA fonctionne localement via WebAssembly : vos images ne quittent jamais votre appareil. C’est idéal pour les photos sensibles, professionnelles ou personnelles.",
  },
  {
    q: "Puis-je détourer plusieurs images en même temps ?",
    a: "Oui. Sélectionnez ou glissez plusieurs photos, lancez le traitement par lot, puis téléchargez chaque PNG individuellement ou toutes les images regroupées dans une archive ZIP.",
  },
  {
    q: "Est-ce que ça marche sur téléphone et avec une connexion lente ?",
    a: "Oui. Remoove est conçu pour le mobile. Après un premier chargement, le navigateur garde le modèle d’IA en cache : les traitements suivants restent rapides, même avec une connexion instable.",
  },
  {
    q: "Pour quels usages puis-je utiliser Remoove ?",
    a: "Photos produits pour vos boutiques en ligne (Jumia, WhatsApp Business, réseaux sociaux), photos d’identité, visuels de communication, design graphique, montages…",
  },
  {
    q: "Quels formats sont acceptés et exportés ?",
    a: "En entrée : PNG, JPG, WebP et la plupart des formats image. En sortie : PNG avec fond transparent, téléchargeable individuellement ou en lot dans un ZIP.",
  },
];

const SITE_URL = "https://remoove.yvancorps.com";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Remoove",
      url: SITE_URL,
      description:
        "Outil gratuit de suppression d’arrière-plan par IA : détourage de photos en un clic ou par lot, traitement 100% local dans le navigateur, export PNG et ZIP.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Nécessite JavaScript",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "XAF" },
      featureList: [
        "Suppression d’arrière-plan par intelligence artificielle",
        "Traitement par lot de plusieurs images",
        "Export PNG transparent et archive ZIP",
        "Traitement 100% local — aucune image envoyée sur un serveur",
      ],
      areaServed: [
        { "@type": "Country", name: "Cameroon" },
        { "@type": "Country", name: "Gabon" },
        { "@type": "Country", name: "Republic of the Congo" },
        { "@type": "Country", name: "Democratic Republic of the Congo" },
        { "@type": "Country", name: "Chad" },
        { "@type": "Country", name: "Central African Republic" },
        { "@type": "Country", name: "Equatorial Guinea" },
      ],
      author: {
        "@type": "Organization",
        name: "Wildis",
        url: "https://yvancorps.com",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function ImageBackgroundRemover() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<ImageItem[]>([]);
  const urlsRef = useRef<Set<string>>(new Set());
  const runningRef = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const track = useCallback((url: string) => {
    urlsRef.current.add(url);
    return url;
  }, []);
  const release = (url?: string) => {
    if (url && urlsRef.current.delete(url)) URL.revokeObjectURL(url);
  };

  const updateItem = (id: string, patch: Partial<ImageItem>) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );

  const addFiles = useCallback(
    (files: Iterable<File> | FileList) => {
      const arr = Array.from(files);
      const valid = arr.filter(
        (f) => f.type.startsWith("image/") || isHeicFile(f)
      );
      setError(
        valid.length < arr.length
          ? "Certains fichiers ont été ignorés : seules les images sont acceptées."
          : null
      );
      if (!valid.length) return;
      void Promise.all(
        valid.map((f) => (isHeicFile(f) ? convertHeicToJpeg(f) : f))
      ).then((converted) => {
        const ready = converted.filter((f): f is File => f !== null);
        if (ready.length < converted.length) {
          setError(
            "Certaines photos HEIC n’ont pas pu être converties."
          );
        }
        if (!ready.length) return;
        setItems((prev) => [
          ...prev,
          ...ready.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            previewUrl: track(URL.createObjectURL(file)),
            status: "pending" as Status,
            progress: 0,
            showOriginal: false,
          })),
        ]);
      });
    },
    [track]
  );

  // Coller une image depuis le presse-papiers
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files?.length) addFiles(e.clipboardData.files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  const processItems = async (ids: string[]) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsRunning(true);
    setError(null);
    for (const id of ids) {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item || item.status !== "pending") continue;
      updateItem(id, { status: "processing", progress: 0 });
      try {
        const blob = await removeBackground(item.file, {
          model: "isnet_fp16",
          output: { format: "image/png" },
          progress: (_key, current, total) => {
            if (total > 0) {
              updateItem(id, {
                progress: Math.min(99, Math.round((current / total) * 100)),
              });
            }
          },
        });
        if (!itemsRef.current.some((i) => i.id === id)) continue;
        updateItem(id, {
          status: "done",
          progress: 100,
          resultUrl: track(URL.createObjectURL(blob)),
          resultBlob: blob,
        });
      } catch (e) {
        console.error("Erreur IA :", e);
        updateItem(id, { status: "error", progress: 0 });
      }
    }
    runningRef.current = false;
    setIsRunning(false);
  };

  const processAll = () =>
    processItems(
      itemsRef.current
        .filter((i) => i.status === "pending" || i.status === "error")
        .map((i) => i.id)
    );

  const removeItem = (id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (item) {
      release(item.previewUrl);
      release(item.resultUrl);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    itemsRef.current.forEach((i) => {
      release(i.previewUrl);
      release(i.resultUrl);
    });
    setItems([]);
    setError(null);
  };

  const downloadItem = (item: ImageItem) => {
    if (item.resultUrl) triggerDownload(item.resultUrl, outName(item.name));
  };

  const downloadAll = async () => {
    const done = items.filter(
      (i) => i.status === "done" && i.resultBlob
    );
    if (!done.length) return;
    if (done.length === 1) {
      triggerDownload(done[0].resultUrl!, outName(done[0].name));
      return;
    }
    setIsZipping(true);
    try {
      const zip = new JSZip();
      done.forEach((i) => zip.file(outName(i.name), i.resultBlob!));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = track(URL.createObjectURL(blob));
      triggerDownload(url, "remoove-detourage.zip");
      setTimeout(() => release(url), 10_000);
    } catch (e) {
      console.error(e);
      setError("Impossible de créer l’archive ZIP.");
    } finally {
      setIsZipping(false);
    }
  };

  const pendingCount = items.filter(
    (i) => i.status === "pending" || i.status === "error"
  ).length;
  const doneCount = items.filter((i) => i.status === "done").length;

  const openPicker = () => fileInputRef.current?.click();

  const dropZoneProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
  };

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        if (e.target.files?.length) addFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  return (
    <div className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Halos lumineux */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[700px] bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-sky-600/20 blur-[140px]" />
        <div className="absolute left-[-160px] top-1/3 h-[380px] w-[380px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute right-[-160px] top-2/3 h-[380px] w-[380px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/25">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">Remoove</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% local · Gratuit
            </span>
            <Link
              href="/legal"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Confidentialité
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-12 pt-16 text-center sm:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
            <Sparkles className="h-4 w-4" />
            IA on-device — aucune image n’est envoyée sur un serveur
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Détourez vos images
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              en un clic, par lot.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            Supprimez l’arrière-plan d’une ou de plusieurs photos directement
            dans votre navigateur. Gratuit, illimité, sans filigrane — et vos
            fichiers ne quittent jamais votre appareil.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openPicker}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-600/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Choisir des images
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-500">
              ou glissez-déposez, collez (Ctrl+V)
            </span>
          </div>

          {/* Étapes */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
                  <step.icon className="h-4 w-4" />
                </span>
                <p className="text-sm text-slate-300">
                  <span className="mr-1.5 font-semibold text-sky-400">
                    {i + 1}.
                  </span>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Zone applicative */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          {fileInput}
          {items.length === 0 ? (
            <div
              {...dropZoneProps}
              onClick={openPicker}
              className={`group relative cursor-pointer rounded-3xl border-2 border-dashed p-14 text-center transition-all sm:p-20 ${
                isDragging
                  ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                  : "border-slate-700 bg-white/[0.02] hover:border-sky-400/60 hover:bg-white/[0.04]"
              }`}
            >
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 text-sky-300 transition-transform group-hover:scale-110">
                <ImagePlus className="h-8 w-8" />
              </div>
              <p className="text-xl font-semibold">
                Glissez vos images ici
              </p>
              <p className="mt-2 text-sm text-slate-500">
                ou cliquez pour parcourir — PNG, JPG, WebP, HEIC (photos
                iPhone)… sélection multiple acceptée
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur sm:p-6">
              {/* Barre d’actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-white">
                    {items.length}
                  </span>{" "}
                  image{items.length > 1 ? "s" : ""}
                  {doneCount > 0 && (
                    <>
                      {" · "}
                      <span className="text-emerald-400">
                        {doneCount} prête{doneCount > 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={openPicker}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                  {pendingCount > 0 && (
                    <button
                      onClick={processAll}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <WandSparkles className="h-4 w-4" />
                      )}
                      Tout détourer ({pendingCount})
                    </button>
                  )}
                  {doneCount > 0 && (
                    <button
                      onClick={downloadAll}
                      disabled={isZipping}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      {isZipping ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : doneCount > 1 ? (
                        <FileArchive className="h-4 w-4" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {doneCount > 1 ? `ZIP (${doneCount})` : "Télécharger"}
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Tout effacer
                  </button>
                </div>
              </div>

              {/* Dropzone compacte */}
              <div
                {...dropZoneProps}
                onClick={openPicker}
                className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm transition-colors ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-700 text-slate-500 hover:border-sky-400/50 hover:text-slate-300"
                }`}
              >
                <Plus className="h-4 w-4" />
                Glissez ou cliquez pour ajouter d’autres images
              </div>

              {/* Grille */}
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    busy={isRunning}
                    onProcess={() => processItems([item.id])}
                    onRemove={() => removeItem(item.id)}
                    onDownload={() => downloadItem(item)}
                    onToggleView={() =>
                      updateItem(item.id, {
                        showOriginal: !item.showOriginal,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </section>

        {/* Arguments */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Pourquoi{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Remoove
              </span>{" "}
              ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
              Un outil de détourage pensé pour la vitesse, le volume et le
              respect de votre vie privée — conçu pour les créateurs, vendeurs
              en ligne et entrepreneurs du Cameroun et de toute l’Afrique
              centrale.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-colors hover:border-sky-500/30 hover:bg-white/[0.05]"
                >
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 text-sky-300">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Questions fréquentes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
              Tout ce qu’il faut savoir avant de supprimer le fond de vos
              photos.
            </p>
            <div className="mt-10 space-y-3">
              {FAQ_ITEMS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 transition-colors open:border-sky-500/30 open:bg-white/[0.05]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <Plus className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Remoove — par{" "}
            <a
              href="https://yvancorps.com"
              className="text-slate-300 transition-colors hover:text-cyan-400"
            >
              Wildis
            </a>
          </p>
          <Link
            href="/legal"
            className="transition-colors hover:text-slate-300"
          >
            Confidentialité & Stockage
          </Link>
        </div>
      </footer>
    </div>
  );
}
