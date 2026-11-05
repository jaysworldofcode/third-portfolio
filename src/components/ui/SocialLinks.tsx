import type { IconType } from "react-icons";

type SocialLink = { label: string; href: string; icon: IconType };

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
  /** Classes for each round icon button, appended to the defaults. */
  itemClassName?: string;
};

export function SocialLinks({ links, className = "", itemClassName = "" }: SocialLinksProps) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            className={`grid size-10 place-items-center rounded-full border border-line text-fg transition duration-500 ease-out-expo hover:border-accent hover:bg-accent hover:text-on-accent ${itemClassName}`}
          >
            <Icon aria-hidden className="size-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
