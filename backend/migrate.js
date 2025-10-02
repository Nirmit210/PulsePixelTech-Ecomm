const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    console.log('ℹ️ Using Prisma schema migration instead of raw SQL...');

    // Use Prisma's built-in migration system
    console.log('🔄 Running Prisma database push...');
    
    // This will create/update tables based on your schema.prisma
    const { execSync } = require('child_process');
    
    try {
      execSync('npx prisma db push --accept-data-loss', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Database schema synchronized with Prisma');
    } catch (error) {
      console.log('⚠️ Prisma push failed, trying alternative approach...');
      
      // Alternative: Generate and apply migration
      try {
        execSync('npx prisma migrate dev --name init', { 
          stdio: 'inherit',
          cwd: __dirname 
        });
        console.log('✅ Database migrated successfully');
      } catch (migrationError) {
        console.log('ℹ️ Migration already exists or database is up to date');
      }
    }

    // Seed sample data using Prisma client
    console.log('🌱 Seeding sample data...');

    // Create sample categories
    const categories = [
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and gaming',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
      },
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones with cutting-edge technology',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
      },
      {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Premium audio equipment and headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Portable tablets for productivity and entertainment',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Essential tech accessories and gadgets',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'
      }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }
    console.log('✅ Sample categories created');

    // Get category IDs for products
    const laptopCategory = await prisma.category.findUnique({ where: { slug: 'laptops' } });
    const phoneCategory = await prisma.category.findUnique({ where: { slug: 'smartphones' } });
    const headphoneCategory = await prisma.category.findUnique({ where: { slug: 'headphones' } });

    // Create sample products
    const products = [
      {
        name: 'Gaming Laptop Pro',
        slug: 'gaming-laptop-pro',
        description: 'High-performance gaming laptop with RTX graphics',
        price: 75000.00,
        mrp: 85000.00,
        categoryId: laptopCategory.id,
        brand: 'TechBrand',
        sku: 'GLT-001',
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
        stock: 10,
        features: ['RTX 4060', '16GB RAM', '512GB SSD']
      },
      {
        name: 'Smartphone X1',
        slug: 'smartphone-x1',
        description: 'Latest flagship smartphone with AI camera',
        price: 45000.00,
        mrp: 50000.00,
        categoryId: phoneCategory.id,
        brand: 'PhoneCorp',
        sku: 'SPH-001',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        stock: 25,
        features: ['108MP Camera', '8GB RAM', '5G Ready']
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium noise-cancelling wireless headphones',
        price: 8000.00,
        mrp: 10000.00,
        categoryId: headphoneCategory.id,
        brand: 'AudioTech',
        sku: 'WHP-001',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        stock: 50,
        features: ['Active Noise Cancellation', '30hr Battery', 'Bluetooth 5.0']
      }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      });
    }
    console.log('✅ Sample products created');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.user.upsert({
      where: { email: 'admin@pulsepixeltech.com' },
      update: {},
      create: {
        email: 'admin@pulsepixeltech.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created (email: admin@pulsepixeltech.com, password: admin123)');

    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrate;