export default function CardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Card</title>
      <path
        d="M17.75 5H5.75C3.68 5 2 6.68 2 8.75V15.75C2 17.82 3.68 19.5 5.75 19.5H17.75C19.82 19.5 21.5 17.82 21.5 15.75V8.75C21.5 6.68 19.82 5 17.75 5ZM5.75 6.5H17.75C18.82 6.5 19.71 7.25 19.94 8.25H3.56C3.79 7.25 4.68 6.5 5.75 6.5ZM17.75 18H5.75C4.51 18 3.5 16.99 3.5 15.75V11.25H20V15.75C20 16.99 18.99 18 17.75 18Z"
        fill="currentColor"
      />
    </svg>
  );
}
