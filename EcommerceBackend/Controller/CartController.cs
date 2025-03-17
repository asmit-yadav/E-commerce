using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace EcommerceBackend.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CartController> _logger;

        public CartController(AppDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all cart items for a user by UserId
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>A list of cart items for the user</returns>
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItems(int userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Include(ci => ci.Product)
                    .Where(ci => ci.UserId == userId)
                    .ToListAsync();

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching cart items for user {userId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Add item to the cart
        /// </summary>
        /// <param name="cartItem">The cart item to be added</param>
        /// <returns>The created cart item</returns>
        [HttpPost]
        public async Task<ActionResult<CartItem>> AddToCart(CartItem cartItem)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var product = await _context.Products.FindAsync(cartItem.ProductId);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetCartItems), new { userId = cartItem.UserId }, cartItem);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error adding item to cart: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update cart item quantity
        /// </summary>
        /// <param name="id">Cart item ID</param>
        /// <param name="updatedItem">Updated cart item details</param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, CartItem updatedItem)
        {
            try
            {
                if (id != updatedItem.Id)
                    return BadRequest(new { message = "Mismatched Cart Item ID" });

                var existingItem = await _context.CartItems.FindAsync(id);
                if (existingItem == null)
                    return NotFound(new { message = "Cart item not found" });

                existingItem.Quantity = updatedItem.Quantity;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating cart item with ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Remove item from cart
        /// </summary>
        /// <param name="id">Cart item ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            try
            {
                var cartItem = await _context.CartItems.FindAsync(id);
                if (cartItem == null)
                    return NotFound(new { message = "Cart item not found" });

                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error removing cart item with ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Clear the cart by removing selected cart items
        /// </summary>
        /// <param name="request">Request with cart item IDs to be removed</param>
        /// <returns>Success or error message</returns>
        [HttpPost("clear")]
        public async Task<IActionResult> ClearCart([FromBody] CartClearRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request == null || request.CartItemIds == null || request.CartItemIds.Count == 0)
                {
                    return BadRequest(new { message = "No cart items provided." });
                }

                var cartItems = await _context.CartItems
                    .Where(c => request.CartItemIds.Contains(c.Id))
                    .ToListAsync();
                
                if (cartItems.Count == 0)
                {
                    return NotFound(new { message = "No cart items found to delete." });
                }

                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Cart cleared successfully!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error clearing the cart: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    public class CartClearRequest
    {
        public List<int> CartItemIds { get; set; }
    }
}
