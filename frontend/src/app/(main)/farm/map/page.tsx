"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Navigation, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  lat: number;
  lng: number;
  area: string;
  status: string;
}

const FARM_PLOTS: FarmPlot[] = [
  { id: "1", name: "ស្រែស្រូវ", crop: "ស្រូវ IR-504", lat: 11.5564, lng: 104.9282, area: "1.5 ហិកតា", status: "កំពុងលូតលាស់" },
  { id: "2", name: "ចំការបន្លែ", crop: "បន្លែសរីរាង្គ", lat: 11.5604, lng: 104.9302, area: "0.5 ហិកតា", status: "ប្រមូលផល" },
  { id: "3", name: "ចំការស្វាយ", crop: "ស្វាយកែវ", lat: 11.5544, lng: 104.9262, area: "0.5 ហិកតា", status: "រង់ចាំ" },
];

function MapView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-xl bg-muted">
        <div className="text-center">
          <Navigation className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">កំពុងផ្ទុកផែនទី...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[60vh] overflow-hidden rounded-xl">
      <MapContainer
        center={[11.5564, 104.9282]}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {FARM_PLOTS.map((plot) => (
          <Marker key={plot.id} position={[plot.lat, plot.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{plot.name}</p>
                <p>{plot.crop}</p>
                <p>{plot.area}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function FarmMapPage() {
  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="flex items-center gap-2">
        <Link href="/farm/dashboard">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">ផែនទីកសិដ្ឋាន</h1>
      </div>

      <MapView />

      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold text-primary">៣</p>
            <p className="text-xs text-muted-foreground">ដីឡូតិ៍</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold text-primary">២.៥ ហិកតា</p>
            <p className="text-xs text-muted-foreground">ផ្ទៃដីសរុប</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {FARM_PLOTS.map((plot) => (
          <Card key={plot.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">{plot.name}</p>
                <p className="text-xs text-muted-foreground">{plot.crop}</p>
                <p className="text-xs text-muted-foreground">{plot.area}</p>
              </div>
              <span className="text-xs text-green-600">{plot.status}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
