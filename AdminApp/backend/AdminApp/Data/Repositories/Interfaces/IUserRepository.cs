using AdminApp.DTOs.Auth;

namespace AdminApp.Data.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
    }
}
