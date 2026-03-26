const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');

const seedData = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.log('No MONGO_URI found, initializing mongodb-memory-server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
      console.log('Created local memory server for seeding: ', mongoURI);
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully!');

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create a Farmer
    const farmer = new User({
      role: 'farmer',
      name: 'Ramesh Singh',
      email: 'ramesh@example.com',
      password,
      phone: '9876543210',
      profileImage: 'https://i.pravatar.cc/150?u=ramesh',
      profile: {
        farmSize: 15,
        cropTypes: ['Wheat', 'Corn'],
        location: { city: 'Punjab', state: 'Punjab' },
        rating: 4.8
      }
    });
    await farmer.save();

    // Create a Laborer
    const laborer = new User({
      role: 'laborer',
      name: 'Suresh Kumar',
      email: 'suresh@example.com',
      password,
      phone: '9876543211',
      profileImage: 'https://i.pravatar.cc/150?u=suresh',
      profile: {
        skills: ['Tractor Driving', 'Harvesting'],
        experience: 5,
        location: { city: 'Punjab', state: 'Punjab' },
        rating: 4.5
      }
    });
    await laborer.save();

    console.log('Created Users: Ramesh (Farmer), Suresh (Laborer)');

    const postsData = [
      { text: "Harvest completed today 🌾 We had a great yield this season. Thanks to the hardworking team!", hashtags: ['harvesting', 'agriculture'], author: farmer._id },
      { text: "Need 5 workers for tomorrow early morning field clearing. Good pay.", hashtags: ['labor', 'jobs'], author: farmer._id },
      { text: "Soil moisture is low, irrigation needed. Setting up the sprinklers today.", hashtags: ['irrigation', 'farming'], author: farmer._id },
      { text: "Looking for tractor driving work next week. 5 years of experience.", hashtags: ['tractor', 'hireme'], author: laborer._id },
      { text: "The new fertilizer mix is doing wonders for the corn crop! 🌽", hashtags: ['crops', 'corn'], author: farmer._id },
      { text: "Anyone renting out a combine harvester for next month?", hashtags: ['equipment', 'harvester'], author: farmer._id },
      { text: "Finished pruning the orchard. The sunset view was amazing.", hashtags: ['orchard', 'sunset'], author: laborer._id },
      { text: "Weather alert: Heavy rains expected this weekend. Secure your harvested crops!", hashtags: ['weather', 'alert'], author: farmer._id },
      { text: "Just bought a new Mahindra tractor! Ready to plow.", hashtags: ['tractor', 'machinery'], author: farmer._id },
      { text: "Need advice on pest control for tomato plants. Any organic suggestions?", hashtags: ['organic', 'pestcontrol'], author: farmer._id },
      { text: "Great day at the local farmers market. Sold out of fresh produce!", hashtags: ['market', 'fresh'], author: farmer._id },
      { text: "Looking for long-term contract work on a large farm.", hashtags: ['labor', 'contract'], author: laborer._id },
      { text: "The drones for crop monitoring are saving so much time.", hashtags: ['agritech', 'drones'], author: farmer._id },
      { text: "Who has experience with hydroponics setups?", hashtags: ['hydroponics', 'tech'], author: farmer._id },
      { text: "Remember to stay hydrated out in the fields today folks, it's 40°C!", hashtags: ['safety', 'summer'], author: laborer._id },
      { text: "Our community irrigation channel is finally repaired.", hashtags: ['community', 'water'], author: farmer._id },
      { text: "Looking for 2 skilled laborers for grape harvesting. Delicate work required.", hashtags: ['grapes', 'harvest'], author: farmer._id },
      { text: "Finished the certification course on sustainable farming practices.", hashtags: ['sustainable', 'education'], author: laborer._id },
      { text: "Wheat prices are up this week! Good news for the community.", hashtags: ['market', 'prices'], author: farmer._id },
      { text: "Testing the new automated feeding system for the dairy cows.", hashtags: ['dairy', 'automation'], author: farmer._id }
    ];

    await Post.insertMany(postsData);
    console.log(`Created ${postsData.length} dummy posts.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
