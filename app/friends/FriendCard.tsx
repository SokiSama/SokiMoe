"use client";

import { RssSimple } from "@phosphor-icons/react";

export type Friend = {
  title: string;
  avatar: string;
  description: string;
  url: string;
  tags: string[];
};

export function FriendCard({ friend, rssUrl }: { friend: Friend; rssUrl?: string }) {
  return (
    <a className="friend-card card" href={friend.url} target="_blank" rel="noopener noreferrer">
      <span className="friend-card-backdrop" aria-hidden="true">
        <img src={friend.avatar} alt="" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
      </span>
      {rssUrl && (
        <span className="friend-rss-indicator" title="支持 RSS 订阅" aria-label="支持 RSS 订阅">
          <RssSimple weight="bold" aria-hidden="true" />
        </span>
      )}
      <img
        className="friend-avatar"
        src={friend.avatar}
        alt={`${friend.title} 的头像`}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />
      <div className="friend-card-content">
        <h2>{friend.title}</h2>
        <p>{friend.description}</p>
      </div>
    </a>
  );
}
