import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    roomNumbers: [
      {
        number: {
          type: Number,
          required: true,
        },
        unavailableDates: {
          type: [Date],
        },
      },
    ],
  },
  { timestamps: true }
);

RoomSchema.index({ title: 1, price: 1 });

export default mongoose.model("Room", RoomSchema);