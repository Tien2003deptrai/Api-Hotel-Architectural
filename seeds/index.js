// Import các thư viện cần thiết
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Đường dẫn tới User model

// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/websiteBooking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Hàm tạo dữ liệu seed
const seedAdminUser = async () => {
    try {
        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt); // Thay "admin123" bằng mật khẩu mong muốn

        // Tạo admin user
        const adminUser = new User({
            username: "admin",
            email: "admin@example.com",
            country: "Vietnam",
            img: "",
            city: "Hanoi",
            phone: "123456789",
            password: hashedPassword,
            isAdmin: true,
        });

        // Lưu vào database
        await adminUser.save();
        console.log("Admin user created successfully!");
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        // Đóng kết nối tới MongoDB
        mongoose.connection.close();
    }
};

// Gọi hàm seedAdminUser
seedAdminUser();
