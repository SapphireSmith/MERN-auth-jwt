import mongoose from "mongoose";


const connect = async () => {
    const uri = "mongodb://localhost:27017/mernAuth";
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    mongoose.set('strictQuery',true);
    try {
        await mongoose.connect(uri, options);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
        console.log("Error connecting to database");
    }
   
};



export default connect;