import * as mongoose from "mongoose";

export type ChainLinkModel = mongoose.Document & {
    fromWord: string,
    toWord: string,

    occurences: number,

    generateId: () => mongoose.Types.ObjectId;
};

const chainLinkSchema = new mongoose.Schema({
    fromWord: String,
    toWord: String,

    occurences: Number,
});

chainLinkSchema.methods.generateId = function(): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(`${this.fromWord}-${this.toWord}`);
};

chainLinkSchema.index({fromWord: 1});
chainLinkSchema.index({fromWord: 1, toWord: 1}, {unique: true});

chainLinkSchema.pre("save", function(this: ChainLinkModel, next: (err?: mongoose.NativeError) => void) {
    if(this.isNew) {
        this._id = this.generateId();
    }

    return next();
});

export const ChainLink: mongoose.Model<ChainLinkModel> = mongoose.model("ChainLink", chainLinkSchema);
