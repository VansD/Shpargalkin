namespace AdminApp.Data.Repositories.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(int userId, string refreshToken, DateTime expiryDate);
        Task<(int UserId, string RefreshToken, DateTime ExpiryDate)?> GetAsync(string refreshToken);
        Task UpdateAsync(string oldRefresh, string newRefresh, DateTime expiryDate);
        Task DeleteAsync(string refreshToken);
    }
}
