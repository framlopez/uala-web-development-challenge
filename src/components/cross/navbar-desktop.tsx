"use client";

import { GetMeResponse } from "@/app/api/me/types";
import fetcher from "@/src/utils/fetcher";
import Image from "next/image";
import useSWR from "swr";

export default function NavbarDesktop() {
  const { data, isLoading } = useSWR<GetMeResponse>("/api/me", fetcher);

  return (
    <div className="hidden lg:block">
      <div className="bg-white py-5 px-6 flex items-center gap-8 shadow-2xs">
        {data?.avatarUrl ? (
          <Image
            className="size-10 rounded-full"
            src={data.avatarUrl}
            alt={data.email}
            width={40}
            height={40}
          />
        ) : isLoading ? (
          <div className="size-10 bg-background rounded-full animate-pulse" />
        ) : (
          <div className="size-10 bg-background rounded-full" />
        )}

        <span className="font-bold text-base">
          {data?.firstname} {data?.lastname}
        </span>
      </div>
    </div>
  );
}
