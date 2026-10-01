import EventCard from "./EventCard";

export default function EventGrid({
  events,
  onOpen,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleComplete,
}) {
  if (!events.length) {
    return null;
  }

  return (
    <div
  className="
    grid
    grid-cols-1
    gap-4
    sm:grid-cols-2
    xl:grid-cols-3
    relative
    z-0
  "
>
      {events.map((event, index) => (
  <div
    key={event.id}
    className="relative z-0"
  >
    <EventCard
      event={event}
      onOpen={() => onOpen(event.id)}
      onEdit={() => onEdit(event)}
      onDelete={() => onDelete(event)}
      onDuplicate={() =>
        onDuplicate(event)
      }
      onToggleComplete={() =>
        onToggleComplete(event)
      }
    />
  </div>
))}
    </div>
  );
}