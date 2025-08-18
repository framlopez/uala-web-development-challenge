import History from "@/src/components/transactions-page/history";
import Summary from "@/src/components/transactions-page/summary";

export default function Home() {
  return (
    <div className="container max-w-md">
      <Summary />
      <History />
    </div>
  );
}
