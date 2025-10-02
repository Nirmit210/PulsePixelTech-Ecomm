const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        phone VARCHAR(20),
        address TEXT,
        avatar VARCHAR(500),
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Users table created');

    // Create categories table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        parent_id INTEGER REFERENCES categories(id),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Categories table created');

    // Create products table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2),
        category_id INTEGER REFERENCES categories(id),
        brand VARCHAR(100),
        sku VARCHAR(100) UNIQUE,
        images TEXT[],
        stock INTEGER DEFAULT 0,
        weight DECIMAL(8,2),
        dimensions JSONB,
        specifications JSONB,
        features TEXT[],
        tags TEXT[],
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Products table created');

    // Create orders table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        shipping_address JSONB,
        billing_address JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Orders table created');

    // Create order_items table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Order items table created');

    // Create cart table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `;
    console.log('✅ Cart table created');

    // Create wishlist table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `;
    console.log('✅ Wishlist table created');

    // Create reviews table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT,
        is_verified BOOLEAN DEFAULT false,
        is_approved BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Reviews table created');

    // Insert sample categories
    await prisma.$executeRaw`
      INSERT INTO categories (name, slug, description, image) VALUES
      ('Laptops', 'laptops', 'High-performance laptops for work and gaming', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
      ('Smartphones', 'smartphones', 'Latest smartphones with cutting-edge technology', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'),
      ('Headphones', 'headphones', 'Premium audio equipment and headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
      ('Tablets', 'tablets', 'Portable tablets for productivity and entertainment', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'),
      ('Accessories', 'accessories', 'Essential tech accessories and gadgets', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500')
      ON CONFLICT (slug) DO NOTHING;
    `;
    console.log('✅ Sample categories inserted');

    // Insert sample products
    await prisma.$executeRaw`
      INSERT INTO products (name, slug, description, price, category_id, brand, sku, images, stock, features) VALUES
      ('Gaming Laptop Pro', 'gaming-laptop-pro', 'High-performance gaming laptop with RTX graphics', 75000.00, 1, 'TechBrand', 'GLT-001', ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'], 10, ARRAY['RTX 4060', '16GB RAM', '512GB SSD']),
      ('Smartphone X1', 'smartphone-x1', 'Latest flagship smartphone with AI camera', 45000.00, 2, 'PhoneCorp', 'SPH-001', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'], 25, ARRAY['108MP Camera', '8GB RAM', '5G Ready']),
      ('Wireless Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones', 8000.00, 3, 'AudioTech', 'WHP-001', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], 50, ARRAY['Active Noise Cancellation', '30hr Battery', 'Bluetooth 5.0'])
      ON CONFLICT (slug) DO NOTHING;
    `;
    console.log('✅ Sample products inserted');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.$executeRaw`
      INSERT INTO users (email, password, name, role) VALUES
      ('admin@pulsepixeltech.com', ${hashedPassword}, 'Admin User', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `;
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