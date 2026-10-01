import { AnimatePresence, motion } from "motion/react";
import {
  Copy,
  Edit3,
  MoreVertical,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export default function EventActionMenu({
  completed,
  onEdit,
  onDuplicate,
  onToggleComplete,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    right: 0,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleOutsideClick = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handlePositionUpdate = () => {
      updatePosition();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    window.addEventListener(
      "scroll",
      handlePositionUpdate,
      true
    );

    window.addEventListener(
      "resize",
      handlePositionUpdate
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      window.removeEventListener(
        "scroll",
        handlePositionUpdate,
        true
      );

      window.removeEventListener(
        "resize",
        handlePositionUpdate
      );
    };
  }, [open]);

  const handleAction = (action) => {
    setOpen(false);
    action();
  };

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{
            opacity: 0,
            scale: 0.96,
            y: -4,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: -4,
          }}
          transition={{
            duration: 0.15,
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: position.top,
            right: position.right,
          }}
          className="
            z-[9999]
            w-48
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-xl
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <button
            type="button"
            onClick={() => handleAction(onEdit)}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-slate-700
              transition
              hover:bg-slate-100
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            <Edit3 size={16} />
            Edit Event
          </button>

          <button
            type="button"
            onClick={() => handleAction(onDuplicate)}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-slate-700
              transition
              hover:bg-slate-100
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            <Copy size={16} />
            Duplicate
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(onToggleComplete)
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-slate-700
              transition
              hover:bg-slate-100
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            <CheckCircle2 size={16} />

            {completed
              ? "Mark Active"
              : "Mark Complete"}
          </button>

          <div
            className="
              my-1
              border-t
              border-slate-100
              dark:border-slate-800
            "
          />

          <button
            type="button"
            onClick={() => handleAction(onDelete)}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-red-500
              transition
              hover:bg-red-50
              dark:hover:bg-red-950/30
            "
          >
            <Trash2 size={16} />
            Delete Event
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-label="Event options"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();

            if (!open) {
              updatePosition();
            }

            setOpen((value) => !value);
          }}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
            dark:hover:bg-slate-800
            dark:hover:text-slate-200
          "
        >
          <MoreVertical size={19} />
        </button>
      </div>

      {createPortal(menu, document.body)}
    </>
  );
}