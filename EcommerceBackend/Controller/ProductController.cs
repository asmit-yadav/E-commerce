using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EcommerceBackend.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductController> _logger;

        public ProductController(AppDbContext context, ILogger<ProductController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all products with their reviews.
        /// </summary>
        /// <returns>List of products with reviews.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var products = await _context.Products.Include(p => p.Reviews).ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching products: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update the rating of a product by its ID.
        /// </summary>
        /// <param name="id">The ID of the product to update.</param>
        /// <param name="request">The rating update request containing the new rating.</param>
        /// <returns>Success or failure response.</returns>
        [HttpPatch("{id}/update-rating")]
        public async Task<IActionResult> UpdateProductRating(int id, [FromBody] RatingUpdateRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                // Update Only Rating
                product.Rating = request.Rating;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { message = "Rating updated successfully", rating = product.Rating });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error updating product rating for product {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Request model for updating the product rating.
        /// </summary>
        public class RatingUpdateRequest
        {
            public double Rating { get; set; }
        }

        /// <summary>
        /// Get a specific product by ID with its reviews.
        /// </summary>
        /// <param name="id">The ID of the product to retrieve.</param>
        /// <returns>Details of the requested product.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Reviews)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound(new { message = "Product not found" });

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching product with ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Create a new product.
        /// </summary>
        /// <param name="product">The product details to create.</param>
        /// <returns>The created product details.</returns>
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error creating product: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update an existing product by ID.
        /// </summary>
        /// <param name="id">The ID of the product to update.</param>
        /// <param name="product">The product details to update.</param>
        /// <returns>Success or failure response.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest(new { message = "Mismatched Product ID" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingProduct = await _context.Products.FindAsync(id);
                if (existingProduct == null)
                    return NotFound(new { message = "Product not found" });

                existingProduct.Name = product.Name;
                existingProduct.Price = product.Price;
                existingProduct.Image = product.Image;
                existingProduct.Category = product.Category;
                existingProduct.Available = product.Available;
                existingProduct.Rating = product.Rating;
                existingProduct.Views = product.Views;
                existingProduct.Quantity = product.Quantity;
                existingProduct.Description = product.Description;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error updating product {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete a product by ID.
        /// </summary>
        /// <param name="id">The ID of the product to delete.</param>
        /// <returns>Success or failure response.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error deleting product {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
