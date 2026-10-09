import { Hero } from "@/components/home/Hero";
import {
  CommunityRow,
  Essentials,
  Feed,
  FounderNote,
  GameDay,
  Gifting,
  ShopByFinish,
  ThreeForFifty,
  WholesaleTeaser,
  WontTarnish,
} from "@/components/home/Sections";
import { BeadDivider } from "@/components/ui/BeadDivider";
import { HolidayOrnaments } from "@/components/photos/HolidayOrnaments";

export default function Home() {
  return (
    <>
      <Hero />
      <ThreeForFifty />
      <ShopByFinish />
      <Essentials />
      <div className="container-site">
        <BeadDivider />
      </div>
      <WontTarnish />
      <Feed />
      <GameDay />
      <Gifting />
      <HolidayOrnaments />
      <FounderNote />
      <CommunityRow />
      <WholesaleTeaser />
    </>
  );
}
