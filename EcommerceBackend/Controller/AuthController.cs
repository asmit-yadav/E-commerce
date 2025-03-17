using EcommerceBackend.Models;
using EcommerceBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>A list of users</returns>
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _context.Users.Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.PremiumUser // Include PremiumUser in response
                }).ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching users: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details or 404 if not found</returns>
        [HttpGet("user/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                var user = _context.Users.Where(u => u.Id == id).Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.PremiumUser // Include PremiumUser in response
                }).FirstOrDefault();

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching user with ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// User Registration (Signup)
        /// </summary>
        /// <param name="user">User details for registration</param>
        /// <returns>Success message with user data or error message</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Check if the user already exists
                if (_context.Users.Any(u => u.Email == user.Email))
                {
                    return BadRequest(new { message = "User already exists" });
                }

                // Hash the password before saving
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

                // Ensure that if PremiumUser is not set in request, it defaults to false
                if (user.PremiumUser == null) 
                {
                    user.PremiumUser = false;
                }

                // Add user and save changes within a transaction
                _context.Users.Add(user);
                _context.SaveChanges();

                // Commit the transaction
                transaction.Commit();

                // Generate token for the new user
                string token = GenerateJwtToken(user);

                return Ok(new { message = "User registered successfully", token, email = user.Email, userId = user.Id, premiumUser = user.PremiumUser });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError($"Error registering user: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// User Login
        /// </summary>
        /// <param name="request">Login credentials</param>
        /// <returns>JWT token or error message</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.PasswordHash, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                string token = GenerateJwtToken(user);
                return Ok(new { token, user.Email, userId = user.Id, premiumUser = user.PremiumUser });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login for user {request.Email}: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Generate JWT Token
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns>JWT token string</returns>
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("PremiumUser", user.PremiumUser.ToString())  // Include PremiumUser in token
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}
