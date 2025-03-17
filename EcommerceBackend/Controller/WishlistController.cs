using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcommerceBackend.Controllers
{
    [Route("api/wishlist")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WishlistController> _logger;

        public WishlistController(AppDbContext context, ILogger<WishlistController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all wishlist items for a user by UserId.
        /// </summary>
        /// <param name="userId">The ID of the user whose wishlist items are fetched.</param>
        /// <returns>List of wishlist items for the user.</returns>
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<WishlistItem>>> GetWishlistItems(int userId)
        {
            try
            {
                var wishlistItems = await _context.WishlistItems
                    .Include(wi => wi.Product)
                    .Where(wi => wi.UserId == userId)
                    .ToListAsync();

                return Ok(wishlistItems);
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"Error fetching wishlist items for user {userId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Add an item to the wishlist.
        /// </summary>
        /// <param name="wishlistItem">The item to be added to the wishlist.</param>
        /// <returns>The added wishlist item.</returns>
        [HttpPost]
        public async Task<ActionResult<WishlistItem>> AddToWishlist(WishlistItem wishlistItem)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var product = await _context.Products.FindAsync(wishlistItem.ProductId);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                _context.WishlistItems.Add(wishlistItem);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetWishlistItems), new { userId = wishlistItem.UserId }, wishlistItem);
            }
            catch (System.Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error adding item to wishlist for user {wishlistItem.UserId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Remove an item from the wishlist by ID.
        /// </summary>
        /// <param name="id">The ID of the wishlist item to be removed.</param>
        /// <returns>No content status upon successful removal.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromWishlist(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var wishlistItem = await _context.WishlistItems.FindAsync(id);
                if (wishlistItem == null)
                    return NotFound(new { message = "Wishlist item not found" });

                _context.WishlistItems.Remove(wishlistItem);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (System.Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error removing item from wishlist with ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
