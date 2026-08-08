export function getSceneElement(
  selector: string
): HTMLElement | null {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    return null;
  }

  return element;
}