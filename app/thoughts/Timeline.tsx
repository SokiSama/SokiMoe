import { Children, type ReactNode } from "react";

export type TimelineItem = {
  id: string;
  date: string;
  year: string;
  week: string;
  isToday?: boolean;
};

type TimelineProps = {
  items: TimelineItem[];
  children: ReactNode;
  className?: string;
};

export function Timeline({ items, children, className = "" }: TimelineProps) {
  const content = Children.toArray(children);

  return (
    <div className={`thought-timeline ${className}`.trim()}>
      {items.map((item, index) => (
        <div className="thought-timeline__row" key={item.id}>
          <time
            className={item.isToday ? "is-today" : ""}
            dateTime={`${item.year}-${item.date.replace("/", "-")}`}
          >
            <strong>{item.date}</strong>
            <span>{item.year}</span>
            <small>{item.week}</small>
          </time>
          <div className="thought-timeline__rail" aria-hidden="true">
            <i />
          </div>
          <div className="thought-timeline__content">{content[index]}</div>
        </div>
      ))}
    </div>
  );
}
