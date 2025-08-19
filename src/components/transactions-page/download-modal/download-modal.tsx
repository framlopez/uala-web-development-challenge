"use client";

import { Calendar } from "@/src/shadcn/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shadcn/components/ui/dialog";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import Button from "../../cross/button";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (dateRange: { from: Date; to: Date }) => void;
}

export default function DownloadModal({
  isOpen,
  onClose,
  onDownload,
}: DownloadModalProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      setIsDownloading(true);

      try {
        await onDownload({
          from: selectedDateRange.from,
          to: selectedDateRange.to,
        });
      } finally {
        setIsDownloading(false);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedDateRange(undefined);
    onClose();
  };

  const isDateRangeValid = selectedDateRange?.from && selectedDateRange?.to;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[283px] max-w-[283px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <CalendarIcon className="size-5 text-[#606882] flex-shrink-0" />
            <DialogTitle className="text-base font-bold">
              Elegí las fechas que querés descargar
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Calendar */}
        <Calendar
          mode="range"
          selected={selectedDateRange}
          onSelect={setSelectedDateRange}
          locale={es}
          className="w-full px-0 pt-0"
          disabled={isDownloading}
          numberOfMonths={1}
        />

        <DialogFooter>
          <Button
            className="text-uala-primary py-2 px-3 rounded-full border border-uala-primary disabled:opacity-50"
            variant="outline"
            onClick={handleClose}
            disabled={isDownloading}
          >
            Cerrar
          </Button>
          <Button
            className="bg-uala-primary py-2 px-3 rounded-full border border-uala-primary text-white disabled:opacity-50 hover:bg-uala-primary/90"
            onClick={handleDownload}
            disabled={!isDateRangeValid || isDownloading}
          >
            {isDownloading ? <>Descargando...</> : <>Descargar</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
