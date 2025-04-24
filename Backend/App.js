import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ev from "express-validator"
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
import { check ,validationResult  } from 'express-validator';
 c 
mongoose.connect( process.env.MONGODB_URL,{
   useNewUrlParser: true, useUnifiedTopology: true 
})
.then(() => console.log('DATABASE  CONNECTED'))
  .catch(err => console.error('MongoDB error:', err));

 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_no: { type: String, required: true },
});

let user = mongoose.model('user', userSchema);

 
app.post('/api/user', async (req, res) => {
  try {
    let { name, email, mobile_no } = req.body;
 
    let existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let newvalue = await user.create({ name, email, mobile_no });

    let result = {
      id: newvalue._id,  
      name: newvalue.name,
      email: newvalue.email,
      mobile_no: newvalue.mobile_no
    };

    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




app.put('/api/user/:id', async (req, res) => {
  try {
    let userid =req.params.id;

    let {name,email,mobile_no}= req.body;

    let newuser =user.findById(userid);

    let newvalue=await user.updateOne({name:name,email:email,mobile_no:mobile_no});
    console.log(newvalue);
    if (!newvalue)
     return res.status(404).json({ error: 'user not found' });


    res.json( {
      id: newuser._id,  
      name: newuser.name,
      email: newuser.email,
      mobile_no: newuser.mobile_no
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/user/:id', async (req, res) => {
  try {
let userid =req.params._id;
await user.deleteOne(userid);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/user', async (req, res) => {
  try {
    const user1 = await user.find();
    res.json(user1);
  } catch (error) {
    res.status(500).json({ error: 'internal Server error  at get req' });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started  ${PORT}`));

























