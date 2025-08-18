import AppleStoreSrc from "@/public/apple-store.png";
import GoogleStoreSrc from "@/public/google-store.png";
import LogoFullSrc from "@/public/logo-full.png";
import Image from "next/image";
import Link from "next/link";
import HomeIcon from "../icons/home";
import MetricsIcon from "../icons/metrics";
import Button from "./button";

export default function Sidebar() {
  return (
    <div className="hidden bg-white fixed inset-y-0 z-30 lg:flex w-72 flex-col shadow">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto p-5">
        <Image className="h-10 w-[120px]" src={LogoFullSrc} alt="Logo" />

        <nav>
          <ul role="list" className="flex flex-col mt-6">
            <li>
              <Button className="text-[#3564FD] w-full">
                <HomeIcon className="size-6" />
                Inicio
              </Button>
            </li>
            <li>
              <Button className="text-[#3A3A3A] w-full">
                <MetricsIcon className="size-6" />
                Métricas
              </Button>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-6 mt-auto mb-6">
          <span className="font-bold text-lg text-[#3A3A3A] text-center">
            Descargá la app desde
          </span>
          <div className="flex flex-col gap-4">
            <Link href="https://uala.onelink.me/tTSW/vq840eav">
              <Image
                className="h-10 mx-auto"
                src={AppleStoreSrc}
                alt="Apple Store"
              />
            </Link>
            <Link href="https://uala.onelink.me/tTSW/vq840eav">
              <Image
                className="h-10 mx-auto"
                src={GoogleStoreSrc}
                alt="Google Store"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
