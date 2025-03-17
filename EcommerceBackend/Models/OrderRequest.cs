using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EcommerceBackend.Models
{
    public class OrderRequest
    {
        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; } // ✅ Changed to `int` to match `User` model
        
        [Required(ErrorMessage = "Total amount is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than zero.")]
        public decimal TotalAmount { get; set; } // Total price
        
        [Required(ErrorMessage = "Shipping address is required.")]
        [StringLength(500, ErrorMessage = "Shipping address cannot be longer than 500 characters.")]
        public string Address { get; set; } // Shipping address
        
        [Required(ErrorMessage = "Payment method is required.")]
        [RegularExpression("^(COD|Card)$", ErrorMessage = "Payment method must be either 'COD' or 'Card'.")]
        public string PaymentMethod { get; set; } // COD or Card
        
        public DateTime? OrderDate { get; set; } = DateTime.UtcNow; // ✅ Optional OrderDate for API flexibility

        [Required(ErrorMessage = "Order items are required.")]
        public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>(); // ✅ Initialize to prevent null reference
    }

    public class OrderItemRequest
    {
        [Required(ErrorMessage = "Product ID is required.")]
        public int ProductId { get; set; } // Product ID

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; } // Quantity of the product
    }
}
