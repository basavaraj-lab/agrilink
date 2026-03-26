const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// CORS — allow all localhost origins (dev)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps) or any localhost origin
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Handles preflight OPTIONS automatically
app.use(express.json({ limit: '10mb' }));

// Connect DB
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.log('No MONGO_URI found, initializing mongodb-memory-server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully!');

    // Seed dummy posts automatically if none exist
    const Post = require('./models/Post');
    const User = require('./models/User');
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log('Seeding 20 agriculture posts into the database...');
      
      let admin = await User.findOne({ email: 'recruiter@agrilinked.com' });
      if (!admin) {
        admin = await User.create({
          role: 'farmer',
          name: 'AgriLinked Careers',
          email: 'recruiter@agrilinked.com',
          password: 'password123',
          phone: '+91 8217469646'
        });
      }

      const postsData = [
        { text: 'We are expanding our Operations! Looking for an experienced **Farm Operator** to handle heavy machinery and automated irrigation systems. Competitive salary and housing provided. Apply now! #FarmOperator #Hiring #AgricultureJobs #FarmLife' },
        { text: 'Urgent hiring for **Dairy Farm Hands** in the midwest. You will be responsible for milking, feeding, and maintaining herd health. Join a compassionate team dedicated to animal welfare. #DairyFarm #Hiring #AnimalCare #Farming' },
        { text: 'Are you a tech-savvy agriculture enthusiast? Join our team as a **Precision Ag Technician**! You will operate agricultural drones, analyze crop health data, and work with IoT sensors. #PrecisionAg #AgTech #DronePilot #Innovation' },
        { text: 'Harvest season is here! We need 50+ seasonal **Harvest Workers** for our upcoming apple and peach harvest. Transportation from the main city and daily meals provided. Experience preferred but bringing a strong work ethic is a must! #HarvestTeam #NowHiring #FarmJobs #SeasonalWork' },
        { text: 'Looking for a **Crop Manager** with 5+ years of experience in organic farming practices. You will oversee 500 acres of organic soybeans. Great benefits included. #OrganicFarming #CropManager #AgCareers' },
        { text: 'Exciting opportunity for an **Agronomist** to join our research facility. Help us develop drought-resistant wheat varieties and sustainable soil management protocols. Master\'s degree required. #Agronomy #Research #Sustainability #WheatFarming' },
        { text: 'We need qualified **Tractor Drivers** for the upcoming planting season. Must have a valid commercial license and experience with John Deere equipment. #TractorDriver #PlantingSeason #FarmMachinery' },
        { text: 'Join our logistics team! Hiring **Agricultural Delivery Drivers** to transport fresh produce from our packhouse to regional distribution centers. CDL required. #Logistics #DeliveryDriver #FreshProduce' },
        { text: 'Our state-of-the-art greenhouse is looking for a **Greenhouse Supervisor**. You will manage climate control systems, pest management, and a team of 10 workers. #Greenhouse #Horticulture #SupervisorJobs' },
        { text: 'Hiring a **Livestock Manager** for a 1000-head cattle ranch. Responsibilities include pasture management, breeding programs, and veterinary coordination. #LivestockManagement #RanchLife #Cattle' },
        { text: 'We are seeking an **Irrigation Specialist** to design and maintain efficient water delivery systems across 2000 acres of mixed crops. Help us conserve water! #Irrigation #WaterManagement #AgJobs' },
        { text: 'Open position: **Packhouse Manager**. Supervise the sorting, cleaning, and packaging of fresh vegetables. Ensure compliance with food safety standards. #Packhouse #FoodSafety #AgriBusiness' },
        { text: 'Looking for a skilled **Agricultural Mechanic** to maintain and repair our fleet of tractors, combines, and implements. Competitive pay and tool allowance. #AgMechanic #FarmEquipment #RepairJobs' },
        { text: 'Join our sales team! We are hiring an **Agricultural Sales Representative** to sell seed and fertilizer to local farmers. Strong communication skills needed. #AgSales #SeedSales #Fertilizer' },
        { text: 'Hiring a **Farm Accountant** to handle payroll, budgeting, and financial reporting for our family-owned farm. Agriculture accounting experience is a plus. #FarmFinance #AccountantJobs #AgBusiness' },
        { text: 'Need experienced **Fruit Pickers** for the upcoming citrus harvest. Pay is per bin. Excellent earning potential for fast workers! #FruitPicking #CitrusHarvest #SeasonalJobs' },
        { text: 'We are looking for a **Soil Scientist** to consult on crop rotation and soil amendment strategies. Help us improve our yield sustainably. #SoilScience #Sustainability #AgConsulting' },
        { text: 'Hiring a **Poultry Farm Worker** for a modern, cage-free facility. Duties include collecting eggs, monitoring feed/water, and ensuring bird health. #PoultryFarming #CageFree #FarmWork' },
        { text: 'Looking for an **Agricultural Extension Officer** to educate and support local farmers with the latest best practices and technologies. #AgExtension #FarmerSupport #Education' },
        { text: 'Open position: **Vineyard Manager**. Oversee all aspects of viticulture, from pruning to harvest. Passion for wine grapes is a must! #Viticulture #VineyardManagement #WineJobs' }
      ];

      for (let post of postsData) {
        await Post.create({
          author: admin._id,
          text: post.text,
          hashtags: post.text.match(/#[a-z0-9_]+/gi)?.map(tag => tag.slice(1).toLowerCase()) || []
        });
      }
      console.log('Successfully seeded 20 posts!');
    }

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/messages', require('./routes/messages'));

// Setup Socket.io
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      const newMsg = new Message({ senderId, receiverId, content });
      await newMsg.save();
      io.to(receiverId).emit('message', newMsg);
      socket.emit('messageSent', newMsg);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
