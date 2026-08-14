const Property = require("../models/Property");
const City = require("../models/City");

async function searchProperties(filters) {
  const query = {
    isActive: true,
  };

  const andConditions = [];

  // ==========================================
  // CITY
  // ==========================================

  if (filters.city) {
    const city = await City.findOne({
      name: {
        $regex: `^${escapeRegex(filters.city)}$`,
        $options: "i",
      },
    }).lean();

    if (!city) {
      return [];
    }

    query.city = city._id;
  }

  // ==========================================
  // LOCALITY
  // ==========================================

  if (filters.locality) {
    const localityRegex = new RegExp(
      escapeRegex(filters.locality),
      "i"
    );

    andConditions.push({
      $or: [
        {
          locality: localityRegex,
        },
        {
          address: localityRegex,
        },
        {
          description: localityRegex,
        },
        {
          title: localityRegex,
        },
      ],
    });
  }

  // ==========================================
  // PROPERTY TYPE
  // ==========================================

  if (filters.type) {
    query.type = filters.type;
  }

  // ==========================================
  // GENDER
  // ==========================================

  if (
    filters.genderPreference &&
    filters.genderPreference !== "Any"
  ) {
    andConditions.push({
      $or: [
        {
          genderPreference:
            filters.genderPreference,
        },
        {
          genderPreference: "Any",
        },
      ],
    });
  }

  // ==========================================
  // PRICE
  // ==========================================

  if (
    filters.minPrice !== null ||
    filters.maxPrice !== null
  ) {
    const priceQuery = {};

    if (filters.minPrice !== null) {
      priceQuery.$gte = filters.minPrice;
    }

    if (filters.maxPrice !== null) {
      priceQuery.$lte = filters.maxPrice;
    }

    query.price = priceQuery;
  }

  // ==========================================
  // AMENITIES
  // ==========================================

  if (
    filters.amenities &&
    filters.amenities.length > 0
  ) {
    const amenityConditions =
      filters.amenities.map((amenity) => ({
        amenities: {
          $regex: escapeRegex(amenity),
          $options: "i",
        },
      }));

    andConditions.push({
      $and: amenityConditions,
    });
  }

  // ==========================================
  // ADD AND CONDITIONS
  // ==========================================

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  // ==========================================
  // LOG QUERY
  // ==========================================

  console.log(
    "AI MongoDB Query:",
    JSON.stringify(query, null, 2)
  );

  // ==========================================
  // SORT
  // ==========================================

  let sort = {
    isPremium: -1,
    isVerified: -1,
    createdAt: -1,
  };

  if (filters.sortPreference === "price_low") {
    sort = {
      price: 1,
    };
  }

  if (filters.sortPreference === "price_high") {
    sort = {
      price: -1,
    };
  }

  // ==========================================
  // DATABASE
  // ==========================================

  const properties = await Property.find(query)
    .select(
      [
        "title",
        "city",
        "locality",
        "type",
        "genderPreference",
        "price",
        "description",
        "address",
        "latitude",
        "longitude",
        "images",
        "amenities",
        "slug",
        "isVerified",
        "isPremium",
      ].join(" ")
    )
    .populate({
      path: "city",
      select: "name",
    })
    .sort(sort)
    .limit(20)
    .lean();

  // ==========================================
  // FRONTEND RESPONSE
  // ==========================================

  return properties.map((property) => ({
    id: property._id.toString(),

    slug: property.slug,

    title: property.title,

    type: property.type,

    price: property.price,

    priceLabel: `₹${Number(
      property.price
    ).toLocaleString("en-IN")}/month`,

    city: property.city
      ? {
          id: property.city._id.toString(),
          name: property.city.name,
        }
      : null,

    locality: property.locality || null,

    address: property.address,

    genderPreference:
      property.genderPreference,

    description:
      property.description,

    images:
      property.images || [],

    thumbnail:
      property.images?.length > 0
        ? property.images[0]
        : null,

    amenities:
      property.amenities || [],

    latitude:
      property.latitude,

    longitude:
      property.longitude,

    isVerified:
      property.isVerified,

    isPremium:
      property.isPremium,
  }));
}

function escapeRegex(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

module.exports = {
  searchProperties,
};