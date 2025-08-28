using AdminApp.DTOs.Auth;

namespace AdminApp.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse?> Login(string email, string password);
        Task<AuthResponse?> RefreshToken(string refreshToken);
        Task<User?> ValidateUserAsync(string email, string password);
        Task<AuthResponse?> GenerateTokens(User user);
        Task Logout(string refreshToken);
        Task<User?> CheckMeAsync(int userId);
    }
}
