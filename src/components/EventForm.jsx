import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { CalendarDays } from "lucide-react";

import { generateId } from "../utils/idGenerator";
import {
  createEvent,
  updateEvent,
} from "../storage/eventsStorage";




const ICONS = [
  "🏔️",
  "🏖️",
  "💍",
  "💼",
  "🎉",
  "✈️",
  "🏕️",
  "🎓",
  "🏠",
  "🎒",
];

const THEMES = [
  {
    id: "slate",
    label: "Slate",
    className: "bg-slate-900",
  },
  {
    id: "green",
    label: "Green",
    className: "bg-emerald-500",
  },
  {
    id: "blue",
    label: "Blue",
    className: "bg-blue-500",
  },
  {
    id: "purple",
    label: "Purple",
    className: "bg-violet-500",
  },
  {
    id: "orange",
    label: "Orange",
    className: "bg-orange-500",
  },
];

function getInitialState(event = null) {
  return {
    name: event?.name || "",
    description: event?.description || "",
    date: event?.date || "",
    icon: event?.icon || "✨",
    theme: event?.theme || "slate",
  };
}

export default function EventForm({
  events,
  event = null,
  onCreated,
  onUpdated,
  onCancel,
}) {
  const [form, setForm] = useState(
    () => getInitialState(event)
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setForm(getInitialState(event));
    setError("");
  }, [event]);

  const nameExists = useMemo(() => {
    const normalized = form.name
      .trim()
      .toLowerCase();

    if (!normalized) {
      return false;
    }

    return events.some(
      (currentEvent) =>
        currentEvent.id !== event?.id &&
        currentEvent.name.trim().toLowerCase() === normalized
    );
  }, [events, form.name, event?.id]);

  const updateField = (field, value) => {
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
    setError("Event name is required.");
    return;
  }

  if (nameExists) {
    setError(
      "An event with this name already exists."
    );
    return;
  }

  if (event) {
    const updatedEvent = updateEvent(
      event.id,
      {
        name,
        description: form.description.trim(),
        date: form.date,
        icon: form.icon,
        theme: form.theme,
      }
    );

    setForm(getInitialState(updatedEvent));
    setError("");

    onUpdated(updatedEvent);

    return;
  }

  const newEvent = {
    id: generateId(),
    name,
    description: form.description.trim(),
    date: form.date,
    icon: form.icon,
    theme: form.theme,
    createdAt: new Date().toISOString(),
    items: [],
    completed: false,
  };

  createEvent(newEvent);

  setForm(getInitialState());
  setError("");

  onCreated(newEvent);
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Event name */}
      <div>
        <label
          htmlFor="event-name"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          Event name
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <input
          id="event-name"
          type="text"
          value={form.name}
          onChange={(event) =>
            updateField(
              "name",
              event.target.value
            )
          }
          autoFocus
          placeholder="e.g. Goa trip"
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:focus:border-slate-500
          "
        />

        {error && (
          <p
            role="alert"
            className="
              mt-2
              text-sm
              text-red-500
            "
          >
            {error}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="event-description"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          Description
        </label>

        <textarea
          id="event-description"
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          rows={3}
          placeholder="What's this event about?"
          className="
            w-full
            resize-none
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:focus:border-slate-500
          "
        />
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="event-date"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          Date
        </label>

        <div className="relative">
          <CalendarDays
            size={17}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            id="event-date"
            type="date"
            value={form.date}
            onChange={(event) =>
              updateField(
                "date",
                event.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-slate-400
              focus:ring-4
              focus:ring-slate-900/5
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:focus:border-slate-500
            "
          />
        </div>
      </div>

      {/* Icon */}
      <div>
        <label
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          Icon
        </label>

        <div
          className="
            grid
            grid-cols-5
            gap-2
          "
        >
          {ICONS.map((icon) => {
            const selected =
              form.icon === icon;

            return (
              <button
                key={icon}
                type="button"
                onClick={() =>
                  updateField("icon", icon)
                }
                aria-label={`Choose ${icon}`}
                aria-pressed={selected}
                className={`
                  flex
                  h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  text-xl
                  transition
                  ${
                    selected
                      ? "border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                  }
                `}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label
          className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          Theme
        </label>

        <div className="flex flex-wrap gap-3">
          {THEMES.map((theme) => {
            const selected =
              form.theme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() =>
                  updateField(
                    "theme",
                    theme.id
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <span
                  className={`
                    h-4
                    w-4
                    rounded-full
                    ${theme.className}
                    ${
                      selected
                        ? "ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900"
                        : ""
                    }
                  `}
                />

                {theme.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-slate-200
          pt-5
          sm:flex-row
          sm:justify-end
          dark:border-slate-800
        "
      >
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-2xl
            px-5
            py-3
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-100
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            rounded-2xl
            bg-slate-900
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-slate-900/10
            transition
            hover:-translate-y-0.5
            hover:bg-slate-800
            active:translate-y-0
            dark:bg-white
            dark:text-slate-900
            dark:hover:bg-slate-100
          "
        >
          {event ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}