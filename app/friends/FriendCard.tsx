/* eslint-disable @next/next/no-img-element -- Friends provide avatars on arbitrary external hosts; keep direct lazy-loaded images. */
"use client";

import { RssSimple, Wind } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./FriendsPage.module.css";

export type Friend = {
  title: string;
  avatar: string;
  description: string;
  url: string;
  tags: string[];
};

export function FriendCard({ friend, rssUrl }: { friend: Friend; rssUrl?: string }) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  return (
    <a className={styles.friendCard} href={friend.url} target="_blank" rel="noopener noreferrer">
      {!avatarFailed && <img className={styles.avatarBackdrop} src={friend.avatar} alt="" aria-hidden="true" referrerPolicy="no-referrer" loading="lazy" decoding="async" />}
      <Wind className={styles.cardDecoration} size={42} aria-hidden="true" />
      {rssUrl && (
        <span className={styles.rss} title="支持 RSS 订阅" aria-label="支持 RSS 订阅">
          <RssSimple weight="bold" aria-hidden="true" />
        </span>
      )}
      {avatarFailed ? <span className={styles.avatarFallback} aria-hidden="true">{friend.title.slice(0, 1)}</span> : <img
        className={styles.avatar}
        src={friend.avatar}
        alt={`${friend.title} 的头像`}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        width={64}
        height={64}
        onError={() => setAvatarFailed(true)}
      />}
      <div className={styles.friendContent}>
        <h2>{friend.title}</h2>
        <p>{friend.description}</p>
      </div>
    </a>
  );
}
