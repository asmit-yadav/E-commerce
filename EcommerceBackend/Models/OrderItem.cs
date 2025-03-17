using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceBackend.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; } // Primary Key
        
        [Required(ErrorMessage = "Order ID is required.")]
        public int OrderId { get; set; } // Foreign Key (Links to Order)

        [ForeignKey("OrderId")]
        public Order Order { get; set; } // Navigation property

        [Required(ErrorMessage = "Product ID is required.")]
        public int ProductId { get; set; } // Product being ordered
        
        [ForeignKey("ProductId")]
        public Product Product { get; set; } // ✅ Added navigation property for easy querying

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; } // Quantity of the product

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; } // Price per unit of the product
    }
}
