import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Helper function to get user from token
function getUserFromToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        total: total.toFixed(2),
        count: cartItems.length
      }
    });

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: user.userId,
        productId: productId,
        quantity: quantity
      },
      include: {
        product: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });

  } catch (error) {
    console.error('Add to cart API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}