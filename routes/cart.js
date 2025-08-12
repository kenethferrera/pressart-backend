const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { code, size, quantity, price } = req.body;

    if (!code || !size || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'All fields (code, size, quantity, price) are required'
      });
    }

    if (!['S', 'M', 'L', 'XL'].includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size. Must be S, M, L, or XL'
      });
    }

    const total = price * quantity;

    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Add new item (with unique ID)
    const newItem = {
      code,
      size,
      quantity,
      price,
      total,
      addedAt: new Date()
    };

    cart.items.push(newItem);
    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item
// @access  Private
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { size, quantity, price } = req.body;

    if (!size || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Size, quantity, and price are required'
      });
    }

    if (!['S', 'M', 'L', 'XL'].includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size. Must be S, M, L, or XL'
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update item
    cart.items[itemIndex].size = size;
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = price;
    cart.items[itemIndex].total = price * quantity;

    await cart.save();

    res.json({
      success: true,
      message: 'Cart item updated',
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
});

// @route   POST /api/cart/sync
// @desc    Sync local cart with server (for login migration)
// @access  Private
router.post('/sync', auth, async (req, res) => {
  try {
    const { localCartItems } = req.body;

    if (!Array.isArray(localCartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Local cart items must be an array'
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Add local items to server cart (avoiding duplicates)
    for (const localItem of localCartItems) {
      if (localItem.code && localItem.size && localItem.quantity && localItem.price) {
        const newItem = {
          code: localItem.code,
          size: localItem.size,
          quantity: localItem.quantity,
          price: localItem.price,
          total: localItem.total || (localItem.price * localItem.quantity),
          addedAt: new Date()
        };
        cart.items.push(newItem);
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: `Cart synced successfully. ${localCartItems.length} items added.`,
      cart: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing cart'
    });
  }
});

module.exports = router;
