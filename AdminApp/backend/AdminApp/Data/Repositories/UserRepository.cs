using AdminApp.Data.Repositories.Interfaces;
using AdminApp.DTOs.Auth;
using Dapper;

namespace AdminApp.Data.Repositories;

public class UserRepository: IUserRepository
{
    private readonly DbContext _db;
    public UserRepository(DbContext db) => _db = db;

    public async Task<User?> GetByIdAsync(int id)
    {
        using var conn = _db.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(
            "SELECT TOP 1 * FROM Users WHERE Id = @id", new { id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var conn = _db.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(
            "SELECT Id, Email, PasswordHash, Role FROM Users WHERE Email = @email",
            new { email });
    }
}
