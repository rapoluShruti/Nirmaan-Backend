// const fetch = require("node-fetch");

// async function reverseGeocode(lat, lng) {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//     );
//     const data = await res.json();

//     return {
//       city:
//         data.address.city ||
//         data.address.town ||
//         data.address.village ||
//         "",
//       state: data.address.state || "",
//       country: data.address.country || "",
//     };
//   } catch (error) {
//     console.error("Reverse geocode failed", error);
//     return { city: "", state: "", country: "" };
//   }
// }

// module.exports = reverseGeocode;
const fetch = require("node-fetch");

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    return {
      city: data.address?.city || data.address?.town || data.address?.village || "Mumbai",
      state: data.address?.state || "Maharashtra",
      country: data.address?.country || "India",
    };
  } catch (error) {
    console.error("Reverse geocode failed", error);
    return { city: "Mumbai", state: "Maharashtra", country: "India" };
  }
}

module.exports = reverseGeocode;
