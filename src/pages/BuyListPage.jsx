import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import { useEvents } from "../hooks/useEvents";
import { updateItem } from "../storage/eventsStorage";

function formatDate(date) {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function BuyListPage() {
  const navigate = useNavigate();

  const {
    events,
    setEvents,
  } = useEvents();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const buyListGroups = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return events
      .map((event) => {
        const items = (event.items || []).filter(
          (item) => {
            if (item.buyList !== true) {
              return false;
            }

            if (
              filter === "pending" &&
              item.purchased
            ) {
              return false;
            }

            if (
              filter === "purchased" &&
              !item.purchased
            ) {
              return false;
            }

            if (!normalizedSearch) {
              return true;
            }

            const itemName =
              item.name?.toLowerCase() || "";

            const category =
              item.category?.toLowerCase() || "";

            const eventName =
              event.name?.toLowerCase() || "";

            return (
              itemName.includes(
                normalizedSearch
              ) ||
              category.includes(
                normalizedSearch
              ) ||
              eventName.includes(
                normalizedSearch
              )
            );
          }
        );

        return {
          event,
          items,
        };
      })
      .filter(
        (group) => group.items.length > 0
      );
  }, [events, search, filter]);

  const allBuyListItems = useMemo(() => {
    return events.flatMap((event) =>
      (event.items || []).filter(
        (item) => item.buyList === true
      )
    );
  }, [events]);

  const totalItems =
    allBuyListItems.length;

  const purchasedItems =
    allBuyListItems.filter(
      (item) => item.purchased
    ).length;

  const totalQuantity =
    allBuyListItems.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 1),
      0
    );

  const pendingItems =
    totalItems - purchasedItems;

  const purchaseProgress =
    totalItems === 0
      ? 0
      : Math.round(
          (purchasedItems /
            totalItems) *
            100
        );

  const handleTogglePurchased = (
    eventId,
    item
  ) => {
    const updatedEvents = updateItem(
      eventId,
      item.id,
      {
        purchased: !item.purchased,
      }
    );

    setEvents(updatedEvents);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">

        {/* Header */}
        <header>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Events
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
                  <ShoppingCart size={22} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Buy List
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Items you need to purchase for your events.
                  </p>
                </div>
              </div>
            </div>

            {totalItems > 0 && (
              <div className="hidden shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-900 sm:block">
                <p className="text-xs font-medium text-slate-400">
                  Progress
                </p>

                <p className="mt-1 text-lg font-bold">
                  {purchaseProgress}%
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Empty State */}
        {totalItems === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <ShoppingCart size={28} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Your Buy List is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              When you add an item to an event, turn on{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Add to Buy List
              </span>{" "}
              and it will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              View Events
            </button>
          </div>
        ) : (
          <main className="mt-8">

            {/* Summary */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">
                  Items
                </p>

                <p className="mt-1 text-xl font-bold">
                  {totalItems}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">
                  Pending
                </p>

                <p className="mt-1 text-xl font-bold">
                  {pendingItems}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">
                  Purchased
                </p>

                <p className="mt-1 text-xl font-bold">
                  {purchasedItems}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">
                  Total Qty
                </p>

                <p className="mt-1 text-xl font-bold">
                  {totalQuantity}
                </p>
              </div>
            </section>

            {/* Progress */}
            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  Purchase progress
                </span>

                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {purchasedItems} /{" "}
                  {totalItems}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-500 dark:bg-white"
                  style={{
                    width: `${purchaseProgress}%`,
                  }}
                />
              </div>
            </section>

            {/* Search */}
            <section className="mt-5">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search items, categories or events..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </section>

            {/* Filters */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {[
                {
                  id: "all",
                  label: "All",
                },
                {
                  id: "pending",
                  label: "Pending",
                },
                {
                  id: "purchased",
                  label: "Purchased",
                },
              ].map((option) => {
                const active =
                  filter === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setFilter(option.id)
                    }
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* No Filter Results */}
            {buyListGroups.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="text-3xl">
                  🔎
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  No matching items
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try another search or filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Event Groups */
              <div className="mt-6 space-y-5">
                {buyListGroups.map(
                  ({ event, items }) => {
                    const purchasedCount =
                      items.filter(
                        (item) =>
                          item.purchased
                      ).length;

                    return (
                      <section
                        key={event.id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                      >
                        {/* Event Header */}
                        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                              {event.icon ||
                                "✨"}
                            </div>

                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/event/${event.id}`
                                  )
                                }
                                className="text-left text-base font-semibold transition hover:text-slate-500 dark:hover:text-slate-300"
                              >
                                {event.name}
                              </button>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                                <span>
                                  {formatDate(
                                    event.date
                                  )}
                                </span>

                                <span>
                                  {
                                    purchasedCount
                                  }{" "}
                                  /{" "}
                                  {
                                    items.length
                                  }{" "}
                                  purchased
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {items.map(
                            (item) => (
                              <div
                                key={item.id}
                                className={`flex items-center gap-3 px-5 py-4 transition sm:px-6 ${
                                  item.purchased
                                    ? "bg-slate-50/70 dark:bg-slate-950/30"
                                    : ""
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTogglePurchased(
                                      event.id,
                                      item
                                    )
                                  }
                                  aria-label={
                                    item.purchased
                                      ? `Mark ${item.name} as not purchased`
                                      : `Mark ${item.name} as purchased`
                                  }
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                                    item.purchased
                                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                                      : "border-slate-300 bg-white hover:border-slate-500 dark:border-slate-600 dark:bg-slate-900"
                                  }`}
                                >
                                  {item.purchased && (
                                    <Check
                                      size={15}
                                    />
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-sm font-medium transition ${
                                      item.purchased
                                        ? "text-slate-400 line-through"
                                        : "text-slate-800 dark:text-slate-100"
                                    }`}
                                  >
                                    {item.name}
                                  </p>

                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                    <span>
                                      Qty:{" "}
                                      {item.quantity ||
                                        1}
                                    </span>

                                    {item.category && (
                                      <>
                                        <span>
                                          •
                                        </span>

                                        <span>
                                          {
                                            item.category
                                          }
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/event/${event.id}`
                                    )
                                  }
                                  className="hidden shrink-0 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:block dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                >
                                  View
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    );
                  }
                )}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}