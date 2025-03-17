using System.ComponentModel.DataAnnotations;

namespace EcommerceBackend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password hash is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";  // Default role

        public bool PremiumUser { get; set; } = false;  // New attribute, default is false
    }
}
