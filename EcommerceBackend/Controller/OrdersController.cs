using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceBackend.Models;
using EcommerceBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EcommerceBackend.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Place a new order.
        /// </summary>
        /// <param name="request">The order request containing order details.</param>
        /// <returns>Success or failure response.</returns>
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request == null || request.Items.Count == 0)
                {
                    return BadRequest(new { message = "Invalid order request." });
                }

                // Create order
                var order = new Order
                {
                    UserId = request.UserId,
                    TotalAmount = request.TotalAmount,
                    Address = request.Address,
                    PaymentMethod = request.PaymentMethod,
                    OrderDate = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Save to get OrderId

                // Add OrderItems with correct OrderId
                var orderItems = request.Items.Select(item => new OrderItem
                {
                    OrderId = order.OrderId, // Assign the correct OrderId
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = _context.Products.Find(item.ProductId)?.Price ?? 0 // Ensure Product exists
                }).ToList();

                _context.OrderItems.AddRange(orderItems);
                await _context.SaveChangesAsync(); // Save order items

                await transaction.CommitAsync();

                return Ok(new { message = "Order placed successfully!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error placing order: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get orders for a specific user by user ID.
        /// </summary>
        /// <param name="userId">The user ID to fetch orders for.</param>
        /// <returns>A list of orders for the user.</returns>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUser(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching orders for user {userId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Cancel an order by order ID.
        /// </summary>
        /// <param name="orderId">The order ID to cancel.</param>
        /// <returns>Success or failure response.</returns>
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    return NotFound(new { message = "Order not found." });
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Order cancelled successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error canceling order {orderId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get detailed information for a specific order.
        /// </summary>
        /// <param name="orderId">The order ID to fetch details for.</param>
        /// <returns>Detailed information about the order.</returns>
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    return NotFound(new { message = "Order not found." });
                }

                var response = new
                {
                    id = "ORD" + order.OrderId, // Unique ID
                    status = "Processing", // This status should be stored in the DB, but it's hardcoded for now
                    totalAmount = order.TotalAmount,
                    estimatedDelivery = order.OrderDate.AddDays(7).ToString("MMMM dd, yyyy"), // Example Delivery Date
                    startAddress = "Warehouse A, Mumbai",
                    endAddress = order.Address,
                    checkpoints = new List<object>
                    {
                        new { location = "Warehouse A", date = order.OrderDate.ToString("MMMM d, yyyy"), status = "Order Placed" },
                        new { location = "Dispatch Hub", date = order.OrderDate.AddDays(2).ToString("MMMM d, yyyy"), status = "Shipped" },
                        new { location = "Delhi Hub", date = order.OrderDate.AddDays(7).ToString("MMMM d, yyyy"), status = "Out for Delivery" }
                    },
                    items = order.OrderItems.Select(oi => new
                    {
                        name = oi.Product.Name,
                        price = oi.Price,
                        qty = oi.Quantity
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching order details for order {orderId}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
