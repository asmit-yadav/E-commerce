using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceBackend.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; } // Primary Key
        
        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; } // User who placed the order

        [ForeignKey("UserId")]
        public User User { get; set; } // ✅ Added explicit foreign key reference
        
        [Required(ErrorMessage = "Total amount is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than zero.")]
        public decimal TotalAmount { get; set; } // Total price of the order
        
        [Required(ErrorMessage = "Shipping address is required.")]
        [StringLength(500, ErrorMessage = "Shipping address cannot be longer than 500 characters.")]
        public string Address { get; set; } // Shipping Address
        
        [Required(ErrorMessage = "Payment method is required.")]
        [RegularExpression("^(COD|Card)$", ErrorMessage = "Payment method must be either 'COD' or 'Card'.")]
        public string PaymentMethod { get; set; } // "COD" or "Card"
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; // Auto-filled order date
        
        // Navigation property (One Order -> Many OrderItems)
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // ✅ Initialize list to avoid null references
    }
}
