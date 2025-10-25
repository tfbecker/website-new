'use client';

import { useEffect, useState } from 'react';

export function FootnotePopovers() {
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for DOM to be ready
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Set external links to open in new tab
    const allLinks = document.querySelectorAll('.prose a[href^="http"]');
    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('becker.so') && !href.includes('localhost')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Add CSS for footnote and link tooltip animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes footnote-pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
        }
      }

      .prose a[href^="#fn"] {
        display: inline-block;
        font-weight: 700;
        color: #3b82f6;
        text-decoration: none;
        padding: 2px 4px;
        border-radius: 3px;
        transition: all 0.2s ease;
        animation: footnote-pulse 2s ease-in-out infinite;
        cursor: pointer;
      }

      .prose a[href^="#fn"]:hover {
        background-color: #dbeafe;
        animation: none;
        transform: scale(1.05);
      }

      .prose a[data-tooltip] {
        position: relative;
        text-decoration: underline;
        text-decoration-style: dotted;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
        cursor: help;
        transition: all 0.2s ease;
      }

      .prose a[data-tooltip]:hover {
        text-decoration-style: solid;
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

    // Find all footnote references and definitions
    const footnoteRefs = document.querySelectorAll('a[href^="#fn"]');
    const footnoteDefsMap = new Map<string, string>();

    // Build a map of footnote IDs to their content
    document.querySelectorAll('li[id^="fn"]').forEach((li) => {
      const id = li.id;
      const clone = li.cloneNode(true) as HTMLLIElement;
      // Remove the backref link (the ↩ link)
      const backref = clone.querySelector('a[href^="#fnref"]');
      if (backref) backref.remove();
      footnoteDefsMap.set(id, clone.innerHTML.trim());
    });

    const showPopover = (target: HTMLAnchorElement, footnoteId: string) => {
      const content = footnoteDefsMap.get(footnoteId);
      if (content) {
        const rect = target.getBoundingClientRect();
        const left = rect.left + rect.width / 2 + window.scrollX;
        const top = rect.bottom + window.scrollY + 8;

        // Check if popover would go off-screen on the right
        const popoverWidth = 384; // max-w-md = 28rem = 448px, but with padding adjustments
        if (left + popoverWidth / 2 > window.innerWidth) {
          // Adjust left position
        }

        setPopoverPosition({ top, left });
        setPopoverContent(content);
        setIsVisible(true);
      }
    };

    const hidePopover = () => {
      setIsVisible(false);
      setTimeout(() => {
        setPopoverPosition(null);
        setPopoverContent('');
      }, 200);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href) return;
      const footnoteId = href.substring(1);
      showPopover(target, footnoteId);
    };

    const handleMouseLeave = () => {
      hidePopover();
    };

    const handleClick = (e: Event) => {
      // Always prevent navigation and show popover instead
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href) return;

      const footnoteId = href.substring(1);
      showPopover(target, footnoteId);
    };

    // Add event listeners to footnote references
    footnoteRefs.forEach((ref) => {
      ref.addEventListener('mouseenter', handleMouseEnter);
      ref.addEventListener('mouseleave', handleMouseLeave);
      ref.addEventListener('click', handleClick);
    });

    // Handle links with data-tooltip attribute
    const tooltipLinks = document.querySelectorAll('a[data-tooltip]');

    const handleTooltipMouseEnter = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const tooltip = target.getAttribute('data-tooltip');
      if (tooltip) {
        const rect = target.getBoundingClientRect();
        const left = rect.left + rect.width / 2 + window.scrollX;
        const top = rect.bottom + window.scrollY + 8;

        setPopoverPosition({ top, left });
        setPopoverContent(tooltip);
        setIsVisible(true);
      }
    };

    const handleTooltipMouseLeave = () => {
      hidePopover();
    };

    // Track which link was clicked for mobile interaction
    let clickedTooltipLink: HTMLAnchorElement | null = null;

    const handleTooltipClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const tooltip = target.getAttribute('data-tooltip');

      // On mobile, show tooltip on first click, navigate on second
      if (window.innerWidth < 768 && tooltip) {
        if (clickedTooltipLink !== target) {
          e.preventDefault();
          clickedTooltipLink = target;
          const rect = target.getBoundingClientRect();
          const left = rect.left + rect.width / 2 + window.scrollX;
          const top = rect.bottom + window.scrollY + 8;

          setPopoverPosition({ top, left });
          setPopoverContent(tooltip);
          setIsVisible(true);
        } else {
          // Second click on same link - allow navigation
          clickedTooltipLink = null;
        }
      }
    };

    tooltipLinks.forEach((link) => {
      link.addEventListener('mouseenter', handleTooltipMouseEnter);
      link.addEventListener('mouseleave', handleTooltipMouseLeave);
      link.addEventListener('click', handleTooltipClick);
    });

    // Click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('a[href^="#fn"]') && !target.closest('a[data-tooltip]') && !target.closest('.footnote-popover')) {
        hidePopover();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.head.removeChild(style);
      footnoteRefs.forEach((ref) => {
        ref.removeEventListener('mouseenter', handleMouseEnter);
        ref.removeEventListener('mouseleave', handleMouseLeave);
        ref.removeEventListener('click', handleClick);
      });
      tooltipLinks.forEach((link) => {
        link.removeEventListener('mouseenter', handleTooltipMouseEnter);
        link.removeEventListener('mouseleave', handleTooltipMouseLeave);
        link.removeEventListener('click', handleTooltipClick);
      });
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMounted]);

  if (!popoverPosition || !isVisible) return null;

  return (
    <div
      className="footnote-popover fixed z-50 max-w-sm px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl text-sm leading-relaxed"
      style={{
        top: `${popoverPosition.top}px`,
        left: `${popoverPosition.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        setIsVisible(false);
        setTimeout(() => {
          setPopoverPosition(null);
          setPopoverContent('');
        }, 200);
      }}
      dangerouslySetInnerHTML={{ __html: popoverContent }}
    />
  );
}
