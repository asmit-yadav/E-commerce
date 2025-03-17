using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceBackend.Models
{
    public class WishlistItem
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; } // Foreign Key referencing User.Id

        [Required(ErrorMessage = "Product ID is required.")]
        [ForeignKey("Product")]
        public int ProductId { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public Product Product { get; set; } = null!;
    }
}
