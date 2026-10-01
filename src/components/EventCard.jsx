import { motion } from "motion/react";

import {
  CalendarDays,
  Check,
} from "lucide-react";

import EventActionMenu from "./EventActionMenu";

function formatDate(date) {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function EventCard({
  event,
  onOpen,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleComplete,
}) {
  const items = event.items || [];

  const completed = items.filter(
    (item) => item.completed
  ).length;

  const total = items.length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const remaining = total - completed;
  const isEventComplete =
  event.completed || progress === 100;

  return (
    <motion.article
  layout
  initial={{
    opacity: 0,
    y: 16,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  whileHover={{
    y: -4,
  }}
  whileTap={{
    scale: 0.99,
  }}
  transition={{
    duration: 0.2,
  }}
  onClick={onOpen}
  className="
    group
    relative
    z-10
    cursor-pointer
    overflow-visible
    rounded-3xl
    border
    border-slate-200/80
    bg-white
    p-5
    shadow-sm
    transition-shadow
    hover:shadow-xl
    dark:border-slate-800
    dark:bg-slate-900
  "
>
      {/* Decorative glow */}
<div
  className="
    pointer-events-none
    absolute
    right-0
    top-0
    h-32
    w-32
    overflow-hidden
    rounded-3xl
  "
>
  <div
    className="
      absolute
      -right-12
      -top-12
      h-32
      w-32
      rounded-full
      bg-slate-100
      blur-2xl
      transition-all
      group-hover:bg-slate-200
      dark:bg-slate-800
      dark:group-hover:bg-slate-700
    "
  />
</div>

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-2xl
              dark:bg-slate-800
            "
          >
            {event.icon || "✨"}
          </div>

          <div className="min-w-0">
            <h3
              className="
                truncate
                text-base
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {event.name}
            </h3>

            {event.description && (
              <p
                className="
                  mt-0.5
                  truncate
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {event.description}
              </p>
            )}
          </div>
        </div>

<EventActionMenu
  completed={event.completed}
  onEdit={onEdit}
  onDuplicate={onDuplicate}
  onToggleComplete={onToggleComplete}
  onDelete={onDelete}
/>
      </div>

      {/* Date */}
      <div
        className="
          relative
          mt-5
          flex
          items-center
          gap-2
          text-sm
          text-slate-500
          dark:text-slate-400
        "
      >
        <CalendarDays size={15} />

        <span>
          {formatDate(event.date)}
        </span>
      </div>

      {/* Progress */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              {completed} / {total}
            </span>

            <span
              className="
                text-sm
                text-slate-400
              "
            >
              items
            </span>
          </div>

          <span
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            {progress}%
          </span>
        </div>

        <div
          className="
            mt-3
            h-2
            overflow-hidden
            rounded-full
            bg-slate-100
            dark:bg-slate-800
          "
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="
              h-full
              rounded-full
              bg-slate-900
              dark:bg-white
            "
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          relative
          mt-5
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-2">
          {isEventComplete ? (
            <>
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-100
                  text-emerald-600
                  dark:bg-emerald-950
                  dark:text-emerald-400
                "
              >
                <Check size={14} strokeWidth={2.5} />
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                All packed
              </span>
            </>
          ) : (
            <span
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {event.completed
  ? "Event completed"
  : `${remaining} ${
      remaining === 1
        ? "item"
        : "items"
    } remaining`}
            </span>
          )}
        </div>

        <span
          className="
            text-xs
            font-medium
            text-slate-400
            transition
            group-hover:text-slate-700
            dark:group-hover:text-slate-200
          "
        >
          Open →
        </span>
      </div>
    </motion.article>
  );
}