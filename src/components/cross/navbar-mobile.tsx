import LogoSrc from "@/public/logo.png";
import Image from "next/image";
import MenuIcon from "../icons/menu";

export default function NavbarMobile() {
  return (
    <div className="relative lg:hidden">
      <div className="flex justify-between items-center bg-white rounded-bl-4xl shadow-2xs px-2">
        <button className="p-3 text-[#606882]" type="button">
          <MenuIcon className="size-6" />
        </button>
        <div className="py-2">
          <Image className="w-20 h-10" src={LogoSrc} alt="Ualá" />
        </div>
        <div></div>
      </div>
      <div className="bg-white size-8 absolute top-full right-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 size-16 rounded-full bg-background inset-shadow-2xs transform -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
