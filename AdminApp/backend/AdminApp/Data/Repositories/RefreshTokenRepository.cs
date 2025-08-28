using AdminApp.Data.Repositories.Interfaces;
using AdminApp.DTOs.Auth;
using Dapper;
using System.Data;

namespace AdminApp.Data.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly DbContext _db;
    public RefreshTokenRepository(DbContext db) => _db = db;

    public async Task AddAsync(int userId, string refreshToken, DateTime expiryDate)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "INSERT INTO UserRefreshTokens (UserId, RefreshToken, ExpiryDate) VALUES (@UserId, @RefreshToken, @ExpiryDate)",
            new { UserId = userId, RefreshToken = refreshToken, ExpiryDate = expiryDate });
    }

    public async Task<(int UserId, string RefreshToken, DateTime ExpiryDate)?> GetAsync(string refreshToken)
    {
        using var conn = _db.CreateConnection();
        var row = await conn.QueryFirstOrDefaultAsync<dynamic>(
            "SELECT UserId, RefreshToken, ExpiryDate FROM UserRefreshTokens WHERE RefreshToken = @RefreshToken",
            new { RefreshToken = refreshToken });

        if (row == null) return null;
        return ((int)row.UserId, (string)row.RefreshToken, (DateTime)row.ExpiryDate);
    }

    public async Task UpdateAsync(string oldRefresh, string newRefresh, DateTime expiryDate)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE UserRefreshTokens SET RefreshToken = @NewRefresh, ExpiryDate = @Expiry WHERE RefreshToken = @OldRefresh",
            new { NewRefresh = newRefresh, Expiry = expiryDate, OldRefresh = oldRefresh });
    }

    public async Task DeleteAsync(string refreshToken)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "DELETE FROM UserRefreshTokens WHERE RefreshToken = @RefreshToken",
            new { RefreshToken = refreshToken });
    }
}