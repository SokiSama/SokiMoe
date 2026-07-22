"use client";

export type Friend = {
  title: string;
  avatar: string;
  description: string;
  url: string;
  tags: string[];
};

export function FriendCard({ friend }: { friend: Friend }) {
  return (
    <a className="friend-card card" href={friend.url} target="_blank" rel="noopener noreferrer">
      <img
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
