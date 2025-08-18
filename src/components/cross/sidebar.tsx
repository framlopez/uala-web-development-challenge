import AppleStoreSrc from "@/public/apple-store.png";
import GoogleStoreSrc from "@/public/google-store.png";
import LogoFullSrc from "@/public/logo-full.png";
import Image from "next/image";
import HomeIcon from "../icons/home";
import MetricsIcon from "../icons/metrics";

export default function Sidebar() {
  return (
    <div className="hidden bg-white fixed inset-y-0 z-50 lg:flex w-72 flex-col shadow">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto p-5">
        <Image className="h-10 w-[120px]" src={LogoFullSrc} alt="Logo" />

        <nav>
          <ul role="list" className="flex flex-col mt-6">
            <li>
              <button
                className="py-3 px-4 flex items-center gap-1 text-sm text-[#3564FD]"
                type="button"
              >
                <HomeIcon className="size-6" />
                Inicio
              </button>
            </li>
            <li>
              <button
                className="py-3 px-4 flex items-center gap-1 text-sm text-[#3A3A3A]"
                type="button"
              >
                <MetricsIcon className="size-6" />
                Métricas
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-6 mt-auto mb-6">
          <span className="font-bold text-lg text-[#3A3A3A] text-center">
            Descargá la app desde
          </span>
          <div className="flex flex-col gap-4">
            <Image
              className="h-10 mx-auto"
              src={AppleStoreSrc}
              alt="Apple Store"
            />
            <Image
              className="h-10 mx-auto"
              src={GoogleStoreSrc}
              alt="Google Store"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
