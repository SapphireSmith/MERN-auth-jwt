import mongoose from "mongoose";


const connect = async () => {
    const uri = "mongodb+srv://ssapphire527:MERN_auth_project@cluster0.bhq547p.mongodb.net/?retryWrites=true&w=majority";
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