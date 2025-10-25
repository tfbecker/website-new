'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PopoverPosition = {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
  maxWidth: number;
};

export function FootnotePopovers() {
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hidePopoverTimeoutRef = useRef<number | null>(null);
  const hidePopoverRef = useRef<() => void>(() => {});
  const cancelHidePopoverRef = useRef<() => void>(() => {});
  const portalContainerRef = useRef<HTMLDivElement | null>(null);
  const activeAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const popoverContentRef = useRef<string>('');

  // Wait for DOM to be ready
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const container = document.createElement('div');
    container.setAttribute('data-footnote-popover-root', 'true');
    document.body.appendChild(container);
    portalContainerRef.current = container;

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      portalContainerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const HIDE_DELAY = 280;

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const computePopoverPosition = (target: HTMLElement): PopoverPosition => {
      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
      const viewportWidth = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const margin = 12;
      const estimatedHeight = 220;
      const maxWidth = Math.min(360, viewportWidth - margin * 2);
      const halfWidth = maxWidth / 2;
      const naturalLeft = rect.left + scrollX + rect.width / 2;
      const left = Math.min(
        scrollX + viewportWidth - margin - halfWidth,
        Math.max(scrollX + margin + halfWidth, naturalLeft)
      );
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      let placement: 'top' | 'bottom' = 'bottom';
      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        placement = 'top';
      }
      let top =
        placement === 'bottom'
          ? rect.bottom + scrollY + margin
          : rect.top + scrollY - margin;
      const minY = scrollY + margin;
      const maxY = scrollY + viewportHeight - margin;
      top = Math.min(Math.max(top, minY), maxY);
      return {
        top,
        left,
        placement,
        maxWidth,
      };
    };

    const cancelHidePopover = () => {
      if (hidePopoverTimeoutRef.current !== null) {
        window.clearTimeout(hidePopoverTimeoutRef.current);
        hidePopoverTimeoutRef.current = null;
      }
    };

    cancelHidePopoverRef.current = cancelHidePopover;

    let lastClickedLink: HTMLAnchorElement | null = null;

    const hidePopover = () => {
      cancelHidePopover();
      hidePopoverTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setPopoverPosition(null);
        setPopoverContent('');
        popoverContentRef.current = '';
        activeAnchorRef.current = null;
        hidePopoverTimeoutRef.current = null;
        lastClickedLink = null;
      }, HIDE_DELAY);
    };

    hidePopoverRef.current = hidePopover;

    const showPopover = (target: HTMLAnchorElement, content: string) => {
      if (!content) {
        hidePopover();
        return;
      }

      cancelHidePopover();
      activeAnchorRef.current = target;
      popoverContentRef.current = content;
      setPopoverContent(content);
      setPopoverPosition(computePopoverPosition(target));
      setIsVisible(true);
    };

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes footnote-pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0.3);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }
      }

      .prose a[data-footnote-ref] {
        display: inline-block;
        font-weight: 700;
        color: white !important;
        background-color: #3b82f6;
        text-decoration: none;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75em;
        line-height: 1.5;
        vertical-align: super;
        transition: all 0.2s ease;
        animation: footnote-pulse 2.5s ease-in-out infinite;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      }

      .prose a[data-footnote-ref]:hover {
        background-color: #2563eb;
        animation: none;
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
      }

      .prose sup {
        line-height: 0;
      }

      .prose sup a[data-footnote-ref] {
        vertical-align: baseline;
      }

      .prose a[data-popover-link]:not([data-footnote-ref]) {
        position: relative;
        transition: color 0.2s ease;
      }

      .prose a[data-popover-link]:not([data-footnote-ref]):hover {
        color: #2563eb;
      }

      .prose a[data-popover-link]:not([data-footnote-ref])::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.15em;
        width: 100%;
        height: 2px;
        background: rgba(37, 99, 235, 0.35);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.2s ease;
      }

      .prose a[data-popover-link]:not([data-footnote-ref]):hover::after {
        transform: scaleX(1);
      }

      .footnote-popover {
        animation: popover-fade-in 0.2s ease-out;
      }

      @keyframes popover-fade-in {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      .footnote-popover a {
        color: #3b82f6;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);

    const allLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.prose a[href]'));
    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) {
        return;
      }
      try {
        const url = new URL(href, window.location.origin);
        const isExternal = url.origin !== window.location.origin;
        if (isExternal) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch {
        // Ignore invalid URLs (mailto:, etc.)
      }
    });

    const footnoteRefs = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.prose a[data-footnote-ref]')
    );
    const generalLinks = allLinks.filter(
      (link) => !link.hasAttribute('data-footnote-ref') && !link.hasAttribute('data-footnote-backref')
    );

    footnoteRefs.forEach((ref) => ref.setAttribute('data-popover-link', 'true'));
    generalLinks.forEach((link) => link.setAttribute('data-popover-link', 'true'));

    const footnoteDefsMap = new Map<string, string>();
    document.querySelectorAll('.prose li[id^="fn"], .prose li[id^="user-content-fn"]').forEach((li) => {
      const id = li.id;
      const clone = li.cloneNode(true) as HTMLLIElement;
      clone.querySelectorAll('a[data-footnote-backref], a[href*="#fnref"]').forEach((backref) =>
        backref.remove()
      );
      footnoteDefsMap.set(id, clone.innerHTML.trim());
    });

    const buildLinkPopoverContent = (link: HTMLAnchorElement) => {
      const href = link.getAttribute('href');
      if (!href) {
        return '';
      }

      let url: URL | null = null;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        // Ignore relative or malformed URLs that cannot be parsed
      }

      const tooltip = link.getAttribute('data-tooltip');
      const linkText = link.textContent?.trim();
      const isExternal = !!url && url.origin !== window.location.origin;
      const pathDetail = url ? `${url.pathname}${url.search}${url.hash}` : '';
      const destination = url
        ? isExternal
          ? `${url.hostname}${pathDetail}`
          : pathDetail || '/'
        : href;

      const paragraphs: string[] = [];
      if (tooltip) {
        paragraphs.push(escapeHtml(tooltip));
      } else if (linkText) {
        paragraphs.push(`Opens the link "${escapeHtml(linkText)}".`);
      } else {
        paragraphs.push('Opens this link.');
      }

      if (destination) {
        paragraphs.push(`Destination: ${escapeHtml(destination)}.`);
      }

      const actionHref = url ? url.href : href;
      const actionLabel = isExternal ? 'Open in new tab' : 'Open link';
      const targetAttr = isExternal ? ' target="_blank"' : '';
      const relAttr = isExternal ? ' rel="noopener noreferrer"' : '';

      const descriptionHtml = paragraphs
        .map((paragraph) => `<p class="text-sm leading-snug">${paragraph}</p>`)
        .join('');

      return `
        <div class="space-y-3">
          ${descriptionHtml}
          <a class="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline" href="${escapeHtml(
            actionHref
          )}"${targetAttr}${relAttr}>${actionLabel} &rarr;</a>
        </div>
      `.trim();
    };

    const buildFootnotePopoverContent = (footnoteId: string, footnoteHtml: string) => {
      const destinationHref = `#${footnoteId}`;
      return `
        <div class="space-y-4">
          <div class="prose prose-sm max-w-none">
            ${footnoteHtml}
          </div>
          <a class="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline" href="${escapeHtml(
            destinationHref
          )}">Jump to footnote ↧</a>
        </div>
      `.trim();
    };

    const showFootnote = (target: HTMLAnchorElement) => {
      const href = target.getAttribute('href');
      if (!href) {
        hidePopover();
        return;
      }
      const footnoteId = href.substring(1);
      const content = footnoteDefsMap.get(footnoteId);
      if (content) {
        showPopover(target, buildFootnotePopoverContent(footnoteId, content));
      } else {
        hidePopover();
      }
    };

    const showLink = (target: HTMLAnchorElement) => {
      const content = buildLinkPopoverContent(target);
      showPopover(target, content);
    };

    const handleFootnoteMouseEnter = (event: MouseEvent) => {
      showFootnote(event.currentTarget as HTMLAnchorElement);
    };

    const handleFootnoteFocus = (event: FocusEvent) => {
      showFootnote(event.currentTarget as HTMLAnchorElement);
    };

    const handleAnchorMouseLeave = () => {
      hidePopover();
    };

    const handleAnchorBlur = () => {
      hidePopover();
    };

    const handleFootnoteClick = (event: MouseEvent) => {
      event.preventDefault();
      showFootnote(event.currentTarget as HTMLAnchorElement);
    };

    const handleLinkMouseEnter = (event: MouseEvent) => {
      showLink(event.currentTarget as HTMLAnchorElement);
    };

    const handleLinkFocus = (event: FocusEvent) => {
      showLink(event.currentTarget as HTMLAnchorElement);
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
        lastClickedLink = null;
        hidePopover();
        return;
      }

      if (lastClickedLink !== target) {
        event.preventDefault();
        lastClickedLink = target;
        showLink(target);
      } else {
        lastClickedLink = null;
        hidePopover();
      }
    };

    footnoteRefs.forEach((ref) => {
      ref.addEventListener('mouseenter', handleFootnoteMouseEnter);
      ref.addEventListener('mouseleave', handleAnchorMouseLeave);
      ref.addEventListener('focus', handleFootnoteFocus);
      ref.addEventListener('blur', handleAnchorBlur);
      ref.addEventListener('click', handleFootnoteClick);
    });

    generalLinks.forEach((link) => {
      link.addEventListener('mouseenter', handleLinkMouseEnter);
      link.addEventListener('mouseleave', handleAnchorMouseLeave);
      link.addEventListener('focus', handleLinkFocus);
      link.addEventListener('blur', handleAnchorBlur);
      link.addEventListener('click', handleLinkClick);
    });

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-popover-link="true"]') && !target.closest('.footnote-popover')) {
        lastClickedLink = null;
        hidePopover();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        lastClickedLink = null;
        hidePopover();
      }
    };

    const updateActivePopoverPosition = () => {
      if (!activeAnchorRef.current || !popoverContentRef.current) {
        return;
      }
      if (!document.body.contains(activeAnchorRef.current)) {
        hidePopover();
        return;
      }
      setPopoverPosition(computePopoverPosition(activeAnchorRef.current));
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', updateActivePopoverPosition, true);
    window.addEventListener('resize', updateActivePopoverPosition);
    window.addEventListener('orientationchange', updateActivePopoverPosition);

    return () => {
      cancelHidePopover();
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      footnoteRefs.forEach((ref) => {
        ref.removeEventListener('mouseenter', handleFootnoteMouseEnter);
        ref.removeEventListener('mouseleave', handleAnchorMouseLeave);
        ref.removeEventListener('focus', handleFootnoteFocus);
        ref.removeEventListener('blur', handleAnchorBlur);
        ref.removeEventListener('click', handleFootnoteClick);
        ref.removeAttribute('data-popover-link');
      });
      generalLinks.forEach((link) => {
        link.removeEventListener('mouseenter', handleLinkMouseEnter);
        link.removeEventListener('mouseleave', handleAnchorMouseLeave);
        link.removeEventListener('focus', handleLinkFocus);
        link.removeEventListener('blur', handleAnchorBlur);
        link.removeEventListener('click', handleLinkClick);
        link.removeAttribute('data-popover-link');
      });
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', updateActivePopoverPosition, true);
      window.removeEventListener('resize', updateActivePopoverPosition);
      window.removeEventListener('orientationchange', updateActivePopoverPosition);
      lastClickedLink = null;
    };
  }, [isMounted]);

  if (!popoverPosition || !isVisible || !portalContainerRef.current) return null;

  return createPortal(
    <div
      className="footnote-popover pointer-events-auto z-50 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl text-sm leading-relaxed"
      style={{
        position: 'absolute',
        top: popoverPosition.top,
        left: popoverPosition.left,
        maxWidth: popoverPosition.maxWidth,
        transform:
          popoverPosition.placement === 'top'
            ? 'translate(-50%, -100%)'
            : 'translate(-50%, 0)',
      }}
      onPointerEnter={() => {
        cancelHidePopoverRef.current();
        setIsVisible(true);
      }}
      onPointerLeave={() => {
        hidePopoverRef.current();
      }}
      dangerouslySetInnerHTML={{ __html: popoverContent }}
    />,
    portalContainerRef.current
  );
}
