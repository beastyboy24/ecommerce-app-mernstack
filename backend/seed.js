const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  // Electronics
  {
    title: 'iPhone 17 Pro',
    category: 'Electronics',
    description: 'Latest iPhone with A19 chip, 48MP camera, and 5G support.',
    price: 119999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1759588073186-1d4ac7e33623?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBob25lJTIwMTclMjBwcm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Samsung S25 Ultra',
    category: 'Electronics',
    description: 'Premium smartphone with 200MP camera and Snapdragon 9.',
    price: 129999,
    stock: 8,
    image: 'data:image/jpeg;base64,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',
  },
  {
    title: 'Sony Wireless Earbuds',
    category: 'Electronics',
    description: 'True wireless earbuds with noise cancellation and 24-hour battery.',
    price: 7999,
    stock: 20,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8GDidUMFZGOjLzMmkGS32F7gwSr1StV8JeQ&s',
  },
  {
    title: 'MacBook Air M3',
    category: 'Electronics',
    description: 'Lightweight laptop with 16GB RAM and 512GB SSD.',
    price: 134999,
    stock: 5,
    image: 'data:image/jpeg;base64,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',
  },
  {
    title: 'Samsung 55" 4K Smart TV',
    category: 'Electronics',
    description: 'QLED 4K TV with HDR and smart features.',
    price: 74999,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c21hcnQlMjB0dnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Bose Soundbar 700',
    category: 'Electronics',
    description: 'Premium soundbar with Alexa and Bluetooth.',
    price: 59999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1657223143933-33ceab36ecb9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvc2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Apple Watch Series 10',
    category: 'Electronics',
    description: 'Advanced smartwatch with health tracking and GPS.',
    price: 39999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwcGxlJTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },

  // Footwear
  {
    title: 'Nike Air Zoom Pegasus 41',
    category: 'Footwear',
    description: 'High-performance running shoes with responsive cushioning.',
    price: 9999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    title: 'Puma RS-X3',
    category: 'Footwear',
    description: 'Stylish sneakers with bold design and comfort.',
    price: 7999,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
  },
  {
    title: 'Nike Air Max 270',
    category: 'Footwear',
    description: 'Casual sneakers with iconic Air Max cushioning.',
    price: 11999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1562687782-9f2fd422a334?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZSUyMGFpciUyMG1heCUyMDI3MHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Puma Future Rider',
    category: 'Footwear',
    description: 'Retro-inspired running shoes with vibrant colors.',
    price: 6999,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1715003132895-b10a23d3c90f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVtYSUyMHNob2VzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
  },

  // Accessories
  {
    title: 'Laptop Backpack',
    category: 'Accessories',
    description: 'Durable backpack with padded laptop compartment.',
    price: 1999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
  },
  {
    title: 'Ray-Ban Aviator Sunglasses',
    category: 'Accessories',
    description: 'Classic aviator sunglasses with UV protection.',
    price: 12999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1552337557-45792b252a2e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Leather Wallet',
    category: 'Accessories',
    description: 'Slim leather wallet with RFID protection.',
    price: 1499,
    stock: 30,
    image: 'https://plus.unsplash.com/premium_photo-1676999224991-8f3d35dbde54?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2FsbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Fitness Tracker Band',
    category: 'Accessories',
    description: 'Water-resistant fitness band with step and sleep tracking.',
    price: 2999,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },

  // Clothing
  {
    title: 'Nike Dri-FIT T-Shirt',
    category: 'Clothing',
    description: 'Breathable athletic T-shirt with moisture-wicking fabric.',
    price: 2499,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  },
  {
    title: 'Puma Hoodie',
    category: 'Clothing',
    description: 'Cozy hoodie with kangaroo pocket and logo.',
    price: 3999,
    stock: 15,
    image: 'https://plus.unsplash.com/premium_photo-1758611682260-b48867c4b05c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHVtYSUyMGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Denim Jacket',
    category: 'Clothing',
    description: 'Classic blue denim jacket with button closure.',
    price: 4999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1537465978529-d23b17165b3b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Graphic Tee',
    category: 'Clothing',
    description: 'Casual T-shirt with vibrant graphic print.',
    price: 999,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHQlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
  },

  // Miscellaneous
  {
    title: 'Wireless Mouse',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with adjustable DPI.',
    price: 1499,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
  },
  {
    title: 'Gaming Keyboard',
    category: 'Electronics',
    description: 'RGB mechanical keyboard with customizable keys.',
    price: 4999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1631449061775-c79df03a44f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtaW5nJTIwa2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Yoga Mat',
    category: 'Fitness',
    description: 'Non-slip yoga mat with 6mm cushioning.',
    price: 1999,
    stock: 20,
    image: 'https://plus.unsplash.com/premium_photo-1661776042506-9154882ba689?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Bluetooth Speaker',
    category: 'Electronics',
    description: 'Portable speaker with 10-hour battery life.',
    price: 3999,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1668649175276-fa4f96beb185?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJsdWV0b290aCUyMHNwZWFrZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Stainless Steel Water Bottle',
    category: 'Accessories',
    description: 'Insulated water bottle keeps drinks cold for 24 hours.',
    price: 1499,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
  },
  {
    title: 'Wireless Charger',
    category: 'Electronics',
    description: 'Fast wireless charger compatible with Qi-enabled devices.',
    price: 2499,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1615526674998-2ea0930bfe24?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBwbGUlMjBjaGFyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Ducati Panigale',
    category: 'Automobile',
    description: 'One of the fastest bike you can ever have',
    price: 2500000,
    stock: 111,
    image: 'https://images.unsplash.com/photo-1635094742897-3f0014ccc07b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    title: 'Trip to India',
    category: 'Travel & Tourism',
    description: 'Embrace Spirituality',
    price: 11000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1603755962670-a6f92be76d5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vdW50YWlucyUyMGluZGlhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Mahindra Thar',
    category: 'Vehicle',
    description: 'Conquer all terrains',
    price: 2000000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1730829633900-0d97444c2bc6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFoaW5kcmElMjB0aGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Gaming Laptop',
    category: 'Laptop',
    description: 'Plug in an enjoy your games',
    price: 150000,
    stock: 1,
    image: 'https://images.unsplash.com/photo-1698512475058-7975102960b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGdhbWluZyUyMGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    title: 'Camera',
    category: 'Photography',
    description: 'Professional camera suited for enthusiasts',
    price: 100000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1615747873253-4c4ad5633311?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
  },
  {
    title: 'Girl Tees',
    category: 'Clothing',
    description: 'Everyday wear',
    price: 1000,
    stock: 6,
    image: 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9kZWwlMjBnaXJsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000',
  },
  {
    title: 'Vivo X200 Pro',
    category: 'Phone',
    description: 'Professional camera Phone',
    price: 80000,
    stock: 11,
    image: 'https://images.unsplash.com/photo-1755318535396-cdb062dc60bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dml2byUyMHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000',

  },
 {
  title: 'Diwali Decorative lights',
  category: 'Decoration',
  description: 'Festive decoration',
  price: 1000,
  stock: 50,
  image: 'https://images.unsplash.com/photo-1700196799290-b0c155bb7f0c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpd2FsaSUyMGdpZnRzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Women clothing',
  category: 'Clothing',
  description: 'Comfy Warm Winter clothing',
  price: 6000,
  stock: 111,
  image: 'https://images.unsplash.com/photo-1668798870357-de8114a6eacf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZlbWFsZSUyMG1vZGVscyUyMHNsYXZpYyUyMHdpbnRlciUyMGNsb3RoZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Kawasaki Ninja',
  category: 'Vehicle',
  description: '500cc powerful, punchy motorcycle',
  price: 400000,
  stock: 33,
  image: 'https://images.unsplash.com/photo-1595472167001-dbe2069e1b07?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2F3YXNha2klMjBuaW5qYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Spiti valley excursion',
  category: 'Tour and Travel',
  description: 'Take a break and enjoy breathtaking scenic valley',
  price: 20000,
  stock: 5,
  image: 'https://plus.unsplash.com/premium_photo-1697729680546-2ef72b3073e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BpdGklMjB2YWxsZXklMjBoaW1hY2hhbCUyMHByYWRlc2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Refigerator',
  category: 'Home Appliances',
  description: 'Latest tech equipped Refrigerator',
  price: 40000,
  stock: 6,
  image: 'https://images.unsplash.com/photo-1630459065645-549fe5a56db4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVmcmlnZXJhdG9yfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000',

 },
 {
  title: 'Airpods Pro',
  category: 'Earbuds',
  description: 'The best quality earbuds in the market',
  price: 15000,
  stock: 4,
  image: 'https://images.unsplash.com/photo-1606741965509-717b9fdd6549?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFpcnBvZHMlMjBwcm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Racing helmets',
  category: 'Helmet',
  description: 'Protects your head and give you peace of mind',
  price: 4000,
  stock: 15,
  image: 'https://plus.unsplash.com/premium_photo-1744395627439-d55355978356?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJpa2VyJTIwaGVsbWV0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Jeep Wrangler',
  category: 'Vehicle',
  description: 'Lets you conquer terrains where you cannot even walk',
  price: 6000000,
  stock: 3,
  image: 'https://images.unsplash.com/photo-1579044587961-5e370f6080bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGplZXAlMjB3cmFuZ2xlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Royal Enfield Continental GT 650',
  category: 'Vehicle',
  description: 'Our Royalest Offering',
  price: 400000,
  stock: 3,
  image: 'https://images.unsplash.com/photo-1671538548902-2fadebdd0522?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm95YWwlMjBlbmZpZWxkJTIwY29udGluZW50YWwlMjBndHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Star Gazing',
  category: 'Travel & Tourism',
  description: 'Your escape away from chaos',
  price: '10000',
  stock: 6,
  image: 'https://images.unsplash.com/photo-1633872880116-f19a8e012bfe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmlnaHQlMjBza3klMjBsYWRha2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Dumbbells',
  category: 'Fitness',
  description: 'Get stronger',
  price: '500',
  stock: '1000',
  image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHVtYmJlbGxzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Vegetables',
  category: 'Edibles',
  description: 'Fresh vegetables',
  price: '300',
  stock: '30',
  image: 'https://plus.unsplash.com/premium_photo-1675798983878-604c09f6d154?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'BMW X5',
  category: 'Vehicle',
  description: 'Comfort with Ruggedness',
  price: '10000000',
  stock: '6',
  image: 'https://images.unsplash.com/photo-1635089917414-6da790da8479?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym13JTIweDV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 }
 ,
 {
  title: 'BMW M340i',
  category: 'Vehicle',
  description: 'Fast Faster Fastest',
  price: '6000000',
  stock: '8',
  image: 'https://images.unsplash.com/photo-1759428220159-95adc2021ea3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bTM0MGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 },
 {
  title: 'Iphone 16',
  category: 'Mobile',
  description: 'Built for you by you',
  price: '60000',
  stock: '100',
  image: 'https://images.unsplash.com/photo-1726839662712-83fadeddecff?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aXBob25lJTIwMTZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
 }


];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    address: '123 Admin St',
    role: 'admin',
  },
];

const seedData = async () => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Product.insertMany(products);
    await User.insertMany(users);
    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err.message);
    process.exit(1);
  }
};

seedData();