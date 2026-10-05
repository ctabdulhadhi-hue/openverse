"use client";

import Image from "next/image";
import { useState } from "react";

import type { ItemCategory, ItemDefinition } from "@/data/items/itemsData";
import { useGame } from "@/game/core/state/GameContext";

import { MenuTabBar } from "./MenuTabBar";

const CATEGORIES: { id: ItemCategory; label: string; icon: string }[] = [
  { id: "ITEMS", label: "ITEMS", icon: "🎒" },
  { id: "TOOLS", label: "TOOLS", icon: "🔧" },
  { id: "CONSUMABLES", label: "CONSUMABLES", icon: "🧪" },
  { id: "COLLECTIBLES", label: "COLLECTIBLES", icon: "🏆" },
  { id: "SPECIAL", label: "SPECIAL", icon: "✨" },
];

export function InventoryScreen() {
  const { state, pushNotification } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("ITEMS");
  const [selectedItemId, setSelectedItemId] = useState<string>("camera");

  const filteredItems = state.inventory.filter((item) => item.category === selectedCategory);

  const selectedItem: ItemDefinition | undefined =
    state.inventory.find((i) => i.id === selectedItemId) ?? filteredItems[0] ?? state.inventory[0];

  const handleUseItem = (item: ItemDefinition) => {
    pushNotification({
      type: "item",
      title: "ITEM USED",
      subtitle: `${item.name} activated`,
    });
  };

  // Render 16 total inventory slots (filled + empty)
  const totalSlots = 16;
  const emptySlotsCount = Math.max(0, totalSlots - filteredItems.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Inventory screen"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 text-white"
    >
      <MenuTabBar currentTab="inventory" />

      {/* Main 3-Column Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 overflow-hidden p-6 md:flex-row">
        {/* Left Column: Categories */}
        <aside className="flex w-full shrink-0 gap-2 md:w-56 md:flex-col">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const firstInCat = state.inventory.find((i) => i.category === cat.id);
                  if (firstInCat) setSelectedItemId(firstInCat.id);
                }}
                className={`font-display flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Middle Column: Inventory Grid (4x4) */}
        <section aria-label="Inventory grid" className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className={`group relative flex aspect-square flex-col items-center justify-center rounded-2xl border p-4 transition ${
                    isSelected
                      ? "scale-[1.02] border-cyan-400 bg-cyan-950/40 shadow-[0_0_16px_rgba(56,189,248,0.3)]"
                      : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-black/60"
                  }`}
                >
                  {/* Item Image or Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain drop-shadow-md"
                      />
                    ) : (
                      <span className="text-3xl text-neutral-300">📦</span>
                    )}
                  </div>

                  <span className="font-display mt-2 w-full truncate px-1 text-center text-xs font-semibold text-neutral-200 group-hover:text-white">
                    {item.name}
                  </span>

                  {/* Quantity badge */}
                  <span className="absolute right-2 bottom-2 rounded border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300">
                    x{item.quantity}
                  </span>
                </button>
              );
            })}

            {/* Empty inventory slot placeholders */}
            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-white/5 bg-black/10"
              >
                <span className="font-mono text-xs text-white/5">empty</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Selected Item Detail */}
        {selectedItem && (
          <aside className="flex w-full shrink-0 flex-col gap-5 rounded-2xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-xl md:w-96">
            {/* High-res Item Showcase */}
            <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner">
              {selectedItem.image ? (
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  fill
                  sizes="384px"
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <span className="text-6xl text-cyan-400">📦</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold tracking-wider text-white uppercase">
                  {selectedItem.name}
                </h3>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                  {selectedItem.rarity}
                </span>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                {selectedItem.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-neutral-400">
              <span>
                Category: <strong className="text-white">{selectedItem.category}</strong>
              </span>
              <span>
                Quantity: <strong className="text-cyan-300">{selectedItem.quantity}</strong>
              </span>
            </div>

            <div className="mt-auto flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleUseItem(selectedItem)}
                className="font-display flex-1 rounded-xl bg-cyan-500 py-3 text-xs font-bold tracking-widest text-slate-950 uppercase shadow-[0_0_15px_rgba(56,189,248,0.4)] transition hover:bg-cyan-400"
              >
                Use Item
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
