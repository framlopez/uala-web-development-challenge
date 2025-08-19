"use client";

import { downloadTransactions } from "@/src/utils/download-transactions";
import { useState } from "react";
import ButtonIcon from "../../cross/button-icon";
import DownloadIcon from "../../icons/download";
import DownloadModal from "./download-modal";
import Notification from "./notification";

export default function DownloadModalButton() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const closeDownloadModal = () => setIsDownloadModalOpen(false);
  const openDownloadModal = () => setIsDownloadModalOpen(true);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleDownload = async (dateRange: { from: Date; to: Date }) => {
    try {
      setIsDownloading(true);
      await downloadTransactions(dateRange);

      showNotification("Archivo descargado correctamente", "success");
    } catch (error) {
      console.error("Error al descargar:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al descargar las transacciones";
      showNotification(errorMessage, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <ButtonIcon
        className="text-uala-primary"
        onClick={openDownloadModal}
        disabled={isDownloading}
      >
        <DownloadIcon
          className={`size-6 ${isDownloading ? "animate-pulse" : ""}`}
        />
      </ButtonIcon>

      {/* Modal de descarga */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
        onDownload={handleDownload}
      />

      {/* Notificaciones */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
}
