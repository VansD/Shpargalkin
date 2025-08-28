using AdminApp.DTOs.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AdminApp.Helpers
{
    public static class JwtTokenHelper
    {
        public static AuthResponse GenerateTokens(User user, IConfiguration config)
        {
            var jwtSection = config.GetSection("Jwt");
            var key = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key not found in config");
            var issuer = jwtSection["Issuer"] ?? "ShpargalkinAdmin";
            var audience = jwtSection["Audience"] ?? "ShpargalkinAdminUsers";
            var expiresIn = int.TryParse(jwtSection["AccessTokenExpiresIn"], out var exp) ? exp : 3600;

            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

            var keyBytes = Encoding.UTF8.GetBytes(key);
            var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddSeconds(expiresIn),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var accessToken = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

            // refreshToken можно сделать как GUID (для простоты)
            var refreshToken = Guid.NewGuid().ToString("N");

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = expiresIn
            };
        }
    }
}
