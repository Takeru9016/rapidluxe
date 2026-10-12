import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { z } from "zod";
import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import { createPackageSchema } from "../src/lib/validations/package";

const destinationId = "cmuvgg1p8000004lb9perudy1";
const outputDirectory = "/private/tmp/rapidluxe-mammoth";
const imageSchema = z.object({
  key: z.string(),
  source: z.string().url(),
  credit: z.string(),
  license: z.string(),
  licenseUrl: z.string().url(),
  cloudinaryUrl: z
    .string()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return (
        url.hostname === "res.cloudinary.com" &&
        url.pathname.startsWith("/dofivda6g/image/upload/")
      );
    }),
});
const images = z
  .array(imageSchema)
  .parse(
    JSON.parse(
      await readFile(
        new URL("../data/mammoth-lakes-images.json", import.meta.url),
        "utf8",
      ),
    ),
  );
const image = (key: string) => {
  const record = images.find((entry) => entry.key === key);
  assert(record, `Missing licensed asset: ${key}`);
  return record.cloudinaryUrl;
};
const pricingNote =
  "Starting price in INR per person, based on two adults sharing. International and domestic airfare are excluded. Final rates depend on travel dates and confirmed arrangements; festive and peak dates are not guaranteed at this starting price. Accommodation, meals, transfers, guides, admission, equipment and wellness treatments are confirmed only in the final quotation.";
const exclusions = [
  "International and domestic airfare",
  "Visa costs and travel insurance",
  "Meals, accommodation, transfers, guides, admission, rentals, lessons and treatments unless explicitly confirmed in the final quotation",
];
const activity = (name: string) => ({
  name,
  duration: "Confirmed with the final itinerary",
  included: false,
});
const day = (number: number, title: string, description: string) => ({
  day: number,
  title,
  description,
  meals: [],
});
const definitions = [
  {
    id: "cmuvgncmi000004jv21kx4ih5",
    title: "Mammoth Lakes Fall Family Escape \u2014 3 Days / 2 Nights",
    slug: "mammoth-lakes-fall-family-escape",
    durationNights: 2,
    pricePerPerson: 110000,
    originalPrice: 125000,
    description: `Golden aspens, alpine water and wide Sierra views set the rhythm for three days in Mammoth Lakes. Designed around an Indian family's preference for soft adventure and vegetarian-friendly dining, this journey makes room for short walks, scenic drives and time together.\n\nFrom Minaret Vista to the June Lake Loop, each day brings a different mountain perspective. Pause beside Lake Mary or Twin Lakes, choose a walk at McLeod or Convict Lake, and explore Hot Creek's geothermal landscape from designated viewing areas. The scenic gondola is considered only when operating; a gentle Lakes Basin drive offers a rewarding alternative.\n\nThe Village, seated breaks and short shoreline stops allow a lower-exertion pace. Gentle activities are not a guarantee of wheelchair access. Vegetarian and Jain requirements must be checked with individual venues; dining suggestions do not establish meal inclusions.\n\n${pricingNote}`,
    itinerary: [
      day(
        1,
        "Arrival & Minaret Vista",
        "Arrive in Mammoth Lakes and settle into a gentle mountain rhythm, allowing time to acclimatise. When the access road is open, visit Minaret Vista for views of the Minarets and surrounding Sierra peaks. Keep walking short, or choose The Village with seated breaks as a lower-exertion alternative. Leave the evening free for vegetarian-friendly dining, with menus and opening hours checked for your dates.",
      ),
      day(
        2,
        "Alpine Lakes & the June Lake Loop",
        "Choose McLeod Lake or Convict Lake according to trail conditions and your preferred pace. A short shoreline visit can replace a full walk. Pause for a separately arranged picnic beside Lake Mary or Twin Lakes, then follow the June Lake Loop through alpine scenery and seasonal aspen colour. Fall colour varies with elevation and weather. Meals and picnic provisions are not confirmed inclusions.",
      ),
      day(
        3,
        "Mountain Perspectives & Hot Creek",
        "Consider the Mammoth Mountain scenic gondola and Eleven53 Interpretive Center only when operating. During maintenance closures, use the soft-activities source's scenic Lakes Basin alternative, with stops at Twin Lakes, Lake Mary and Lake George where access permits. Visit Hot Creek Geologic Site from designated paths and behind barriers if conditions allow; swimming is prohibited. Keep departure timing and onward arrangements flexible until confirmed.",
      ),
    ],
    activities: [
      activity("Minaret Vista viewpoint, subject to road access"),
      activity("McLeod Lake or Convict Lake walk"),
      activity("Lake Mary or Twin Lakes picnic setting"),
      activity("June Lake Loop scenic drive"),
      activity("Scenic gondola or Lakes Basin alternative"),
      activity("Hot Creek Geologic Site viewing"),
    ],
    images: ["fall", "minaret", "convict", "june-lake", "hot-creek"].map(image),
    tags: ["Family", "Adventure"],
    metaTitle: "Mammoth Lakes Fall Family Escape | RapidLuxe",
    metaDescription:
      "Three days of golden aspens, alpine lakes and gentle Sierra exploration in Mammoth Lakes, with vegetarian-friendly dining ideas and a considered family pace.",
  },
  {
    id: "cmuvgnfmk000104jvdimcq9a6",
    title: "Mammoth Lakes Outdoor Adventure \u2014 4 Days / 3 Nights",
    slug: "mammoth-lakes-outdoor-adventure",
    durationNights: 3,
    pricePerPerson: 175000,
    originalPrice: 195000,
    description: `Four days across the Eastern Sierra's striking contrasts: Mono Lake's tufa formations, forested wilderness, alpine lakes and rugged volcanic terrain. An active journey shaped around guided kayaking, hiking, provisional off-road exploration and a choice of guided climbing or mountain biking.\n\nPlan for the snow-free outdoor season, allowing trail access, operator schedules and personal fitness to shape the dates. Heart Lake and Sherwin Lakes offer a day on foot; the Owens River Headwaters Wilderness brings a quieter forest perspective. Climbing at Clark Canyon and Mammoth Mountain Bike Park are alternatives, selected around ability and seasonal operations.\n\nThe ATV day requires a verified operator, permitted routes and suitable equipment before sale. Bishop Motosports is named in the source, but current rental arrangements are not confirmed. Guided activities, transport and equipment remain subject to the final quotation.\n\n${pricingNote}\n\nGallery credit: Kayaking Mono by Sean Foster, via Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Kayaking_Mono_-_panoramio.jpg), CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/). Display resizing and cropping only; no endorsement is implied.`,
    itinerary: [
      day(
        1,
        "Mono Lake & Owens River Headwaters",
        "Begin with a guided Mono Lake kayaking experience among tufa formations, subject to confirmed operator availability, wind conditions and participant suitability. The source names Caldera Kayaks; this does not establish a supplier commitment. Continue into the Owens River Headwaters Wilderness on a route suited to current conditions and the group's pace. Allow time to acclimatise and reconfirm the day's scheduling, guide, equipment and transport.",
      ),
      day(
        2,
        "Heart Lake & Sherwin Lakes",
        "Explore Heart Lake Trail from the Coldwater area and consider Sherwin Lakes for further alpine views. The source proposes both hikes; combine them only when fitness, altitude adjustment, trail access and daylight allow a comfortable day. Choose one walk for a gentler pace, with short lakeside stops from the soft-activities source available as alternatives. Aspen colour is a seasonal possibility.",
      ),
      day(
        3,
        "Provisional Off-Road Eastern Sierra",
        "The source proposes ATV exploration in the Owens River-Hot Creek Road or Deadman Creek area. Confirm a current rental operator, legal routes, insurance, equipment, transport and participant requirements before this day is offered for sale. No vehicle, supplier or route is guaranteed. If the arrangement cannot be confirmed, review the itinerary before sale and consider a scenic Lakes Basin day from the soft-activities source.",
      ),
      day(
        4,
        "Clark Canyon Climbing or Mountain Biking",
        "Choose a guided rock-climbing session at Clark Canyon or Mammoth Mountain Bike Park during its operating season. These are alternatives rather than two promised inclusions. Match the experience to ability and confirm guides, equipment, permits, lift access and weather. The source's 57Hours and Tamarack Bike & Paddle references are planning leads, not confirmed reservations. Coordinate departure around the final selected activity.",
      ),
    ],
    activities: [
      activity("Guided Mono Lake kayaking, subject to confirmation"),
      activity("Owens River Headwaters Wilderness walk"),
      activity("Heart Lake Trail"),
      activity("Sherwin Lakes Trail"),
      activity("Provisional ATV/off-road exploration"),
      activity("Guided Clark Canyon climbing OR Mammoth Mountain Bike Park"),
    ],
    images: ["mono", "kayaking", "convict", "owens", "minaret"].map(image),
    tags: ["Adventure"],
    metaTitle: "Mammoth Lakes Outdoor Adventure | RapidLuxe",
    metaDescription:
      "Four days of Eastern Sierra exploration: Mono Lake kayaking, alpine hiking and provisional off-road adventure, with climbing or seasonal mountain biking.",
  },
  {
    id: "cmuvgnfv4000204jvk0e7iocc",
    title: "Mammoth Lakes Winter Mountain Escape \u2014 4 Days / 3 Nights",
    slug: "mammoth-lakes-winter-mountain-escape",
    durationNights: 3,
    pricePerPerson: 195000,
    originalPrice: 220000,
    description: `Snow-covered Sierra scenery, a day on the mountain and evenings at an unhurried pace shape this three-night winter escape. Begin gently, consider ice skating at Mammoth's recreation centre, spend a day at June Mountain, and make room for optional spa time and a quiet Convict Lake visit.\n\nThe source lists The Westin Monache Resort, Limelight Mammoth and Mammoth Mountain Inn as lodging options for later selection. None is a confirmed inclusion. Spa appointments, ski passes, lessons and equipment also require separate confirmation.\n\nWinter gives the volcanic landscape a different character, while limiting road and trail access. Geological sightseeing is selected around current conditions, not a guaranteed seven-site circuit. A relaxed Village afternoon offers an alternative when snow rules out an excursion.\n\n${pricingNote}`,
    itinerary: [
      day(
        1,
        "Arrival & Winter Skating",
        "Arrive and settle into your selected accommodation once confirmed. Begin gently at altitude, then consider public skating at LA Kings Ice at Mammoth Lakes, the winter ice venue at the Community Recreation Center referred to as Mammoth RecZone in the source. Reconfirm session times, admission and skate rentals. Leave dining flexible around current restaurant hours and dietary needs.",
      ),
      day(
        2,
        "June Mountain, Wellness & Village Time",
        "Spend the day skiing at June Mountain during its operating season, selecting terrain and instruction around experience and current conditions. Lift passes, rentals and lessons are not confirmed inclusions. Later, consider a separately arranged spa treatment or a relaxed stroll through The Village. Dining and wellness appointments remain subject to availability and the final quotation.",
      ),
      day(
        3,
        "Winter Geological Landscapes",
        "Explore only geological sites with confirmed winter access. Hot Creek may be considered when road and path conditions permit; stay behind barriers and do not enter the water. The source's Minaret Vista, Lakes Basin, Inyo Craters, Earthquake Fault and Devils Postpile suggestions require individual access checks. Devils Postpile has no normal winter vehicle access. A gentle Village afternoon is an alternative when conditions rule out sightseeing.",
      ),
      day(
        4,
        "Convict Lake & Departure",
        "Before departure, consider a short Convict Lake shoreline visit if road access, snow and footing allow. A full lake loop is not promised in winter; shorten the visit or omit it when conditions are unsuitable. Leave brunch and onward transport flexible until restaurant hours, checkout and departure arrangements are confirmed.",
      ),
    ],
    activities: [
      activity("LA Kings Ice public skating, subject to schedule"),
      activity("June Mountain skiing, subject to seasonal operation"),
      activity("Optional spa/wellness appointment"),
      activity("The Village gentle stroll"),
      activity("Winter-accessible geological sightseeing"),
      activity("Convict Lake shoreline visit, subject to conditions"),
    ],
    images: ["winter", "skiing", "lodge", "owens", "hot-creek"].map(image),
    tags: ["Adventure"],
    metaTitle: "Mammoth Lakes Winter Mountain Escape | RapidLuxe",
    metaDescription:
      "A four-day Mammoth Lakes winter escape with June Mountain skiing, seasonal skating, optional wellness and Sierra scenery, shaped around current conditions.",
  },
];

const destinationData = {
  name: "Mammoth Lakes",
  slug: "mammoth-lakes",
  country: "United States",
  continent: "AMERICAS",
  description:
    "In California's Eastern Sierra, Mammoth Lakes brings together alpine water, forested slopes and a landscape shaped by volcanoes and glaciers. Golden aspens and quiet shoreline walks give way to snowy mountain days and restorative evenings as the seasons turn. Explore Sierra panoramas, the Lakes Basin and volcanic landscapes at a considered pace, with gentle alternatives for families and more active routes for adventurous travellers. Access and activities vary with weather and season; each journey is shaped around the travel dates and personal comfort.",
  visaType: "VISA_REQUIRED",
  currency: "USD",
  language: "English",
  countryCode: "US",
  lat: 37.6485,
  lng: -118.9721,
  crowdLevel: "MODERATE" as const,
  bestMonths: [
    "January",
    "February",
    "March",
    "June",
    "July",
    "August",
    "September",
    "October",
    "December",
  ],
  imageUrl: image("convict"),
  images: ["convict", "minaret", "fall", "winter", "hot-creek"].map(image),
  whenToVisit: Prisma.DbNull,
};

const packages = definitions.map(({ id, ...definition }) => ({
  id,
  data: createPackageSchema.parse({
    ...definition,
    destinationId,
    minGroupSize: 1,
    maxGroupSize: 2,
    inclusions: [],
    exclusions,
    hotels: [],
    attributes: [],
    isFeatured: false,
    includesFlights: false,
    status: "DRAFT",
  }),
}));

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  const destination = await prisma.destination.findUniqueOrThrow({
    where: { id: destinationId },
  });
  assert.equal(destination.slug, "mammoth-lakes");
  const current = await prisma.package.findMany({
    where: { id: { in: packages.map((entry) => entry.id) } },
  });
  assert.equal(current.length, 3, "Expected all three existing packages");
  for (const record of current) {
    assert.equal(record.destinationId, destinationId);
    assert.equal(
      record.status,
      "DRAFT",
      "Refusing to overwrite a non-draft package",
    );
  }
  for (const entry of packages) {
    const collision = await prisma.package.findUnique({
      where: { slug: entry.data.slug },
      select: { id: true },
    });
    assert(
      !collision || collision.id === entry.id,
      `Slug collision: ${entry.data.slug}`,
    );
    assert.equal(new Set(entry.data.images).size, 5);
  }
  if (process.argv.includes("--apply")) {
    await writeFile(
      `${outputDirectory}/before-${Date.now()}.json`,
      JSON.stringify({ destination, packages: current }, null, 2),
      { flag: "wx" },
    );
    await prisma.$transaction(async (tx) => {
      await tx.destination.update({
        where: { id: destinationId },
        data: destinationData,
      });
      for (const { id, data } of packages) {
        const previous = current.find((record) => record.id === id);
        assert(previous);
        await tx.package.update({
          where: { id, status: "DRAFT", updatedAt: previous.updatedAt },
          data: {
            ...data,
            childPrice: null,
            infantPrice: null,
            toursPrice: null,
            cancellationPolicy: Prisma.DbNull,
          },
        });
      }
    });
  }
  const savedDestination = await prisma.destination.findUniqueOrThrow({
    where: { id: destinationId },
  });
  const saved = await prisma.package.findMany({
    where: { id: { in: packages.map((entry) => entry.id) } },
    include: { destination: true },
  });
  if (process.argv.includes("--verify") || process.argv.includes("--apply")) {
    assert.deepEqual(savedDestination.images, destinationData.images);
    assert.equal(savedDestination.crowdLevel, "MODERATE");
    assert.equal(savedDestination.description, destinationData.description);
    for (const { id, data } of packages) {
      const record = saved.find((entry) => entry.id === id);
      assert(record);
      for (const key of [
        "title",
        "slug",
        "pricePerPerson",
        "originalPrice",
        "durationNights",
        "minGroupSize",
        "maxGroupSize",
        "status",
        "description",
      ] as const)
        assert.equal(record[key], data[key]);
      assert.deepEqual(record.images, data.images);
      assert.deepEqual(record.itinerary, data.itinerary);
      assert.deepEqual(record.hotels, []);
      assert.equal(record.cancellationPolicy, null);
      assert.equal(record.childPrice, null);
      assert.equal(record.infantPrice, null);
      assert.equal(record.toursPrice, null);
      assert.equal(record.includesFlights, false);
      assert.deepEqual(record.inclusions, []);
      assert(
        z
          .array(z.object({ included: z.literal(false) }))
          .safeParse(record.activities).success,
      );
    }
    await writeFile(
      `${outputDirectory}/saved.json`,
      JSON.stringify(
        { destination: savedDestination, packages: saved },
        null,
        2,
      ),
    );
  }
  process.stdout.write(
    `${JSON.stringify({ mode: process.argv.includes("--apply") ? "applied" : process.argv.includes("--verify") ? "verified" : "plan", destinationId, packages: packages.map(({ id, data }) => ({ id, title: data.title, slug: data.slug, pricePerPerson: data.pricePerPerson, originalPrice: data.originalPrice, images: data.images.length, status: data.status })) }, null, 2)}\n`,
  );
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
