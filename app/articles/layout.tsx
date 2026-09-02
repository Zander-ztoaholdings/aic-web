// Parallel route slot for the peek modal.
//
// `modal` renders alongside `children`: it is empty (see @modal/default.tsx)
// until an intercepting route fills it, at which point the article opens as a
// centre modal over the list instead of navigating away.
export default function ArticlesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
