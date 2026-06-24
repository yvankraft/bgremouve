"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

export default function ImageBackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      // Revoker les URLs créées pour éviter de saturer la mémoire
      if (originalImage instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(originalImage));
      }
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
    };
  }, [originalImage, processedImage]);

  // 1. Sélection : Rapide et instantanée
  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Fichier invalide.");
      return;
    }
    setError(null);
    setProcessedImage(null);
    setOriginalImage(file); // Mise à jour instantanée de l'UI
  };

  // 2. Traitement : Lancé par le bouton, gère l'attente et l'animation
  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true); // Active l'animation de chargement
    try {
      const blob = await removeBackground(originalImage);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error("Erreur IA :", error);
      setError("Erreur lors du traitement.");
    } finally {
      setIsProcessing(false); // Désactive l'animation
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "image_sans_fond.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("Aucune image traitée à télécharger.");
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-center md:pt-16 md:px-4 p-4 md:gap-12  bg-gradient-to-br from-white 10% via-zinc-400 90% to-black dark:from-black dark:70% dark:via-zinc-800 dark:80% dark:to-white relative">
      <header className="text-center md:mb-8">
        <h1 className="md:text-6xl text-4xl font-bold italic mb-2">Remoove</h1>
        <p className="md:text-lg text-sm text-zinc-600 dark:text-zinc-400">
          Supprimez le fond de vos images en quelques secondes, en un seul clic.
        </p>
        <p className="md:text-sm text-xs text-zinc-400 mt-1">
          Développé par{" "}
          <a href="https://yvancorps.com" className="underline">
            Wildis
          </a>
        </p>
      </header>

      <div className="md:flex gap-10 justify-center items-start w-full max-w-4xl p-8">
        {/* Colonne Gauche : Upload */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-800">Source</h2>

          {originalImage instanceof File ? (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <img
                src={URL.createObjectURL(originalImage)}
                alt="Originale"
                className="max-h-[250px] w-full object-contain rounded-xl"
              />
              <button
                onClick={handleReset}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              className="group relative border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 ease-in-out cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {" "}
              <input
                type="file"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/png, image/jpeg"
              />{" "}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-zinc-100 rounded-full group-hover:bg-blue-100 transition-colors">
                  <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-zinc-700">
                  Cliquez ou glissez
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  PNG ou JPG (Max 10Mo)
                </p>
              </div>{" "}
            </div>
          )}
        </div>

        {/* Colonne Droite : Résultat */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-800">Résultat</h2>
          <div className="relative border border-zinc-200 rounded-2xl p-4 bg-zinc-50 min-h-[200px] flex items-center justify-center overflow-hidden">
            {isProcessing ? (
              // ÉTAT DE CHARGEMENT
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-blue-600">
                  Image en cours de traitement...
                </p>
              </div>
            ) : processedImage ? (
              // ÉTAT SUCCÈS
              <div className="relative group animate-in fade-in zoom-in duration-500">
                <img
                  src={processedImage}
                  alt="Image traitée"
                  className="max-h-[250px] rounded-xl shadow-md border border-white"
                />
              </div>
            ) : (
              // ÉTAT VIDE
              <div className="text-center p-8">
                <div className="w-12 h-12 border-2 border-zinc-200 border-dashed rounded-lg mx-auto mb-2" />
                <p className="text-sm text-zinc-400"> Aucune image traitée</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-24 md:mb-0">
        <button
          className="ml-4 mt-6 px-6 py-2 bg-blue-600 text-white py-3 rounded-xl font-medium disabled:bg-gray-300 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          onClick={handleRemoveBackground}
          disabled={!originalImage}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Supprimer le fond
            </>
          )}
        </button>
        <button
          hidden={!processedImage}
          className="ml-4 mt-6 px-6 py-2 bg-green-600 text-white py-3 rounded-xl font-medium disabled:bg-gray-300 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          onClick={handleDownload}
        >
          <CheckCircle className="w-5 h-5" />
          Télécharger
        </button>
        <button
          hidden={!originalImage && !processedImage}
          className="ml-4 mt-6 px-6 py-2 bg-red-600 text-white py-3 rounded-xl font-medium disabled:bg-gray-300 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          onClick={handleReset}
        >
          <X className="w-5 h-5" />
          pour une nouvelle image
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
      )}

      <footer className="pt-6  w-full max-w-screen-xl mx-auto p-2 text-center text-zinc-500 dark:text-zinc-950 mt-auto ">
        &copy; {new Date().getFullYear()} Remoove par Wildis. Tous droits
        réservés.
        <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
        <a href="/legal" className="hover:text-blue-600 transition-colors">
          Confidentialité & Stockage
        </a>
      </footer>
    </div>
  );
}
