/* eslint-disable @next/next/no-css-tags -- Vendored CJK font stylesheets load only the required Unicode subsets. */
export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return <>
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Regular.css" precedence="default" />
    <link rel="stylesheet" href="/fonts/harmonyos-sans-sc/Semibold.css" precedence="default" />
    {children}
  </>;
}
