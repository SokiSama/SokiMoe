import { FriendCard, type Friend } from "./FriendCard";

export function FriendList({ friends }: { friends: Friend[] }) {
  return (
    <section className="card friend-directory">
      <div className="friends-list-head">
        <h2>朋友们</h2>
      </div>
      <div className="friend-grid motion-stagger">
        {friends.map((friend) => <FriendCard friend={friend} key={friend.url} />)}
      </div>
    </section>
  );
}
