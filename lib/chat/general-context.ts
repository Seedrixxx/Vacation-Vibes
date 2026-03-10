/**
 * General Q&A and FAQ content for the chatbot. Used so the bot can answer
 * general questions about Vacation Vibes, Sri Lanka travel, and common topics.
 */

export function getGeneralContext(): string {
  return `
## About Vacation Vibes (Vacation Vibez)

Vacation Vibes (also written Vacation Vibez) is a travel company that crafts personalized journeys through Sri Lanka and select destinations beyond. We combine local expertise with a passion for thoughtful travel. Every itinerary is designed around the traveler. We offer handcrafted itineraries, custom trips, honeymoon planning, group tours, corporate travel, and visa support.

Why choose us: Local expertise and long-standing partnerships; handpicked stays and experiences; transparent pricing and 24/7 support.

## Services

- Custom Itineraries: Tailored routes and experiences built around your preferences.
- Honeymoon Planning: Romantic getaways with private stays and special touches.
- Group Tours: Curated group journeys with expert guides.
- Corporate Travel: Meetings, incentives, and team retreats.
- Visa Support: Guidance and documentation for a smooth process.
- Airport Transfers and Hotel Bookings are also available.

## Sri Lanka – General travel information

Best time to visit Sri Lanka: The country has two monsoon seasons. The west and south coasts (e.g. Galle, Mirissa, Unawatuna) are best from November to April. The east coast is best from April to September. The central hills (Kandy, Nuwara Eliya, Ella) can be visited year-round but are often cooler and wetter in the southwest monsoon (May–September). Wildlife safaris (e.g. Yala) are often best in the dry season when animals gather at water sources.

Visa: Many nationals can get an Electronic Travel Authorization (ETA) or visa on arrival for tourism. Requirements vary by nationality. Vacation Vibes offers visa support and guidance—ask for details or chat with our live agent for your specific case.

Currency: Sri Lankan Rupee (LKR). ATMs and card payments are widely available in tourist areas. It is useful to have some local currency for small vendors and tips.

Language: Sinhala and Tamil are official; English is widely used in tourism, hotels, and major cities.

What to see: Sri Lanka is known for culture (Sigiriya, Temple of the Tooth in Kandy, Galle Fort), wildlife (Yala, Minneriya, Udawalawe), tea country (Nuwara Eliya, Ella), and beaches (south and east coasts). Our itineraries often include Negombo, Dambulla, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala, and the south (Galle, Unawatuna, Mirissa).

## Destinations we cover

- Sri Lanka: Our main focus. We offer multiple itineraries (e.g. 7, 10, or 14 days) covering culture, wildlife, tea country, and beaches.
- Beyond Sri Lanka: We also offer tour packages to other destinations. For trips to Dubai, Maldives, or other specific destinations, browse "Beyond Sri Lanka" on the Tour Packages page or chat with our live agent to see what we currently offer.

## Booking and next steps

- Build Your Trip: Use our "Build Your Trip" tool on the website to tell us your style, duration, and interests; we'll suggest a route and experiences and follow up with a personalized blueprint.
- Tour Packages: We offer fixed itineraries (Sri Lanka and Beyond Sri Lanka) that you can browse and book or customize.
- Quotes and customization: For a custom quote or to modify a package, contact us via the contact page or chat with our live agent on WhatsApp.
- Track your trip: If you have already booked, you can track your trip status on the website using your invoice number and email.

## Frequently asked questions (FAQs)

- How do I book or get a quote? Use Build Your Trip to submit your preferences, or contact us via the contact page or WhatsApp (live agent). We will send a personalized itinerary and quote.
- What is included in your packages? Our tour packages typically include accommodation, transport, selected activities and experiences as per the itinerary, and often some meals. Exact inclusions depend on the package—check the package details or ask for a specific itinerary.
- Do you offer airport transfers? Yes. We offer airport transfers and can arrange them as part of your itinerary or as a standalone service.
- Where does Vacation Vibes operate? We focus on Sri Lanka (inbound tours) and also offer trips beyond Sri Lanka to select destinations. Our website has Tour Packages for Sri Lanka and Beyond Sri Lanka. For specific destinations (e.g. Dubai, Maldives, or others), check the Beyond Sri Lanka packages or chat with our live agent for current offerings.
- Can you help with visas? We offer visa support and guidance. Requirements depend on your nationality. For detailed or country-specific visa advice, chat with our live agent.
- What is the best time to visit Sri Lanka? See "Sri Lanka – General travel information" above (west/south coast November–April; east coast April–September; central hills year-round).
- How can I track my booking? Use the "Track your Trip" section on the website with your invoice number and email to see your trip status.

## Contact and live agent

For questions that need a human (e.g. specific dates, group sizes, visa for your nationality, or complex requests), we recommend: Chat with our live agent (WhatsApp). Our team is available to help with bookings, quotes, and travel advice.
`.trim();
}
