"use client";

import { useEffect, useState } from "react";
import { FriendCard, type Friend } from "./FriendCard";
import styles from "./FriendsPage.module.css";

export function FriendList({ friends }: { friends: Friend[] }) {
  const [orderedFriends, setOrderedFriends] = useState(friends);
  const [feedUrls, setFeedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const shuffled = [...friends];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
      }
      setOrderedFriends(shuffled);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [friends]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/friends/feed", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Friend feeds unavailable");
        return response.json() as Promise<{ feeds?: Array<{ siteUrl: string; feedUrl: string }> }>;
      })
      .then((payload) => {
        setFeedUrls(Object.fromEntries((payload.feeds ?? []).map((feed) => [feed.siteUrl, feed.feedUrl])));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFeedUrls({});
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="friend-links" aria-label="友人小站">
      <div className={styles.grid}>
        {orderedFriends.map((friend) => (
          <FriendCard friend={friend} rssUrl={feedUrls[friend.url]} key={friend.url} />
        ))}
      </div>
    </section>
  );
}
