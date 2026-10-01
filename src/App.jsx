import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useEvents } from "./hooks/useEvents";

import EventGrid from "./components/EventGrid";
import EmptyState from "./components/EmptyState";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";
import ProgressBar from "./components/ProgressBar";
import ItemList from "./components/ItemList";
import ItemForm from "./components/ItemForm";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";
import { generateId } from "./utils/idGenerator";
import BuyListPage from "./pages/BuyListPage";

import {
  createEvent,
  updateEvent,
  deleteEvent,
  createItem,
  updateItem,
  deleteItem,
} from "./storage/eventsStorage";


function EventsPage() {
  const navigate = useNavigate();

  const {
    events,
    setEvents,
  } = useEvents();

  const [
    showAddEvent,
    setShowAddEvent,
  ] = useState(false);

  const [
    showEditEvent,
    setShowEditEvent,
  ] = useState(false);

  const [
    editingEvent,
    setEditingEvent,
  ] = useState(null);

  const [
    deleteEventTarget,
    setDeleteEventTarget,
  ] = useState(null);

  const [
    toast,
    setToast,
  ] = useState("");

  const handleOpenEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleCreateEvent = () => {
    setShowAddEvent(true);
  };

  const handleEventCreated = (newEvent) => {
    setEvents([
      ...events,
      newEvent,
    ]);

    setShowAddEvent(false);

    navigate(`/event/${newEvent.id}`);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditEvent(true);
  };

  const handleEventUpdated = (updatedEvent) => {
    const updatedEvents = events.map(
      (currentEvent) =>
        currentEvent.id === updatedEvent.id
          ? updatedEvent
          : currentEvent
    );

    setEvents(updatedEvents);

    setShowEditEvent(false);
    setEditingEvent(null);

    setToast("Event updated");
  };

  const handleDeleteEvent = (event) => {
    setDeleteEventTarget(event);
  };

  const handleDeleteEventConfirm = () => {
    if (!deleteEventTarget) {
      return;
    }

    const updatedEvents = deleteEvent(
      deleteEventTarget.id
    );

    setEvents(updatedEvents);

    setDeleteEventTarget(null);

    setToast("Event deleted");
  };

  const handleDuplicateEvent = (event) => {
    const duplicatedEvent = {
      ...event,

      id: generateId(),

      name: `${event.name} Copy`,

      createdAt:
        new Date().toISOString(),

      completed: false,

      items: (event.items || []).map(
        (item) => ({
          ...item,
          id: generateId(),
          completed: false,
        })
      ),
    };

    createEvent(duplicatedEvent);

    setEvents([
      ...events,
      duplicatedEvent,
    ]);

    setToast("Event duplicated");
  };

  const handleToggleEventComplete = (event) => {
    const updatedEvent = updateEvent(
      event.id,
      {
        completed:
          !event.completed,
      }
    );

    setEvents(
      events.map((currentEvent) =>
        currentEvent.id === event.id
          ? updatedEvent
          : currentEvent
      )
    );

    setToast(
      event.completed
        ? "Event marked active"
        : "Event completed"
    );
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () =>
      clearTimeout(timer);
  }, [toast]);

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">

              {/* App Logo */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-white
                  shadow-sm
                  ring-1
                  ring-slate-200
                  dark:bg-slate-900
                  dark:ring-slate-800
                "
              >
                <img
                  src="/eventcarry-icon.png"
                  alt="EventCarry"
                  className="h-full w-full object-cover"
                />
              </div>

              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                "
              >
                EventCarry
              </h1>
            </div>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Everything you need, ready when you are.
            </p>
          </div>

<div className="flex flex-col gap-2 sm:flex-row">
  <button
    type="button"
    onClick={() => navigate("/buy-list")}
    className="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-2xl
      border
      border-slate-200
      bg-white
      px-5
      py-3
      text-sm
      font-semibold
      text-slate-700
      shadow-sm
      transition
      hover:-translate-y-0.5
      hover:bg-slate-50
      dark:border-slate-800
      dark:bg-slate-900
      dark:text-slate-200
      dark:hover:bg-slate-800
    "
  >
    🛒
    Buy List
  </button>

  <button
    type="button"
    onClick={handleCreateEvent}
    className="
      inline-flex
      items-center
      justify-center
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
    <Plus
      size={17}
      className="mr-2"
    />

    Add Event
  </button>
</div>
        </header>

        {/* =================================================
            EVENTS SECTION
        ================================================= */}

        <main className="mt-10">

          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                Your workspace
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                Your Events
              </h2>
            </div>

            {events.length > 0 && (
              <span
                className="
                  shrink-0
                  rounded-full
                  bg-slate-100
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-slate-500
                  dark:bg-slate-900
                  dark:text-slate-400
                "
              >
                {events.length}{" "}
                {events.length === 1
                  ? "event"
                  : "events"}
              </span>
            )}
          </div>

          {/* Event Grid / Empty State */}

          {events.length === 0 ? (
            <EmptyState
              onCreate={handleCreateEvent}
            />
          ) : (
            <EventGrid
              events={events}
              onOpen={handleOpenEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onDuplicate={
                handleDuplicateEvent
              }
              onToggleComplete={
                handleToggleEventComplete
              }
            />
          )}

        </main>
      </div>

      {/* =================================================
          CREATE EVENT MODAL
      ================================================= */}

      <Modal
        open={showAddEvent}
        onClose={() =>
          setShowAddEvent(false)
        }
        title="Create Event"
      >
        <EventForm
          events={events}
          onCreated={
            handleEventCreated
          }
          onCancel={() =>
            setShowAddEvent(false)
          }
        />
      </Modal>

      {/* =================================================
          EDIT EVENT MODAL
      ================================================= */}

      <Modal
        open={showEditEvent}
        onClose={() => {
          setShowEditEvent(false);
          setEditingEvent(null);
        }}
        title="Edit Event"
      >
        <EventForm
          events={events}
          event={editingEvent}
          onUpdated={
            handleEventUpdated
          }
          onCancel={() => {
            setShowEditEvent(false);
            setEditingEvent(null);
          }}
        />
      </Modal>

      {/* =================================================
          DELETE EVENT CONFIRMATION
      ================================================= */}

      <ConfirmDialog
        open={Boolean(
          deleteEventTarget
        )}
        title="Delete event?"
        description={
          deleteEventTarget
            ? `"${deleteEventTarget.name}" and all its items will be permanently deleted.`
            : ""
        }
        onCancel={() =>
          setDeleteEventTarget(null)
        }
        onConfirm={
          handleDeleteEventConfirm
        }
      />

      {/* =================================================
          EVENT TOAST
      ================================================= */}

      <Toast
        message={toast}
        onClose={() =>
          setToast("")
        }
      />
    </div>
  );
}


/* =====================================================
   EVENT DETAIL PAGE
===================================================== */

function EventDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    events,
    setEvents,
  } = useEvents();

  const [eventData, setEventData] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [showItemForm, setShowItemForm] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [
    quickItem,
    setQuickItem,
  ] = useState("");

  useEffect(() => {
    const foundEvent = events.find(
      (event) => event.id === id
    );

    setEventData(
      foundEvent || null
    );
  }, [events, id]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () =>
      clearTimeout(timer);
  }, [toast]);

  const items =
    eventData?.items || [];

  const completedItems =
    items.filter(
      (item) => item.completed
    ).length;

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        items
          .map(
            (item) => item.category
          )
          .filter(Boolean)
      ),
    ];

    return ["All", ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name
          .toLowerCase()
          .includes(
            normalizedSearch
          );

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    items,
    search,
    category,
  ]);

  const handleToggleItem = (
    itemId
  ) => {
    if (!eventData) {
      return;
    }

    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId
    );

    if (!item) {
      return;
    }

    const updatedEvents =
      updateItem(
        eventData.id,
        itemId,
        {
          completed:
            !item.completed,
        }
      );

    setEvents(updatedEvents);

    setToast(
      item.completed
        ? "Item marked incomplete"
        : "Item completed"
    );
  };

  const handleItemSaved = (
    updatedEvents
  ) => {
    setEvents(updatedEvents);

    setShowItemForm(false);
    setEditingItem(null);

    setToast(
      editingItem
        ? "Item updated"
        : "Item added"
    );
  };

  const handleEditItem = (
    item
  ) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (item) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = () => {
    if (
      !eventData ||
      !deleteTarget
    ) {
      return;
    }

    const updatedEvents =
      deleteItem(
        eventData.id,
        deleteTarget.id
      );

    setEvents(updatedEvents);

    setDeleteTarget(null);

    setToast("Item deleted");
  };

  const handleQuickAdd = (
    eventObject
  ) => {
    eventObject.preventDefault();

    const name =
      quickItem.trim();

    if (!name || !eventData) {
      return;
    }

    const newItem = {
      id: generateId(),
      name,
      category: "Essentials",
      quantity: 1,
      notes: "",
      priority: "medium",
      completed: false,
      createdAt:
        new Date().toISOString(),
    };

    const updatedEvents =
      createItem(
        eventData.id,
        newItem
      );

    setEvents(updatedEvents);

    setQuickItem("");

    setToast("Item added");
  };

  if (!eventData) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft
              size={17}
            />
            Back to Events
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-4xl">
              🔍
            </div>

            <h1 className="mt-4 text-xl font-semibold">
              Event not found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This event may have been
              deleted or the link is
              invalid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="mb-7 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <ArrowLeft
            size={17}
          />
          Events
        </button>

        {/* Header */}
        <header>
 <div className="flex items-start gap-4">
  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
    {eventData.icon || "✨"}
  </div>

  <div className="min-w-0 flex-1">
    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
      {eventData.name}
    </h1>

    {eventData.description && (
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {eventData.description}
      </p>
    )}

    {eventData.date && (
      <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
        {new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(
          new Date(`${eventData.date}T00:00:00`)
        )}
      </p>
    )}
  </div>

  <button
    type="button"
    onClick={() => navigate("/buy-list")}
    className="
      hidden
      shrink-0
      items-center
      gap-2
      rounded-2xl
      border
      border-slate-200
      bg-white
      px-4
      py-2.5
      text-sm
      font-semibold
      text-slate-700
      shadow-sm
      transition
      hover:-translate-y-0.5
      hover:bg-slate-50
      sm:inline-flex
      dark:border-slate-800
      dark:bg-slate-900
      dark:text-slate-200
      dark:hover:bg-slate-800
    "
  >
    🛒
    Buy List
  </button>
</div>

          {/* Progress */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <ProgressBar
              completed={
                completedItems
              }
              total={items.length}
            />
          </div>
        </header>

        {/* Toolbar */}
        <div className="mt-8">

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search items..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowItemForm(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Plus
                size={17}
              />
              Add Item
            </button>
          </div>

          {/* Categories */}
          {categories.length >
            1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map(
                (
                  currentCategory
                ) => {
                  const active =
                    category ===
                    currentCategory;

                  return (
                    <button
                      key={
                        currentCategory
                      }
                      type="button"
                      onClick={() =>
                        setCategory(
                          currentCategory
                        )
                      }
                      className={`
                        shrink-0
                        rounded-xl
                        px-3
                        py-2
                        text-xs
                        font-medium
                        transition
                        ${
                          active
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400"
                        }
                      `}
                    >
                      {
                        currentCategory
                      }
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Checklist */}
        <section className="mt-5">

          {items.length ===
          0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="text-3xl">
                📝
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                Nothing on your list yet
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Add your first item
                to get started.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowItemForm(
                    true
                  )
                }
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                <Plus
                  size={17}
                />
                Add Item
              </button>
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="text-3xl">
                🔎
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No matching items
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try another search
                or category.
              </p>
            </div>
          ) : (
            <ItemList
              items={filteredItems}
              onToggle={handleToggleItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}

        </section>

        {/* Quick Add */}
        {items.length >
          0 && (
          <form
            onSubmit={
              handleQuickAdd
            }
            className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-transparent px-4 py-3 transition focus-within:border-slate-400 dark:border-slate-700"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
              <Plus size={16} />
            </span>

            <input
              type="text"
              value={quickItem}
              onChange={(
                event
              ) =>
                setQuickItem(
                  event.target
                    .value
                )
              }
              placeholder="Add an item..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItem(null);
        }}
        title={
          editingItem
            ? "Edit Item"
            : "Add Item"
        }
      >
        <ItemForm
          event={eventData}
          item={editingItem}
          onSaved={
            handleItemSaved
          }
          onCancel={() => {
            setShowItemForm(
              false
            );
            setEditingItem(
              null
            );
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(
          deleteTarget
        )}
        title="Delete item?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed from this event.`
            : ""
        }
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={
          handleDeleteConfirm
        }
      />

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() =>
          setToast("")
        }
      />
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route
    path="/"
    element={<EventsPage />}
  />

  <Route
    path="/buy-list"
    element={<BuyListPage />}
  />

  <Route
    path="/event/:id"
    element={<EventDetailPage />}
  />
</Routes>
    </BrowserRouter>
  );
}