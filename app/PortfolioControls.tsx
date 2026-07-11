"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  localePaths,
  type PortfolioLocale,
} from "./portfolio-copy";

export type NavigationItem = {
  href: string;
  label: string;
};

type IconProps = {
  className?: string;
};

export function PrintIcon({ className = "button-icon" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 8V3.75h9V8M7.5 16.25v4h9v-4M6.25 17.25H4.5v-7.5h15v7.5h-1.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path d="M16.5 12.25h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.25" />
    </svg>
  );
}

export function ArrowUpIcon({ className = "button-icon" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="m6.75 10.25 5.25-5.25 5.25 5.25M12 5.25v13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function MenuIcon({ className = "button-icon" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 7.25h14M5 12h14M5 16.75h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon({ className = "button-icon" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="m6.75 6.75 10.5 10.5m0-10.5-10.5 10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function LanguageSwitch({
  locale,
  label,
  selectedLabel,
}: {
  locale: PortfolioLocale;
  label: string;
  selectedLabel: string;
}) {
  useEffect(() => {
    try {
      window.localStorage.setItem("oliver-portfolio-language", locale);
    } catch {
      // The local preference is optional and never identifies the visitor.
    }
  }, [locale]);

  const rememberLanguage = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    nextLocale: PortfolioLocale,
  ) => {
    try {
      window.localStorage.setItem("oliver-portfolio-language", nextLocale);
    } catch {
      // The preference is optional; route navigation must still work.
    }

    if (window.location.hash) {
      event.currentTarget.href = `${localePaths[nextLocale].home}${window.location.hash}`;
    }
  };

  return (
    <nav className="language-switch" aria-label={label}>
      <a
        className={`language-option ${locale === "zh" ? "is-selected" : ""}`}
        href={localePaths.zh.home}
        aria-current={locale === "zh" ? "page" : undefined}
        hrefLang="zh-Hant-HK"
        lang="zh-Hant-HK"
        onClick={(event) => rememberLanguage(event, "zh")}
      >
        中文
        {locale === "zh" && <span className="sr-only"> — {selectedLabel}</span>}
      </a>
      <span className="language-divider" aria-hidden="true">|</span>
      <a
        className={`language-option ${locale === "en" ? "is-selected" : ""}`}
        href={localePaths.en.home}
        aria-current={locale === "en" ? "page" : undefined}
        hrefLang="en-HK"
        lang="en-HK"
        onClick={(event) => rememberLanguage(event, "en")}
      >
        English
        {locale === "en" && <span className="sr-only"> — {selectedLabel}</span>}
      </a>
    </nav>
  );
}

export function PrintButton({
  label,
  accessibleLabel,
  className = "button secondary-button",
}: {
  label: string;
  accessibleLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={accessibleLabel}
      onClick={() => window.print()}
    >
      <PrintIcon />
      <span>{label}</span>
    </button>
  );
}

export function MobileMenu({
  items,
  menuLabel,
  closeLabel,
  activeHref,
}: {
  items: NavigationItem[];
  menuLabel: string;
  closeLabel: string;
  activeHref: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef("");
  const destinationRef = useRef<string | null>(null);

  const restorePage = () => {
    document.body.style.overflow = previousOverflowRef.current;
    setOpen(false);
    const destination = destinationRef.current;
    destinationRef.current = null;

    window.requestAnimationFrame(() => {
      if (destination) {
        const section = document.querySelector<HTMLElement>(destination);
        const heading = section?.querySelector<HTMLElement>("h2, h3");
        heading?.focus({ preventScroll: true });
        return;
      }

      triggerRef.current?.focus();
    });
  };

  const closeMenu = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
  };

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    destinationRef.current = null;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    setOpen(true);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  return (
    <div className="mobile-menu">
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="mobile-navigation"
        aria-label={menuLabel}
        onClick={openMenu}
      >
        <MenuIcon />
        <span className="mobile-menu-label">{menuLabel}</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu-dialog"
        aria-label={menuLabel}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          closeMenu();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onClose={restorePage}
      >
        <div className="mobile-menu-panel">
          <div className="mobile-menu-head">
            <span className="footer-name" lang="en-HK">Oliver YEUNG</span>
            <button
              type="button"
              className="mobile-menu-close"
              aria-label={closeLabel}
              onClick={closeMenu}
            >
              <CloseIcon />
              <span>{closeLabel}</span>
            </button>
          </div>
          <nav className="mobile-menu-nav" aria-label={menuLabel}>
            {items.map((item) => (
              <a
                className={activeHref === item.href ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={activeHref === item.href ? "location" : undefined}
                onClick={() => {
                  destinationRef.current = item.href;
                  closeMenu();
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </dialog>
    </div>
  );
}
