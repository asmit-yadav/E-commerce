using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcommerceBackend.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(AppDbContext context, ILogger<ReviewController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all reviews for a specific product.
        /// </summary>
        /// <param name="productId">The ID of the product for which reviews are fetched.</param>
        /// <returns>List of reviews for the specified product.</returns>
        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching reviews for product {productId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Add a new review for a product.
        /// </summary>
        /// <param name="review">The review to be added.</param>
        /// <returns>The created review.</returns>
        [HttpPost]
        public async Task<ActionResult<Review>> AddReview(Review review)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var product = await _context.Products.FindAsync(review.ProductId);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetReviews), new { productId = review.ProductId }, review);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error adding review for product {review.ProductId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete a review by ID.
        /// </summary>
        /// <param name="id">The ID of the review to be deleted.</param>
        /// <returns>Success or failure message.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null)
                    return NotFound(new { message = "Review not found" });

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error deleting review {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
