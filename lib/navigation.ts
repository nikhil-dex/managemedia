export function handleNavigation(
  href: string,
  currentPath: string,
  closeMenu?: () => void
) {
  closeMenu?.();

  // Same-page section
  if (href.startsWith("#")) {
    const id = href.slice(1);
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    return;
  }

  // Homepage section from another page
  if (href.startsWith("/#")) {
    const id = href.slice(2);

    if (currentPath === "/") {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    window.location.href = href;
    return;
  }

  // Normal page navigation
  window.location.href = href;
}