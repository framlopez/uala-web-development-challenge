export default function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Menu</title>
      <path
        d="M5 6.75H19C19.41 6.75 19.75 6.41 19.75 6C19.75 5.59 19.41 5.25 19 5.25H5C4.59 5.25 4.25 5.59 4.25 6C4.25 6.41 4.59 6.75 5 6.75Z"
        fill="currentColor"
      />
      <path
        d="M19 11.25H5C4.59 11.25 4.25 11.59 4.25 12C4.25 12.41 4.59 12.75 5 12.75H19C19.41 12.75 19.75 12.41 19.75 12C19.75 11.59 19.41 11.25 19 11.25Z"
        fill="currentColor"
      />
      <path
        d="M19 17.25H5C4.59 17.25 4.25 17.59 4.25 18C4.25 18.41 4.59 18.75 5 18.75H19C19.41 18.75 19.75 18.41 19.75 18C19.75 17.59 19.41 17.25 19 17.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
