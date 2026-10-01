import { AnimatePresence } from "motion/react";

import ItemCard from "./ItemCard";

export default function ItemList({
  items,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}