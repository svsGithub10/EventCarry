import { useEffect, useState } from "react";

import { generateId } from "../utils/idGenerator";
import {
  createItem,
  updateItem,
} from "../storage/eventsStorage";

const CATEGORIES = [
  "Essentials",
  "Clothing",
  "Electronics",
  "Documents",
  "Food",
  "Toiletries",
  "Medical",
  "Trekking",
  "Work",
  "Other",
];

const PRIORITIES = [
  "low",
  "medium",
  "high",
];

function createEmptyItem() {
  return {
    name: "",
    category: "Essentials",
    quantity: 1,
    notes: "",
    priority: "medium",
    buyList: false,
    purchased: false,
  };
}

export default function ItemForm({
  event,
  item = null,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(
    createEmptyItem()
  );

  const [error, setError] = useState("");

  const editing = Boolean(item);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        category:
          item.category || "Essentials",
        quantity: Math.max(
          1,
          Number(item.quantity) || 1
        ),
        notes: item.notes || "",
        priority:
          item.priority || "medium",
          buyList: Boolean(item.buyList),
          purchased: Boolean(item.purchased),
      });
    } else {
      setForm(createEmptyItem());
    }

    setError("");
  }, [item]);

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (eventObject) => {
    eventObject.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setError("Item name is required.");
      return;
    }

    const quantity = Math.max(
      1,
      Number(form.quantity) || 1
    );

    if (editing) {
      const updatedEvents =
        updateItem(
          event.id,
          item.id,
          {
            name,
            category: form.category,
            quantity,
            notes: form.notes.trim(),
            priority: form.priority,
            buyList: form.buyList,
            purchased: form.buyList
              ? form.purchased
              : false,
          }
        );

      onSaved(updatedEvents);
      return;
    }

    const newItem = {
      id: generateId(),
      name,
      category: form.category,
      quantity,
      notes: form.notes.trim(),
      priority: form.priority,
      completed: false,
      buyList: form.buyList,
      purchased: false,
      createdAt: new Date().toISOString(),
    };

    const updatedEvents =
      createItem(
        event.id,
        newItem
      );

    onSaved(updatedEvents);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="item-name"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Item name
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <input
          id="item-name"
          type="text"
          autoFocus
          value={form.name}
          onChange={(event) =>
            updateField(
              "name",
              event.target.value
            )
          }
          placeholder="e.g. Power Bank"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500"
        />

        {error && (
          <p
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="item-category"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Category
        </label>

        <select
          id="item-category"
          value={form.category}
          onChange={(event) =>
            updateField(
              "category",
              event.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label
          htmlFor="item-quantity"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Quantity
        </label>

        <input
          id="item-quantity"
          type="number"
          min="1"
          step="1"
          value={form.quantity}
          onChange={(event) =>
            updateField(
              "quantity",
              event.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Buy List */}
<div>
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Add to Buy List
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Track this item as something you need to purchase.
      </p>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={form.buyList}
      aria-label="Add item to Buy List"
      onClick={() =>
        updateField(
          "buyList",
          !form.buyList
        )
      }
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        form.buyList
          ? "bg-slate-900 dark:bg-white"
          : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          form.buyList
            ? "left-6 dark:bg-slate-900"
            : "left-1"
        }`}
      />
    </button>
  </div>
</div>

      {/* Priority */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Priority
        </label>

        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map(
            (priority) => {
              const selected =
                form.priority ===
                priority;

              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() =>
                    updateField(
                      "priority",
                      priority
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    capitalize
                    transition
                    ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }
                  `}
                >
                  {priority}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="item-notes"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Notes
        </label>

        <textarea
          id="item-notes"
          rows={3}
          value={form.notes}
          onChange={(event) =>
            updateField(
              "notes",
              event.target.value
            )
          }
          placeholder="e.g. Charge before leaving"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 dark:bg-white dark:text-slate-900"
        >
          {editing
            ? "Save Changes"
            : "Add Item"}
        </button>
      </div>
    </form>
  );
}