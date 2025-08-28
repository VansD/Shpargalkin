using AdminApp.Data.Repositories.Interfaces;
using AdminApp.DTOs.Auth;
using AdminApp.Helpers;
using AdminApp.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AdminApp.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IRefreshTokenRepository _refreshTokens;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository users, IRefreshTokenRepository refreshTokens, IConfiguration config)
        {
            _users = users;
            _refreshTokens = refreshTokens;
            _config = config;
        }

        public async Task<AuthResponse?> Login(string email, string password)
        {
            var user = await ValidateUserAsync(email, password);
            if (user == null) return null;

            var tokens = JwtTokenHelper.GenerateTokens(user, _config);
            await _refreshTokens.AddAsync(user.Id, tokens.RefreshToken, DateTime.UtcNow.AddDays(30));
            return tokens;
        }

        public async Task<AuthResponse?> GenerateTokens(User user)
        {
            var tokens = JwtTokenHelper.GenerateTokens(user, _config);
            await _refreshTokens.AddAsync(user.Id, tokens.RefreshToken, DateTime.UtcNow.AddDays(30));
            return tokens;
        }

        public async Task<User?> ValidateUserAsync(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email);
            if (user == null) return null;

            // Тут лучше использовать BCrypt или PBKDF2
            var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(password)));
            return user.PasswordHash == hash ? user : null;
        }

        public async Task<User?> CheckMeAsync(int userId)
        {
            var user = await _users.GetByIdAsync(userId);
            return user ?? null;
        }

        public async Task<AuthResponse?> RefreshToken(string refreshToken)
        {
            var tokenRow = await _refreshTokens.GetAsync(refreshToken);
            if (tokenRow == null || tokenRow.Value.ExpiryDate < DateTime.UtcNow)
                return null;

            var user = await _users.GetByIdAsync(tokenRow.Value.UserId);
            if (user == null)
                return null;

            var tokens = JwtTokenHelper.GenerateTokens(user, _config);
            await _refreshTokens.UpdateAsync(refreshToken, tokens.RefreshToken, DateTime.UtcNow.AddDays(30));
            return tokens;
        }

        public async Task Logout(string refreshToken)
        {
            await _refreshTokens.DeleteAsync(refreshToken);
        }
    }
}
