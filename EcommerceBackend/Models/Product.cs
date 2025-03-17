using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceBackend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Product image is required.")]
        public string Image { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required.")]
        [StringLength(50, ErrorMessage = "Category name cannot exceed 50 characters.")]
        public string Category { get; set; } = string.Empty;

        public bool Available { get; set; } = true;

        // New Fields
        [Range(0.0, 5.0, ErrorMessage = "Rating must be between 0 and 5.")]
        public double Rating { get; set; } = 0.0;

        [Range(0, int.MaxValue, ErrorMessage = "Views cannot be negative.")]
        public int Views { get; set; } = 0;

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; } = 1;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; } = string.Empty;

        // One-to-Many Relationship (Navigation Property)
        public List<Review> Reviews { get; set; } = new();
    }
}
