"use client";

import { CARD_OPTIONS } from "@/src/constants/filter-options";
import type { Filters } from "@/src/types/filters";
import { useFormContext } from "react-hook-form";
import FilterButton from "./filter-button";

export default function FilterCards() {
  const { watch, setValue } = useFormContext<Filters>();
  const selectedCards = watch("tarjeta");

  const toggleCard = (card: (typeof CARD_OPTIONS)[number]["value"]) => {
    const currentCards = [...selectedCards];
    const cardIndex = currentCards.indexOf(card);

    if (cardIndex > -1) {
      currentCards.splice(cardIndex, 1);
    } else {
      currentCards.push(card);
    }

    setValue("tarjeta", currentCards);
  };

  return (
    <div className="flex gap-3 mb-6">
      {CARD_OPTIONS.map((option) => {
        const isSelected = selectedCards.includes(option.value);

        return (
          <FilterButton
            id={`card-${option.value}`}
            checked={isSelected}
            onCheckedChange={() => toggleCard(option.value)}
            label={option.label}
            value={option.value}
            key={option.value}
          />
        );
      })}
    </div>
  );
}
