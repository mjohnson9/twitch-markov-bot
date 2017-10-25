import * as mongoose from "mongoose";

export type ChainLinkModel = mongoose.Document & {
    fromWord: string,
    toWord: string,

    strength: number,
};

const chainLinkSchema = new mongoose.Schema({
    fromWord: String,
    toWord: String,

    strength: Number,
});

const chainLink = mongoose.model("ChainLink", chainLinkSchema);
export default chainLink;
