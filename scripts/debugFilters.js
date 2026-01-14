import { getAllProperties } from "../src/services/properties.js";

(async () => {
  console.log("filter: pricePerNight=310.25");
  const r1 = await getAllProperties({ pricePerNight: "310.25" });
  console.log(r1.map((p) => ({ id: p.id, pricePerNight: p.pricePerNight })));

  console.log("filter: location=Malibu, California & pricePerNight=310.25");
  const r2 = await getAllProperties({
    location: "Malibu, California",
    pricePerNight: "310.25",
  });
  console.log(
    r2.map((p) => ({
      id: p.id,
      pricePerNight: p.pricePerNight,
      location: p.location,
    }))
  );

  process.exit(0);
})();
