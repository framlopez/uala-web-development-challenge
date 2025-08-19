import History from "@/src/components/transactions-page/list-history";
import Summary from "@/src/components/transactions-page/summary";

export default function Home() {
  return (
    <div className="container max-w-md my-8 lg:my-10">
      <Summary />
      <History />
    </div>
  );
}
