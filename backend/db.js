const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});


mongoose.connection.on('connected', ()=>{
    console.log("MongoDB connected successfully");
});
mongoose.connection.on('error', (err)=>{
    console.log("Connection error:", err)
});

module.exports = mongoose;