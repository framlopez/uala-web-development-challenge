"use client";

import { GetMeResponse } from "@/app/api/me/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shadcn/components/ui/avatar";
import { Skeleton } from "@/src/shadcn/components/ui/skeleton";
import fetcher from "@/src/utils/fetcher";
import useSWR from "swr";

function NavbarDesktopWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:block sticky top-0">
      <div className="bg-white py-5 px-6 flex items-center gap-8 shadow-2xs">
        {children}
      </div>
    </div>
  );
}

export default function NavbarDesktop() {
  const { data, isLoading, error } = useSWR<GetMeResponse>("/api/me", fetcher);

  if (isLoading) {
    return (
      <NavbarDesktopWrapper>
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-4 rounded w-20" />
      </NavbarDesktopWrapper>
    );
  }

  if (error || !data) {
    return (
      <NavbarDesktopWrapper>
        <span className="text-xs text-red-500">
          No se pudo obtener tu información.
        </span>
      </NavbarDesktopWrapper>
    );
  }

  return (
    <div className="hidden lg:block sticky top-0">
      <div className="bg-white py-5 px-6 flex items-center gap-8 shadow-2xs">
        <Avatar className="size-10">
          <AvatarImage src={data.avatarUrl} />
          <AvatarFallback>
            {data.firstname.charAt(0)}
            {data.lastname.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <span className="font-bold text-base">
          {data.firstname} {data.lastname}
        </span>
      </div>
    </div>
  );
}
