/**
 * Seed Script for Fake Products
 * Run: node scripts/seedProducts.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { Admin } = require('../models/User');

const fakeProducts = [
  {
    name: 'Eco-Friendly Bamboo Water Bottle',
    variant: '500ml',
    detailLabel: 'Material',
    detailValue: '100% Organic Bamboo with Stainless Steel Interior',
    badge: 'bestseller',
    tag: 'eco-friendly',
    price: 'Rs. 1,299',
    rating: 4.8,
    reviews: 342,
    note: 'Keeps water cold for 24 hours',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    description: 'Premium bamboo water bottle with vacuum insulation. Perfect for eco-conscious individuals.',
    category: 'Drinkware',
    stock: 150,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Recycled Plastic Tote Bag',
    variant: 'Large',
    detailLabel: 'Capacity',
    detailValue: '15L - Made from 12 recycled bottles',
    badge: 'hot',
    tag: 'recycled',
    price: 'Rs. 899',
    rating: 4.6,
    reviews: 187,
    note: 'Durable and waterproof',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400',
    description: 'Stylish tote bag made entirely from recycled ocean plastic. Each bag saves 12 plastic bottles from landfills.',
    category: 'Bags',
    stock: 200,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Solar Powered Phone Charger',
    variant: '10000mAh',
    detailLabel: 'Power',
    detailValue: 'Dual USB Output with LED Flashlight',
    badge: 'new',
    tag: 'solar',
    price: 'Rs. 2,499',
    rating: 4.5,
    reviews: 89,
    note: 'Waterproof and shockproof',
    image: 'https://images.unsplash.com/photo-1509391111600-b8e8b6d82f4c?w=400',
    description: 'Harness the power of the sun with this portable solar charger. Perfect for outdoor adventures.',
    category: 'Electronics',
    stock: 75,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Organic Cotton T-Shirt',
    variant: 'Unisex',
    detailLabel: 'Fabric',
    detailValue: 'GOTS Certified Organic Cotton',
    badge: 'trending',
    tag: 'organic',
    price: 'Rs. 1,199',
    rating: 4.7,
    reviews: 256,
    note: 'Available in 6 colors',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    description: 'Super soft organic cotton t-shirt. Ethically made with zero harmful chemicals.',
    category: 'Apparel',
    stock: 300,
    inStock: true,
    featured: false,
    status: 'active'
  },
  {
    name: 'Biodegradable Smartphone Case',
    variant: 'Universal Fit',
    detailLabel: 'Material',
    detailValue: 'Plant-based Bioplastic',
    badge: 'new',
    tag: 'biodegradable',
    price: 'Rs. 699',
    rating: 4.4,
    reviews: 123,
    note: 'Decomposes in 2 years',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
    description: 'Protect your phone and the planet. This case breaks down naturally after disposal.',
    category: 'Accessories',
    stock: 180,
    inStock: true,
    featured: false,
    status: 'active'
  },
  {
    name: 'Reusable Beeswax Food Wraps',
    variant: 'Set of 6',
    detailLabel: 'Sizes',
    detailValue: '2 Small, 2 Medium, 2 Large',
    badge: 'bestseller',
    tag: 'zero-waste',
    price: 'Rs. 599',
    rating: 4.9,
    reviews: 412,
    note: 'Replaces plastic wrap',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
    description: 'Natural beeswax wraps that replace single-use plastic. Washable and reusable for up to a year.',
    category: 'Kitchen',
    stock: 250,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Bamboo Toothbrush Set',
    variant: 'Family Pack (4)',
    detailLabel: 'Bristles',
    detailValue: 'Charcoal-infused Nylon',
    badge: 'hot',
    tag: 'sustainable',
    price: 'Rs. 399',
    rating: 4.6,
    reviews: 567,
    note: 'Compostable handles',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    description: 'Switch to sustainable oral care. Bamboo handles with charcoal bristles for natural whitening.',
    category: 'Personal Care',
    stock: 400,
    inStock: true,
    featured: false,
    status: 'active'
  },
  {
    name: 'Upcycled Denim Backpack',
    variant: '20L',
    detailLabel: 'Source',
    detailValue: 'Made from discarded jeans',
    badge: 'limited',
    tag: 'upcycled',
    price: 'Rs. 1,899',
    rating: 4.7,
    reviews: 78,
    note: 'Each piece is unique',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'One-of-a-kind backpack crafted from upcycled denim. Sturdy, stylish, and sustainable.',
    category: 'Bags',
    stock: 50,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Plantable Seed Pencils',
    variant: 'Box of 10',
    detailLabel: 'Seeds',
    detailValue: 'Basil, Tomato, Sunflower varieties',
    badge: 'new',
    tag: 'plantable',
    price: 'Rs. 299',
    rating: 4.8,
    reviews: 234,
    note: 'Plant after use',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
    description: 'Pencils with seeds in the tip. When they get too short, plant them and watch them grow!',
    category: 'Stationery',
    stock: 500,
    inStock: true,
    featured: false,
    status: 'active'
  },
  {
    name: 'Recycled Glass Candle Set',
    variant: 'Trio Pack',
    detailLabel: 'Scents',
    detailValue: 'Lavender, Vanilla, Ocean Breeze',
    badge: 'sale',
    tag: 'recycled',
    price: 'Rs. 999',
    rating: 4.5,
    reviews: 156,
    note: 'Soy wax, cotton wicks',
    image: 'https://images.unsplash.com/photo-1602607753821-d7d0bf2f23a5?w=400',
    description: 'Handcrafted candles in recycled glass containers. Natural soy wax with essential oil fragrances.',
    category: 'Home Decor',
    stock: 120,
    inStock: true,
    featured: false,
    status: 'active'
  },
  {
    name: 'Cork Yoga Mat',
    variant: 'Standard (183cm x 61cm)',
    detailLabel: 'Thickness',
    detailValue: '5mm with natural rubber base',
    badge: 'trending',
    tag: 'natural',
    price: 'Rs. 3,499',
    rating: 4.9,
    reviews: 198,
    note: 'Anti-slip when wet',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    description: 'Premium yoga mat made from sustainable cork. Naturally antimicrobial and eco-friendly.',
    category: 'Fitness',
    stock: 80,
    inStock: true,
    featured: true,
    status: 'active'
  },
  {
    name: 'Stainless Steel Lunch Box',
    variant: '3-Tier',
    detailLabel: 'Capacity',
    detailValue: '1.5L total with leak-proof lids',
    badge: 'bestseller',
    tag: 'plastic-free',
    price: 'Rs. 1,599',
    rating: 4.7,
    reviews: 289,
    note: 'Dishwasher safe',
    image: 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=400',
    description: 'Durable stainless steel tiffin box. Perfect for meal prep and reducing plastic waste.',
    category: 'Kitchen',
    stock: 175,
    inStock: true,
    featured: true,
    status: 'active'
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create an admin user for createdBy field
    let adminUser = await Admin.findOne();

    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      console.log('You can create one by signing up with admin role on the website.');
      process.exit(1);
    }

    console.log(`Using admin user: ${adminUser.email}`);

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Add createdBy to each product
    const productsWithAdmin = fakeProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      publishedAt: new Date()
    }));

    // Insert products
    const result = await Product.insertMany(productsWithAdmin);
    console.log(`Successfully seeded ${result.length} products!`);

    // Display inserted products
    console.log('\nInserted Products:');
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
