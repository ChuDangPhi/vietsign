"use client";
import React, { useState } from "react";
import { Hero } from "@/features/module/components/hero";
import { Features } from "@/features/module/components/features";
import { DictionaryMode } from "@/shared/types";

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<DictionaryMode>(
    DictionaryMode.SEARCH
  );

  const handleOpenTool = (mode: DictionaryMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
      <Hero onOpenTool={handleOpenTool} />
      <Features />
    </>
  );
}
