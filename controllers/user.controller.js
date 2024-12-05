import User from "../models/user.model.js";

export const getSeuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections
            }
        }).select("name username profilePicture headline")
            .limit(3);

        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in suggestedUser");
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("password");
        if (!user) return res.status(401).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ];

        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field]
            }
        }

        // upload img
        if (req.files) {
            if (req.files['profilePicture']) {
                console.log(req.files['profilePicture'])
                updatedData.profilePicture = req.files['profilePicture'][0].filename; // وضع مسار صورة البروفايل في قاعدة البيانات
            }
            if (req.files['bannerImg']) {
                updatedData.bannerImg = req.files['bannerImg'][0].filename; // وضع مسار صورة البنر في قاعدة البيانات
            }
        }
        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true });
        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile", error);
        res.status(500).json({ message: "Internal server error" });
    }
}