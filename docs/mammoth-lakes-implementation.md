# Mammoth Lakes implementation - 12 October 2026

## Live publication - 12 October 2026

After the draft implementation and QA below, the owner explicitly instructed publication of all three journeys and merge/push to main. All three existing package records were changed from DRAFT to PUBLISHED in one optimistic transaction. Prices, content, five-image galleries and commercial caveats were preserved. No supplier guarantees or new inclusions were added. The draft status and publication blockers described below document the earlier handoff; supplier-specific confirmations still apply to each customer quote.

The live public API returned 200 and PUBLISHED for each slug, with the approved price/original-price pairs and five images. Each live journey page returned 200, rendered its SEO title and price pair, loaded all five primary Cloudinary gallery images, and showed Request This Journey. No preview interception was used for these live checks. Before/after publication backups are retained at /private/tmp/rapidluxe-mammoth/before-publication.json and after-publication.json. No schema, migration or application-code changes were required for publication.

Four existing database records were updated. No duplicate records were created. All three journeys remain DRAFT and unfeatured. Group limits are 1-2 travellers, explicitly approved in this chat. Prices are INR starting prices per person, based on two adults sharing, with international and domestic airfare excluded. Festive/peak rates are not guaranteed.

## Exact records

| Record | ID | Slug | Price per person | Original price |
| --- | --- | --- | ---: | ---: |
| Mammoth Lakes | cmuvgg1p8000004lb9perudy1 | mammoth-lakes | - | - |
| Mammoth Lakes Fall Family Escape - 3 Days / 2 Nights | cmuvgncmi000004jv21kx4ih5 | mammoth-lakes-fall-family-escape | 110000 | 125000 |
| Mammoth Lakes Outdoor Adventure - 4 Days / 3 Nights | cmuvgnfmk000104jvdimcq9a6 | mammoth-lakes-outdoor-adventure | 175000 | 195000 |
| Mammoth Lakes Winter Mountain Escape - 4 Days / 3 Nights | cmuvgnfv4000204jvk0e7iocc | mammoth-lakes-winter-mountain-escape | 195000 | 220000 |

Stored journey titles use an em dash before the duration. The titles, slugs and prices above are validated by the import script and independent readback. Night counts are 2, 3 and 3 as expressly supplied in the implementation request.

Admin records:

- [Destination](https://www.rapidluxe.com/admin/destinations/cmuvgg1p8000004lb9perudy1)
- [Fall journey](https://www.rapidluxe.com/admin/packages/cmuvgncmi000004jv21kx4ih5)
- [Outdoor journey](https://www.rapidluxe.com/admin/packages/cmuvgnfmk000104jvdimcq9a6)
- [Winter journey](https://www.rapidluxe.com/admin/packages/cmuvgnfv4000204jvk0e7iocc)

## Content and commercial handling

The four supplied PDFs were read in full: Mammoth Lakes - 3-Day Fall Itinerary.pdf; Mammoth Lakes - 4 Day Outdoor Adventures Itinerary.pdf; Mammoth Lakes 3-Night Winter Itinerary.pdf; Soft activities in Mammoth Lakes.pdf. The fourth source informs acclimatisation, short shoreline visits, seated breaks and scenic alternatives. No fourth journey was created.

Each journey now has editorial copy, complete daily entries, six source-grounded activity rows, five gallery images, tags, SEO title/description, exclusions and the approved group/price fields. No quality badges were invented: attributes remain empty. Included meals remain empty on every day. Hotel rows and inclusions are empty. Activity rows have included=false and no numeric activity price. Child, infant and tours/transfer prices are null. includesFlights=false. The invented hotel/star placeholder and numeric 0% refund placeholder were removed; cancellationPolicy is database null. The current public UI independently links to the existing RapidLuxe standard cancellation page; no journey-specific terms were authored.

Winter's Westin Monache, Limelight Mammoth and Mammoth Mountain Inn remain options mentioned in the description, not included hotels. No supplier reservation, room category or availability was inferred. Guided kayaking and climbing are proposed experiences subject to confirmation. The ATV day explicitly requires verification before sale. Climbing and mountain biking remain alternatives.

The destination database description, crowd level MODERATE, coordinates, country, continent, visa enum, currency, language, country code and nine approved best months are populated. Existing prudent transport guidance and Sanity about/travelTips/SEO were inspected and preserved. Sanity document ID: cpzPQInBrCoN3lSGLEgsh8. Unsupported per-month open/crowd claims in whenToVisit were cleared rather than inferred.

## Images and licences

[The image manifest](../data/mammoth-lakes-images.json) records all 11 unique assets, original source pages, photographers, individual licences, first-party Cloudinary URLs and dimensions/bytes for new uploads. Four existing licensed images were reused; seven newly downloaded images were visually inspected and uploaded through signed Cloudinary SDK operations into the existing account and rapidluxe/packages folder. Source/credit/licence context was also attached to new Cloudinary assets. All stored image URLs use res.cloudinary.com/dofivda6g/image/upload/.

| New image | Photographer/source | Licence | Cloudinary public ID | Dimensions |
| --- | --- | --- | --- | --- |
| Minaret Vista | US Forest Service Region 5 Photography | Public domain | rapidluxe/packages/mammoth-lakes-minaret-20261012 | 640 x 480 |
| Mammoth skiing | Carol M. Highsmith / Library of Congress | Public domain | rapidluxe/packages/mammoth-lakes-skiing-20261012 | 3840 x 2563 |
| Skiers outside Mammoth lodge | Carol M. Highsmith / Library of Congress | Public domain | rapidluxe/packages/mammoth-lakes-lodge-20261012 | 3840 x 2563 |
| Mono Lake/tufa, titled Kayaking Mono | Sean Foster | CC BY 3.0 | rapidluxe/packages/mammoth-lakes-kayaking-20261012 | 3472 x 1971 |
| Owens River and Sierra scenery | Robson Hatsukami Morgan | CC0 | rapidluxe/packages/mammoth-lakes-owens-20261012 | 5464 x 3643 |
| Hot Creek viewing path/geothermal landscape | US Geological Survey | Public domain | rapidluxe/packages/mammoth-lakes-hot-creek-20261012 | 2272 x 1704 |
| June Lake panorama | PxHere contributor, unnamed | CC0 | rapidluxe/packages/mammoth-lakes-june-lake-20261012 | 1200 x 483 |

All seven uploads succeeded. Downloaded assets were actual photographs, not watermarked sales previews. The Highsmith photos are licensed high-resolution JPEG derivatives of public-domain archival TIFFs. They depict Mammoth ski-area context in 2012, not a confirmed contemporary hotel or June Mountain supplier. The Minaret source is only 640 x 480 and is used as a supporting image, not the primary cover. The Owens River photograph was obtained from Wikimedia under its documented pre-June-2017 CC0 licence; there is no Unsplash hotlink.

Sean Foster's credit, source URL, CC BY 3.0 licence URL and display-cropping/resizing note are also included in the adventure description. Retain this attribution if that image remains in the gallery. Other licences do not require visible attribution, but provenance is retained.

Existing Pexels assets reused: Kelly Kennedy's Convict Lake (6911450), Soly Moses's fall Convict Lake (14272737), Caylee DG's winter Convict Lake (2434982), and Mazin Omron's Mono Lake tufa (35016791). [Pexels licence](https://www.pexels.com/license/) permits commercial website use subject to its restrictions. A previously reused image labelled Mammoth Mountain (13862168) was removed from these four galleries after visual review raised a location concern. Its existing Cloudinary asset was preserved, not deleted.

Gallery order by manifest key:

- Destination: convict, minaret, fall, winter, hot-creek.
- Fall: fall, minaret, convict, june-lake, hot-creek.
- Adventure: mono, kayaking, convict, owens, minaret.
- Winter: winter, skiing, lodge, owens, hot-creek.

These galleries contain five distinct photos each. There is no cleared current hotel/spa, ice-rink, ATV or climbing/bike-park provider media asset; appropriate local landscape and ski-area photographs cover those visual gaps without suggesting confirmed suppliers. The Mono photograph's title is Kayaking Mono, but it is primarily a tufa landscape; no prominently depicted guided kayak group is promised. [Official Visit Mammoth media access](https://www.visitmammoth.com/community/media/) requires an approved account/request, so those assets were not used without permission.

## Current operational checks

Web research was used for current operation and licensing, not to replace the source itineraries or invent inclusions. Checked on 12 October 2026:

- [Mammoth scenic gondola](https://www.mammothmountain.com/things-to-do/activities/scenic-gondola): maintenance closure September 28-November 12, 2026. Fall copy offers the source-based Lakes Basin alternative and does not guarantee gondola access.
- [Mammoth activity hours](https://www.mammothmountain.com/on-the-mountain/hours-of-operation): bike park, scenic gondola and Tamarack Bike & Paddle were listed closed for the season. Future dates require reconfirmation.
- [Caldera Kayak](https://calderakayak.com/): Mono Lake tours are offered; no date-specific booking or supplier contract was made.
- [June Mountain hours](https://www.junemountain.com/mountain-information/hours-of-operation): closed for the 25/26 season; future winter operation requires reconfirmation.
- [LA Kings Ice](https://www.lakingsicemammothlakes.com/page/show/8035132-home): the current winter rink at the Community Recreation Center, replacing a literal interpretation of the source's RecZone label. Public-skate times must be checked for the dates.
- [NPS 2026 Devils Postpile compendium](https://www.nps.gov/depo/learn/management/upload/2026_DEPO_Compendium_508_signed.pdf): vehicle access is limited by winter weather; winter copy avoids a guaranteed seven-site circuit.
- [US Forest Service visitor guide](https://www.fs.usda.gov/sites/nfs/files/legacy-media/inyo/Visitor%20Guide%202021.pdf): Hot Creek is for viewing; swimming is prohibited. No unsupported boardwalk-accessibility guarantee was retained.
- [Visit Mammoth airport transfers](https://www.visitmammoth.com/travel-info/flying/airport-transfers-mammoth-lakes/) and [Mammoth transport](https://www.mammothmountain.com/discover-mammoth/getting-around): airport and local transport context exists; schedules and transfers remain separate confirmation items.
- [Westin Monache official site](https://www.marriott.com/en-us/hotels/mmhwi-the-westin-monache-resort-mammoth/overview/) and [Limelight Mammoth](https://www.limelighthotels.com/mammoth/stay): current property context only. No date-specific inventory or hotel inclusion was claimed.

## Verification

Application code, Prisma schema and migrations were not changed. Destination.images, Package.images, the admin uploader and DetailPhotoGrid already supported the galleries.

- Existing locked dependencies installed in an isolated checkout; no new package added and no lockfile changed.
- Prisma generate and validate: passed.
- Prisma migrate status: 14 migrations; database up to date. No migration applied.
- TypeScript strict project check (tsc --noEmit --incremental false): passed after the final import changes.
- Biome check of both touched implementation files: passed.
- Production Next.js build: passed, including compilation, TypeScript and generation of 65 pages. The first launch with Node's --env-file failed because a worker propagated an unsupported NODE_OPTIONS flag; rerunning with the existing dotenv package loading the same environment passed. No development server was run.
- Exact record readback: prices, title, slug, duration, group limits, itinerary, images, draft status, empty hotels/inclusions, false activity-included flags, null child/infant/tour prices and null package-specific cancellation policy verified.
- All 11 final Cloudinary image URLs returned image responses; previously reused assets were visually reviewed too.
- Production browser QA: destination and all three journey layouts at 500, 768 and 1440 pixels. Final pass: five visible loaded gallery images per page, no horizontal page overflow and measured CLS 0 in all 12 cases. The questionable reused image was absent.
- All three price/original-price pairs rendered correctly, with strikethrough anchors, desktop From price guide, approved 1-2 pax and two-adults-sharing language. Mobile sticky prices use the existing /person presentation; the description supplies the starting-price basis.
- Lightbox open/next/Escape and counter 2 / 5 verified on all three journeys; a fall itinerary accordion was also opened.
- Each Request This Journey CTA reached sign-in, retaining the matching /book/<slug> return URL. The matching request route returned 307 to sign-in. Each Save CTA reached sign-in retaining its journey return URL. No booking or wishlist mutation was submitted.
- Each desktop custom-quote CTA produced the correct WhatsApp URL/title; window.open was captured so no message was sent.
- Without preview interception, all three package API requests returned 404, confirming drafts remain unavailable publicly.

Journey browser QA used the unchanged production application with package API responses supplied from independently read saved draft records through a loopback-only preview helper. This allowed real component/layout/CTA verification without publishing. The server metadata title remains Package Not Found in this preview because server metadata correctly excludes drafts; stored journey SEO was verified separately. The destination rendered from the real application/database/Sanity flow. Signed-in admin edit/save/reopen and a signed-in booking submission were not verified because this browser had no authenticated session. No claim is made about a full checkout or live publication.

Local browser logs included Vercel analytics endpoints unavailable outside Vercel, unauthenticated eligibility 401s and Mapbox worker errors. These existing/environment issues were not suppressed or refactored. An existing destination best-time chip compresses the nine selected months into January-December; monthly weather estimates are external and not validated against the itinerary PDFs. The prior handover's admin Included-checkbox concern was not reproduced through authenticated admin; persisted data is verified false through the supported data model.

QA screenshots and before/after snapshots are retained at /private/tmp/rapidluxe-mammoth/ on the task host. They are temporary evidence, not committed customer data. The original before.json captures the pre-import four records; subsequent imports use timestamped before snapshots.

## Publication blockers

All three journeys remain DRAFT. Confirm accommodation/property/room category and what the stated rate actually includes; meal arrangements; transfers; guides, admissions, ski passes, equipment, lessons and wellness bookings; date-specific season/road/trail access and supplier availability; the ATV operator, permitted routes, insurance and participant requirements; child/infant suitability and any pricing if offered; applicable approved cancellation terms and festive/peak quoting. No image copyright blocker remains for the selected assets if Sean Foster attribution is retained. Additional provider-specific media needs separate rights clearance.

Before any later admin re-save/publication, verify the prior Included-checkbox concern and ensure the editor preserves empty unconfirmed hotel/cancellation data instead of reintroducing placeholders. These drafts should not be sold as guaranteed supplier-backed packages until the above business confirmations exist.

## Files and commits

Exactly three repository files are added:

- scripts/import-mammoth-lakes.mts: schema-validated identity-preserving import, optimistic transaction updates, local backups and exact readback assertions.
- data/mammoth-lakes-images.json: image provenance, credits, licences and first-party URLs.
- docs/mammoth-lakes-implementation.md: this completion record, QA and blockers.

Implementation commit: ac8cdb61aed2c5e5019ae33f3f779db56c037fc3. A second atomic documentation commit records this report. No schema or migration files changed. No deployment is needed for the database/image updates; the source commits add reproducibility and documentation.

To inspect or verify later, provide the existing environment securely and run node --import tsx scripts/import-mammoth-lakes.mts for a plan, or append --verify for independent readback. --apply performs the authorized changes only after identity, draft status, slug-collision and existing schema checks. Keep production credentials outside Git.
