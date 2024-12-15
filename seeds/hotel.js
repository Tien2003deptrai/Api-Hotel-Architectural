// Import mongoose and faker
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Hotel from "../models/Hotel.js";

// MongoDB Connection
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://localhost:27017/websiteBooking", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

// Seed Function
const seedHotels = async () => {
    try {
        const hotelData = [];

        for (let i = 0; i < 100000; i++) {
            hotelData.push({
                name: faker.company.name(),
                type: faker.helpers.arrayElement(["hotel", "apartment", "resort", "villa", "cabin"]),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                distance: `${faker.number.int({ min: 1, max: 50 })} km`,
                photos: Array.from({ length: 5 }, () => faker.image.url()),
                title: faker.company.catchPhrase(),
                desc: faker.lorem.paragraph(),
                rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
                rooms: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => faker.database.mongodbObjectId()),
                cheapestPrice: faker.number.int({ min: 50, max: 1000 }),
                featured: faker.datatype.boolean(),
            });
        }

        await Hotel.insertMany(hotelData);
        console.log("Seeded 10,000 hotels successfully!");
    } catch (err) {
        console.error("Seeding failed", err);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeding process
const runSeeder = async () => {
    await connectDB();
    await seedHotels();
};

runSeeder();
