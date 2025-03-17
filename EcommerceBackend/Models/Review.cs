using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceBackend.Models
{
    public class Review
    {
        [Key] // Primary Key
        public int Id { get; set; }

        [Required(ErrorMessage = "Product ID is required.")]
        public int ProductId { get; set; }  // Foreign Key

        [Required(ErrorMessage = "User is required.")]
        [StringLength(100, ErrorMessage = "User name cannot exceed 100 characters.")]
        public string User { get; set; } = string.Empty;

        [Required(ErrorMessage = "Comment is required.")]
        [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string Comment { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rating (Stars) is required.")]
        [Range(1, 5, ErrorMessage = "Stars must be between 1 and 5.")]
        public int Stars { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }  // Navigation Property
    }
}
