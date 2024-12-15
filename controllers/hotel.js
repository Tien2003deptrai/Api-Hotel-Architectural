import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 3600 });

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  // :id, ?
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const getHotelsPaginated = async (req, res, next) => {
  const { page = 1, limit = 10, min, max, ...filters } = req.query;
  const cacheKey = `hotels:${page}:${limit}:${JSON.stringify(filters)}`;

  try {
    // Kiểm tra cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Query tối ưu
    const hotels = await Hotel.find({
      ...filters,
      cheapestPrice: { $gte: min || 0, $lte: max || Number.MAX_VALUE },
    })
      .select("name city type cheapestPrice address distance photos title desc rating rooms featured")
      .lean()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalHotels = cache.get("totalHotels") || await Hotel.countDocuments({
      ...filters,
      cheapestPrice: { $gte: min || 0, $lte: max || Number.MAX_VALUE },
    });

    const response = {
      hotels,
      // currentPage: Number(page),
      // totalPages: Math.ceil(totalHotels / limit),
    };

    // Lưu cache
    cache.set(cacheKey, response, { ttl: 3600 }); // Cache 1 giờ

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
