export default function HistoryListItemSkeleton() {
	return (
		<div className="flex items-center gap-2 w-full py-3 px-2 animate-pulse">
			<div className="size-8 bg-[#DEE2EC] rounded-xl flex-shrink-0" />
			<div className="flex flex-col gap-1 w-full">
				<div className="bg-[#DEE2EC] rounded-xl w-40 h-3.5" />
				<div className="bg-[#DEE2EC] rounded-xl w-30 h-3.5" />
			</div>
			<div className="flex flex-col gap-1 w-30">
				<div className="bg-[#DEE2EC] rounded-xl w-full h-3.5" />
				<div className="bg-[#DEE2EC] rounded-xl w-full h-3.5" />
			</div>
		</div>
	);
}
