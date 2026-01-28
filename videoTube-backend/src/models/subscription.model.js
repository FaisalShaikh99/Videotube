
// Adding a unique compound index to prevent duplicate subscriptions
// This ensures one user can only subscribe to a channel once.

import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // ye vo user hai jo subscriber karta hai
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // ye vo user hai jise subscribe kiya ja raha hai
        ref: "User"
    }
}, { timestamps: true })

// Ensure a user can't subscribe to the same channel twice
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);